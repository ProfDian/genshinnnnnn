const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Mendapatkan semua talents untuk karakter tertentu
 */
const getCharacterTalents = async (req, res) => {
  try {
    const { characterId } = req.params;

    const talents = await prisma.characterTalent.findMany({
      where: { characterId: parseInt(characterId) },
      orderBy: { id: "asc" },
    });

    res.status(200).json(talents);
  } catch (error) {
    console.error("Get character talents error:", error);
    res.status(500).json({ message: "Error fetching character talents" });
  }
};

/**
 * Mendapatkan semua passive untuk karakter tertentu
 */
const getCharacterPassives = async (req, res) => {
  try {
    const { characterId } = req.params;

    const passives = await prisma.characterPassive.findMany({
      where: { characterId: parseInt(characterId) },
      orderBy: { passiveOrder: "asc" },
    });

    res.status(200).json(passives);
  } catch (error) {
    console.error("Get character passives error:", error);
    res.status(500).json({ message: "Error fetching character passives" });
  }
};

/**
 * Mendapatkan semua constellations untuk karakter tertentu
 */
const getCharacterConstellations = async (req, res) => {
  try {
    const { characterId } = req.params;

    const constellations = await prisma.characterConstellation.findMany({
      where: { characterId: parseInt(characterId) },
      orderBy: { constellationLevel: "asc" },
    });

    res.status(200).json(constellations);
  } catch (error) {
    console.error("Get character constellations error:", error);
    res
      .status(500)
      .json({ message: "Error fetching character constellations" });
  }
};

/**
 * Menambahkan talent untuk karakter
 */
const addCharacterTalent = async (req, res) => {
  try {
    const { characterId } = req.params;
    const { talentType, talentName, talentDescription } = req.body;

    // Validasi input
    if (!talentType || !talentName) {
      return res.status(400).json({
        message: "Talent type and name are required",
      });
    }

    // Cek apakah karakter ada
    const character = await prisma.character.findUnique({
      where: { id: parseInt(characterId) },
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    // Buat talent baru
    const talent = await prisma.characterTalent.create({
      data: {
        characterId: parseInt(characterId),
        talentType,
        talentName,
        talentDescription,
      },
    });

    res.status(201).json({
      message: "Character talent added successfully",
      talent,
    });
  } catch (error) {
    console.error("Add character talent error:", error);
    res.status(500).json({
      message: "Error adding character talent",
      error: error.message,
    });
  }
};

/**
 * Menambahkan passive untuk karakter
 */
const addCharacterPassive = async (req, res) => {
  try {
    const { characterId } = req.params;
    const { passiveOrder, passiveName, passiveDescription, unlockLevel } =
      req.body;

    // Validasi input
    if (!passiveName || passiveOrder === undefined) {
      return res.status(400).json({
        message: "Passive name and order are required",
      });
    }

    // Cek apakah karakter ada
    const character = await prisma.character.findUnique({
      where: { id: parseInt(characterId) },
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    // Buat passive baru
    const passive = await prisma.characterPassive.create({
      data: {
        characterId: parseInt(characterId),
        passiveOrder: parseInt(passiveOrder),
        passiveName,
        passiveDescription,
        unlockLevel: unlockLevel ? parseInt(unlockLevel) : null,
      },
    });

    res.status(201).json({
      message: "Character passive added successfully",
      passive,
    });
  } catch (error) {
    console.error("Add character passive error:", error);
    res.status(500).json({
      message: "Error adding character passive",
      error: error.message,
    });
  }
};

/**
 * Menambahkan constellation untuk karakter
 */
const addCharacterConstellation = async (req, res) => {
  try {
    const { characterId } = req.params;
    const { constellationLevel, constellationName, constellationDescription } =
      req.body;

    // Validasi input
    if (!constellationName || constellationLevel === undefined) {
      return res.status(400).json({
        message: "Constellation name and level are required",
      });
    }

    // Cek apakah karakter ada
    const character = await prisma.character.findUnique({
      where: { id: parseInt(characterId) },
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    // Get icon URL if uploaded
    const constellationIcon = req.file ? req.file.path : null;

    // Buat constellation baru
    const constellation = await prisma.characterConstellation.create({
      data: {
        characterId: parseInt(characterId),
        constellationLevel: parseInt(constellationLevel),
        constellationName,
        constellationDescription,
        constellationIcon,
      },
    });

    res.status(201).json({
      message: "Character constellation added successfully",
      constellation,
    });
  } catch (error) {
    console.error("Add character constellation error:", error);
    res.status(500).json({
      message: "Error adding character constellation",
      error: error.message,
    });
  }
};

/**
 * Bulk add talents, passives, dan constellations untuk karakter
 */
const bulkAddCharacterSkills = async (req, res) => {
  try {
    const { characterId } = req.params;
    const { talents, passives, constellations } = req.body;

    // Validasi input
    if (
      (!talents || !talents.length) &&
      (!passives || !passives.length) &&
      (!constellations || !constellations.length)
    ) {
      return res.status(400).json({
        message:
          "At least one of talents, passives, or constellations must be provided",
      });
    }

    // Cek apakah karakter ada
    const character = await prisma.character.findUnique({
      where: { id: parseInt(characterId) },
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    // Begin transaction
    const result = await prisma.$transaction(async (prisma) => {
      const results = {
        talents: [],
        passives: [],
        constellations: [],
      };

      // Add talents if provided
      if (talents && talents.length) {
        // Hapus talents yang ada
        await prisma.characterTalent.deleteMany({
          where: { characterId: parseInt(characterId) },
        });

        // Buat talents baru
        for (const talent of talents) {
          const newTalent = await prisma.characterTalent.create({
            data: {
              characterId: parseInt(characterId),
              talentType: talent.talentType,
              talentName: talent.talentName,
              talentDescription: talent.talentDescription,
            },
          });
          results.talents.push(newTalent);
        }
      }

      // Add passives if provided
      if (passives && passives.length) {
        // Hapus passives yang ada
        await prisma.characterPassive.deleteMany({
          where: { characterId: parseInt(characterId) },
        });

        // Buat passives baru
        for (const passive of passives) {
          const newPassive = await prisma.characterPassive.create({
            data: {
              characterId: parseInt(characterId),
              passiveOrder: passive.passiveOrder,
              passiveName: passive.passiveName,
              passiveDescription: passive.passiveDescription,
              unlockLevel: passive.unlockLevel
                ? parseInt(passive.unlockLevel)
                : null,
            },
          });
          results.passives.push(newPassive);
        }
      }

      // Add constellations if provided
      if (constellations && constellations.length) {
        // Hapus constellations yang ada
        await prisma.characterConstellation.deleteMany({
          where: { characterId: parseInt(characterId) },
        });

        // Buat constellations baru
        for (const constellation of constellations) {
          const newConstellation = await prisma.characterConstellation.create({
            data: {
              characterId: parseInt(characterId),
              constellationLevel: constellation.constellationLevel,
              constellationName: constellation.constellationName,
              constellationDescription: constellation.constellationDescription,
              constellationIcon: constellation.constellationIcon,
            },
          });
          results.constellations.push(newConstellation);
        }
      }

      return results;
    });

    res.status(201).json({
      message: "Character skills added successfully",
      ...result,
    });
  } catch (error) {
    console.error("Bulk add character skills error:", error);
    res.status(500).json({
      message: "Error adding character skills",
      error: error.message,
    });
  }
};

module.exports = {
  getCharacterTalents,
  getCharacterPassives,
  getCharacterConstellations,
  addCharacterTalent,
  addCharacterPassive,
  addCharacterConstellation,
  bulkAddCharacterSkills,
};
