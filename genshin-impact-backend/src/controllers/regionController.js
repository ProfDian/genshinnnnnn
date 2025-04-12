const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all regions
const getAllRegions = async (req, res) => {
  try {
    const regions = await prisma.region.findMany({
      include: {
        areas: true,
        features: true,
      },
    });

    res.status(200).json(regions);
  } catch (error) {
    console.error("Get regions error:", error);
    res.status(500).json({ message: "Error fetching regions" });
  }
};

// Get region by ID
const getRegionById = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await prisma.region.findUnique({
      where: { id: parseInt(id) },
      include: {
        areas: true,
        features: true,
      },
    });

    if (!region) {
      return res.status(404).json({ message: "Region not found" });
    }

    res.status(200).json(region);
  } catch (error) {
    console.error("Get region error:", error);
    res.status(500).json({ message: "Error fetching region" });
  }
};

// Get characters by region
async function getCharactersByRegion(req, res) {
  try {
    const regionId = parseInt(req.params.id);

    // Using Prisma's $queryRaw with correct table and column names based on your schema
    const characters = await prisma.$queryRaw`
      SELECT 
        c.id, c.name, c.title, c.icon, c.gacha_img,
        e.element_name AS elementName, e.element_color AS elementColor,
        wt.weapon_type_name AS weaponType,
        r.rarity_value AS rarity, r.rarity_color AS rarityColor
      FROM characters c
      LEFT JOIN elements e ON c.element_id = e.id
      LEFT JOIN weapon_types wt ON c.weapon_type_id = wt.id
      LEFT JOIN rarities r ON c.rarity_id = r.id
      WHERE c.region_id = ${regionId}
    `;

    res.json(characters);
  } catch (error) {
    console.error("Get characters by region error:", error);
    res.status(500).json({ error: "Failed to fetch characters" });
  }
}

// Create region (admin only)
const createRegion = async (req, res) => {
  try {
    const {
      regionName,
      overview,
      worldMap,
      archonQuest,
      associatedElement,
      archon,
      ideal,
      mainCity,
      controllingEntity,
      celebratedFestivals,
      howToAccess,
    } = req.body;

    // Get file URL if uploaded
    const regionIcon = req.file ? req.file.path : null;

    // Create region
    const region = await prisma.region.create({
      data: {
        regionName,
        overview,
        worldMap,
        archonQuest,
        associatedElement,
        archon,
        ideal,
        mainCity,
        controllingEntity,
        celebratedFestivals,
        howToAccess,
        regionIcon,
      },
    });

    res.status(201).json({
      message: "Region created successfully",
      region,
    });
  } catch (error) {
    console.error("Create region error:", error);
    res.status(500).json({ message: "Error creating region" });
  }
};

// Update region (admin only)
const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      regionName,
      overview,
      worldMap,
      archonQuest,
      associatedElement,
      archon,
      ideal,
      mainCity,
      controllingEntity,
      celebratedFestivals,
      howToAccess,
    } = req.body;

    // Prepare update data
    const updateData = {
      regionName,
      overview,
      worldMap,
      archonQuest,
      associatedElement,
      archon,
      ideal,
      mainCity,
      controllingEntity,
      celebratedFestivals,
      howToAccess,
    };

    // Add icon if uploaded
    if (req.file) {
      updateData.regionIcon = req.file.path;
    }

    // Update region
    const region = await prisma.region.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json({
      message: "Region updated successfully",
      region,
    });
  } catch (error) {
    console.error("Update region error:", error);
    res.status(500).json({ message: "Error updating region" });
  }
};

// Add region area (admin only)
const addRegionArea = async (req, res) => {
  try {
    const { regionId } = req.params;
    const { areaName, areaDescription } = req.body;

    // Get file URL if uploaded
    const areaImage = req.file ? req.file.path : null;

    // Create region area
    const area = await prisma.regionArea.create({
      data: {
        regionId: parseInt(regionId),
        areaName,
        areaDescription,
        areaImage,
      },
    });

    res.status(201).json({
      message: "Region area added successfully",
      area,
    });
  } catch (error) {
    console.error("Add region area error:", error);
    res.status(500).json({ message: "Error adding region area" });
  }
};

// Add region feature (admin only)
const addRegionFeature = async (req, res) => {
  try {
    const { regionId } = req.params;
    const { featureName, featureDescription } = req.body;

    // Create region feature
    const feature = await prisma.regionFeature.create({
      data: {
        regionId: parseInt(regionId),
        featureName,
        featureDescription,
      },
    });

    res.status(201).json({
      message: "Region feature added successfully",
      feature,
    });
  } catch (error) {
    console.error("Add region feature error:", error);
    res.status(500).json({ message: "Error adding region feature" });
  }
};

module.exports = {
  getAllRegions,
  getRegionById,
  getCharactersByRegion,
  createRegion,
  updateRegion,
  addRegionArea,
  addRegionFeature,
};
