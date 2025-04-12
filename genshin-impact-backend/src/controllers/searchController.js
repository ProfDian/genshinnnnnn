const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Advanced search functionality that can search across multiple entities
 */
const advancedSearch = async (req, res) => {
  try {
    const {
      query, // General search term
      entityType, // "character", "weapon", or "all"
      filters = {}, // JSON object containing filters
      sortBy, // Sort field
      sortOrder, // asc or desc
      page = 1,
      limit = 20,
    } = req.query;

    const parsedFilters =
      typeof filters === "string" ? JSON.parse(filters) : filters;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Results object to store all search results
    const results = {
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    };

    // Search characters if requested
    if (entityType === "character" || entityType === "all") {
      const characterWhere = buildCharacterFilters(query, parsedFilters);
      const characterOrderBy = buildCharacterOrderBy(sortBy, sortOrder);

      const [characters, characterCount] = await Promise.all([
        prisma.character.findMany({
          where: characterWhere,
          orderBy: characterOrderBy,
          skip: entityType === "all" ? 0 : skip,
          take: entityType === "all" ? 5 : take, // Limit results in combined search
          include: {
            element: true,
            weaponType: true,
            region: true,
            rarity: true,
          },
        }),
        prisma.character.count({ where: characterWhere }),
      ]);

      results.characters = characters;

      if (entityType === "character") {
        results.pagination.totalItems = characterCount;
        results.pagination.totalPages = Math.ceil(characterCount / take);
      }
    }

    // Search weapons if requested
    if (entityType === "weapon" || entityType === "all") {
      const weaponWhere = buildWeaponFilters(query, parsedFilters);
      const weaponOrderBy = buildWeaponOrderBy(sortBy, sortOrder);

      const [weapons, weaponCount] = await Promise.all([
        prisma.weapon.findMany({
          where: weaponWhere,
          orderBy: weaponOrderBy,
          skip: entityType === "all" ? 0 : skip,
          take: entityType === "all" ? 5 : take, // Limit results in combined search
          include: {
            weaponType: true,
            rarity: true,
          },
        }),
        prisma.weapon.count({ where: weaponWhere }),
      ]);

      results.weapons = weapons;

      if (entityType === "weapon") {
        results.pagination.totalItems = weaponCount;
        results.pagination.totalPages = Math.ceil(weaponCount / take);
      }
    }

    // For combined search, calculate total
    if (entityType === "all") {
      const totalItems =
        (results.characters?.length || 0) + (results.weapons?.length || 0);
      results.pagination.totalItems = totalItems;
      // In combined search, we don't have accurate pagination info
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Advanced search error:", error);
    res.status(500).json({
      message: "Error performing search",
      error: error.message,
    });
  }
};

/**
 * Helper function to build character filter conditions
 */
function buildCharacterFilters(query, filters) {
  const where = {
    deletedAt: null,
  };

  // Add text search if provided
  if (query) {
    where.OR = [{ name: { contains: query } }, { title: { contains: query } }];
  }

  // Add specific filters
  if (filters.elementId) where.elementId = parseInt(filters.elementId);
  if (filters.weaponTypeId) where.weaponTypeId = parseInt(filters.weaponTypeId);
  if (filters.regionId) where.regionId = parseInt(filters.regionId);
  if (filters.rarityId) where.rarityId = parseInt(filters.rarityId);

  return where;
}

/**
 * Helper function to build weapon filter conditions
 */
function buildWeaponFilters(query, filters) {
  const where = {
    deletedAt: null,
  };

  // Add text search if provided
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  // Add specific filters
  if (filters.weaponTypeId) where.weaponTypeId = parseInt(filters.weaponTypeId);
  if (filters.rarityId) where.rarityId = parseInt(filters.rarityId);
  if (filters.specialProperty)
    where.specialProperty = { contains: filters.specialProperty };

  return where;
}

/**
 * Helper function to build character ordering
 */
function buildCharacterOrderBy(sortBy, sortOrder) {
  const direction = sortOrder === "desc" ? "desc" : "asc";

  switch (sortBy) {
    case "releaseDate":
      return { releaseDate: direction };
    case "rarity":
      return { rarityId: direction };
    case "name":
    default:
      return { name: direction };
  }
}

/**
 * Helper function to build weapon ordering
 */
function buildWeaponOrderBy(sortBy, sortOrder) {
  const direction = sortOrder === "desc" ? "desc" : "asc";

  switch (sortBy) {
    case "rarity":
      return { rarityId: direction };
    case "name":
    default:
      return { name: direction };
  }
}

module.exports = {
  advancedSearch,
};
