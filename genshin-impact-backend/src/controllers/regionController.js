const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all regions
const getAllRegions = async (req, res) => {
  try {
    const regions = await prisma.region.findMany({
      include: {
        areas: {
          where: {
            deletedAt: null,
          },
        },
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
        areas: {
          where: {
            deletedAt: null,
          },
        },
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
      AND c.deleted_at IS NULL
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

// Delete region area (admin only)
const deleteRegionArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const { permanent } = req.query;

    if (permanent === "true") {
      // Hard delete
      await prisma.regionArea.delete({
        where: { id: parseInt(areaId) },
      });

      res.status(200).json({
        message: "Region area permanently deleted",
      });
    } else {
      // Soft delete
      await prisma.regionArea.update({
        where: { id: parseInt(areaId) },
        data: { deletedAt: new Date() },
      });

      res.status(200).json({
        message: "Region area soft deleted",
      });
    }
  } catch (error) {
    console.error("Delete region area error:", error);
    res.status(500).json({ message: "Error deleting region area" });
  }
};

// Get all deleted region areas (admin only)
const getDeletedRegionAreas = async (req, res) => {
  try {
    const deletedAreas = await prisma.regionArea.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
      include: {
        region: {
          select: {
            id: true,
            regionName: true,
          },
        },
      },
      orderBy: {
        deletedAt: "desc",
      },
    });

    res.status(200).json(deletedAreas);
  } catch (error) {
    console.error("Get deleted areas error:", error);
    res.status(500).json({ message: "Error fetching deleted areas" });
  }
};

// Restore a soft-deleted region area (admin only)
const restoreRegionArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    // Check if area exists and is soft-deleted
    const area = await prisma.regionArea.findUnique({
      where: { id: parseInt(areaId) },
    });

    if (!area) {
      return res.status(404).json({ message: "Region area not found" });
    }

    if (!area.deletedAt) {
      return res.status(400).json({ message: "Region area is not deleted" });
    }

    // Restore area by setting deletedAt to null
    const restoredArea = await prisma.regionArea.update({
      where: { id: parseInt(areaId) },
      data: { deletedAt: null },
    });

    res.status(200).json({
      message: "Region area restored successfully",
      area: restoredArea,
    });
  } catch (error) {
    console.error("Restore area error:", error);
    res.status(500).json({ message: "Error restoring region area" });
  }
};
// Update region area (admin only)
const updateRegionArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const { areaName, areaDescription } = req.body;

    // Prepare update data
    const updateData = {
      areaName,
      areaDescription,
    };

    // Add image URL if provided
    if (req.body.areaImage) {
      updateData.areaImage = req.body.areaImage;
    }

    // Update area
    const area = await prisma.regionArea.update({
      where: { id: parseInt(areaId) },
      data: updateData,
    });

    res.status(200).json({
      message: "Region area updated successfully",
      area,
    });
  } catch (error) {
    console.error("Update region area error:", error);
    res.status(500).json({ message: "Error updating region area" });
  }
};

// Update region feature (admin only)
const updateRegionFeature = async (req, res) => {
  try {
    const { featureId } = req.params;
    const { featureName, featureDescription } = req.body;

    // Update feature
    const feature = await prisma.regionFeature.update({
      where: { id: parseInt(featureId) },
      data: {
        featureName,
        featureDescription,
      },
    });

    res.status(200).json({
      message: "Region feature updated successfully",
      feature,
    });
  } catch (error) {
    console.error("Update region feature error:", error);
    res.status(500).json({ message: "Error updating region feature" });
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
  deleteRegionArea,
  getDeletedRegionAreas,
  restoreRegionArea,
  updateRegionArea,
  updateRegionFeature,
};
