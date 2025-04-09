const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Seed Weapon Types
  const weaponTypes = [
    { id: 1, weaponTypeName: "Sword", weaponTypeIcon: "" },
    { id: 2, weaponTypeName: "Claymore", weaponTypeIcon: "" },
    { id: 3, weaponTypeName: "Polearm", weaponTypeIcon: "" },
    { id: 4, weaponTypeName: "Bow", weaponTypeIcon: "" },
    { id: 5, weaponTypeName: "Catalyst", weaponTypeIcon: "" },
  ];

  for (const type of weaponTypes) {
    await prisma.weaponType.upsert({
      where: { id: type.id },
      update: {
        weaponTypeName: type.weaponTypeName,
        weaponTypeIcon: type.weaponTypeIcon,
      },
      create: type,
    });
  }

  // Seed Rarities
  const rarities = [
    { id: 1, rarityValue: 1, rarityColor: "#AAAAAA" },
    { id: 2, rarityValue: 2, rarityColor: "#88CC88" },
    { id: 3, rarityValue: 3, rarityColor: "#5599FF" },
    { id: 4, rarityValue: 4, rarityColor: "#CC66FF" },
    { id: 5, rarityValue: 5, rarityColor: "#FFCC33" },
  ];

  for (const rarity of rarities) {
    await prisma.rarity.upsert({
      where: { id: rarity.id },
      update: {
        rarityValue: rarity.rarityValue,
        rarityColor: rarity.rarityColor,
      },
      create: rarity,
    });
  }

  // Seed Regions
  const regions = [
    {
      id: 1,
      regionName: "Mondstadt",
      overview: "A city of freedom that lies in the northeast of Teyvat.",
      worldMap: "Teyvat",
      archonQuest: "Prologue: The Outlander Who Caught the Wind",
      associatedElement: "Anemo",
      archon: "Barbatos",
      ideal: "Freedom",
      mainCity: "Mondstadt City",
      controllingEntity: "Knights of Favonius",
      regionIcon: "",
    },
    {
      id: 2,
      regionName: "Liyue",
      overview: "A port city built on a giant rock formation in Teyvat.",
      worldMap: "Teyvat",
      archonQuest: "Chapter I: Farewell, Archaic Lord",
      associatedElement: "Geo",
      archon: "Morax",
      ideal: "Contracts",
      mainCity: "Liyue Harbor",
      controllingEntity: "Liyue Qixing",
      regionIcon: "",
    },
    {
      id: 3,
      regionName: "Inazuma",
      overview: "An island nation closed off from the rest of Teyvat.",
      worldMap: "Teyvat",
      archonQuest: "Chapter II: Immovable God and the Eternal Euthymia",
      associatedElement: "Electro",
      archon: "Raiden Shogun",
      ideal: "Eternity",
      mainCity: "Inazuma City",
      controllingEntity: "Tri-Commission",
      regionIcon: "",
    },
    {
      id: 4,
      regionName: "Sumeru",
      overview: "A land of both lush rainforests and harsh deserts.",
      worldMap: "Teyvat",
      archonQuest: "Chapter III: Truth Amongst the Pages of Purana",
      associatedElement: "Dendro",
      archon: "Lesser Lord Kusanali",
      ideal: "Wisdom",
      mainCity: "Sumeru City",
      controllingEntity: "Akademiya",
      regionIcon: "",
    },
    {
      id: 5,
      regionName: "Fontaine",
      overview: "A nation of justice and advanced technology.",
      worldMap: "Teyvat",
      archonQuest: "Chapter IV: Masquerade of the Guilty",
      associatedElement: "Hydro",
      archon: "Focalors",
      ideal: "Justice",
      mainCity: "Court of Fontaine",
      controllingEntity: "Fontaine Courts",
      regionIcon: "",
    },
  ];

  for (const region of regions) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: {
        regionName: region.regionName,
        overview: region.overview,
        worldMap: region.worldMap,
        archonQuest: region.archonQuest,
        associatedElement: region.associatedElement,
        archon: region.archon,
        ideal: region.ideal,
        mainCity: region.mainCity,
        controllingEntity: region.controllingEntity,
        regionIcon: region.regionIcon,
      },
      create: region,
    });
  }

  // Seed Admin User
  const adminUser = {
    id: 1,
    firebaseUid: "admin-uid", // Ganti dengan Firebase UID admin Anda
    username: "admin",
    email: "admin@example.com",
    isAdmin: true,
  };

  await prisma.user.upsert({
    where: { id: adminUser.id },
    update: adminUser,
    create: adminUser,
  });

  // Seed Sample Character
  const sampleCharacter = {
    id: 10000060, // Yelan's ID
    name: "Yelan",
    title: "Valley Orchid",
    detail:
      'A mysterious person who claims to work for the Ministry of Civil Affairs, but is a "non-entity" on the Ministry of Civil Affairs\' list.',
    constellation: "Umbrabilis Orchis",
    elementId: 2, // Hydro
    weaponTypeId: 4, // Bow
    regionId: 2, // Liyue
    rarityId: 5, // 5-star
    icon: "",
    gachaImg: "",
    birthday: "4-20",
    native: "Yanshang Teahouse",
    cvEn: "Laura Post",
    cvChs: "徐慧",
    cvJp: "遠藤綾",
    cvKr: "Min Ah",
  };

  await prisma.character.upsert({
    where: { id: sampleCharacter.id },
    update: sampleCharacter,
    create: sampleCharacter,
  });

  // Sample Character Stats
  const characterStats = [
    {
      characterId: 10000060,
      ascension: 0,
      level: 1,
      baseAtk: 19,
      statType: "CRIT_RATE",
      statValue: 5.0,
    },
    {
      characterId: 10000060,
      ascension: 0,
      level: 20,
      baseAtk: 49,
      statType: "CRIT_RATE",
      statValue: 5.0,
    },
    // dan seterusnya...
  ];

  for (const stat of characterStats) {
    await prisma.characterStat.create({
      data: stat,
    });
  }

  // Seed Sample Weapon
  const sampleWeapon = {
    id: 1,
    name: "Aqua Simulacra",
    description:
      "This longbow's color is unpredictable. Under the light, it takes on a lustrous, watery blue.",
    weaponTypeId: 4, // Bow
    rarityId: 5, // 5-star
    specialProperty: "CRIT DMG",
    icon: "",
    story:
      "It is said that water has no fixed color or form, and can either serve brilliantly as blade or bow.",
  };

  await prisma.weapon.upsert({
    where: { id: sampleWeapon.id },
    update: sampleWeapon,
    create: sampleWeapon,
  });

  // Weapon Passive
  await prisma.weaponPassive.create({
    data: {
      weaponId: 1,
      passiveName: "The Cleansing Form",
      passiveDescription:
        "HP is increased by 16%. When there are opponents nearby, the DMG dealt by the wielder of this weapon is increased by 20%. This will take effect whether the character is on-field or not.",
    },
  });

  // Weapon Stats
  const weaponStats = [
    { weaponId: 1, level: 1, baseAtk: 44, subStatValue: 19.2 },
    { weaponId: 1, level: 20, baseAtk: 110, subStatValue: 33.9 },
    { weaponId: 1, level: 40, baseAtk: 210, subStatValue: 49.4 },
    { weaponId: 1, level: 50, baseAtk: 258, subStatValue: 57.2 },
    { weaponId: 1, level: 60, baseAtk: 307, subStatValue: 65.0 },
    { weaponId: 1, level: 70, baseAtk: 358, subStatValue: 72.7 },
    { weaponId: 1, level: 80, baseAtk: 408, subStatValue: 80.4 },
    { weaponId: 1, level: 90, baseAtk: 542, subStatValue: 88.2 },
  ];

  for (const stat of weaponStats) {
    await prisma.weaponStat.create({
      data: stat,
    });
  }

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
