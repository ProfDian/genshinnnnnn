const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Update character (admin only)
const getAllCharacters = async (req, res) => {
  try {
    const characters = await prisma.character.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        element: true,
        weaponType: true,
        region: true,
        rarity: true,
      },
    });

    res.status(200).json(characters);
  } catch (error) {
    console.error("Get characters error:", error);
    res.status(500).json({ message: "Error fetching characters" });
  }
};
const getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;

    const character = await prisma.character.findUnique({
      where: {
        id: parseInt(id),
        deletedAt: null,
      },
      include: {
        element: true,
        weaponType: true,
        region: true,
        rarity: true,
        stats: true,
        talents: true,
        passives: true,
        constellations: true,
      },
    });

    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }

    // Log user activity if logged in
    if (req.user) {
      await prisma.userActivity.create({
        data: {
          userId: req.user.id,
          activityType: "VIEW_CHARACTER",
          relatedId: parseInt(id),
        },
      });
    }

    res.status(200).json(character);
  } catch (error) {
    console.error("Get character error:", error);
    res.status(500).json({ message: "Error fetching character" });
  }
};
const createCharacter = async (req, res) => {
  try {
    const {
      id,
      name,
      title,
      detail,
      constellation,
      elementId,
      weaponTypeId,
      regionId,
      rarityId,
      birthday,
      releaseDate,
      native,
      cvEn,
      cvChs,
      cvJp,
      cvKr,
    } = req.body;

    // Dapatkan URL gambar jika diunggah
    const icon = req.files && req.files.icon ? req.files.icon[0].path : null;
    const gachaImg =
      req.files && req.files.gachaImg ? req.files.gachaImg[0].path : null;

    // Buat karakter baru
    const character = await prisma.character.create({
      data: {
        id: parseInt(id),
        name,
        title,
        detail,
        constellation,
        elementId: elementId ? parseInt(elementId) : null,
        weaponTypeId: weaponTypeId ? parseInt(weaponTypeId) : null,
        regionId: regionId ? parseInt(regionId) : null,
        rarityId: rarityId ? parseInt(rarityId) : null,
        icon,
        gachaImg,
        birthday,
        releaseDate: releaseDate ? BigInt(releaseDate) : null,
        native,
        cvEn,
        cvChs,
        cvJp,
        cvKr,
      },
    });

    res.status(201).json({
      message: "Character created successfully",
      character,
    });
  } catch (error) {
    console.error("Create character error:", error);
    res.status(500).json({ message: "Error creating character" });
  }
};
const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      title,
      detail,
      constellation,
      elementId,
      weaponTypeId,
      regionId,
      rarityId,
      birthday,
      releaseDate,
      native,
      cvEn,
      cvChs,
      cvJp,
      cvKr,
    } = req.body;

    // Get file URLs if uploaded
    const updateData = {
      name,
      title,
      detail,
      constellation,
      elementId: elementId ? parseInt(elementId) : null,
      weaponTypeId: weaponTypeId ? parseInt(weaponTypeId) : null,
      regionId: regionId ? parseInt(regionId) : null,
      rarityId: rarityId ? parseInt(rarityId) : null,
      birthday,
      releaseDate: releaseDate ? BigInt(releaseDate) : null,
      native,
      cvEn,
      cvChs,
      cvJp,
      cvKr,
    };

    // Add image URLs if provided
    if (req.files && req.files.icon) {
      updateData.icon = req.files.icon[0].path;
    }

    if (req.files && req.files.gachaImg) {
      updateData.gachaImg = req.files.gachaImg[0].path;
    }

    // Update character
    const character = await prisma.character.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      message: "Character updated successfully",
      character,
    });
  } catch (error) {
    console.error("Update character error:", error);
    res.status(500).json({ message: "Error updating character" });
  }
};

// Delete character (admin only)
const deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;

    if (permanent === "true") {
      // Hard delete
      await prisma.character.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({
        message: "Character permanently deleted",
      });
    } else {
      // Soft delete
      await prisma.character.update({
        where: { id: parseInt(id) },
        data: { deletedAt: new Date() },
      });

      res.status(200).json({
        message: "Character soft deleted",
      });
    }
  } catch (error) {
    console.error("Delete character error:", error);
    res.status(500).json({ message: "Error deleting character" });
  }
};

// Bulk import characters
const bulkImportCharacters = async (req, res) => {
  try {
    const charactersData = JSON.parse(req.body.charactersJson);
    const images = req.files;

    // Process each character
    const createdCharacters = await Promise.all(
      charactersData.map(async (charData, index) => {
        // Find matching image if available
        let icon = null;
        let gachaImg = null;

        if (images && images.length > index) {
          icon = images[index].path;
        }

        // Create character in database
        return prisma.character.create({
          data: {
            id: parseInt(charData.id),
            name: charData.name,
            title: charData.title,
            detail: charData.detail,
            constellation: charData.constellation,
            elementId: charData.elementId ? parseInt(charData.elementId) : null,
            weaponTypeId: charData.weaponTypeId
              ? parseInt(charData.weaponTypeId)
              : null,
            regionId: charData.regionId ? parseInt(charData.regionId) : null,
            rarityId: charData.rarityId ? parseInt(charData.rarityId) : null,
            icon,
            gachaImg,
            birthday: charData.birthday,
            releaseDate: charData.releaseDate
              ? BigInt(charData.releaseDate)
              : null,
            native: charData.native,
            cvEn: charData.cvEn,
            cvChs: charData.cvChs,
            cvJp: charData.cvJp,
            cvKr: charData.cvKr,
          },
        });
      })
    );

    res.status(201).json({
      message: `Successfully imported ${createdCharacters.length} characters`,
      characters: createdCharacters,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    res.status(500).json({ message: "Error importing characters" });
  }
};

module.exports = {
  getAllCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  bulkImportCharacters,
};
