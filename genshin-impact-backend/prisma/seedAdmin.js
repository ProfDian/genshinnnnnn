const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Hapus admin yang sudah ada jika ingin membuat yang baru (opsional)
  // await prisma.user.deleteMany({
  //   where: {
  //     username: 'admin'
  //   }
  // });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  // Buat admin
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@genshinimpact.com",
      password: hashedPassword,
      name: "Admin",
      isAdmin: true,
      bio: "Administrator account",
      lastLogin: new Date(),
    },
  });

  console.log("Admin created:", admin);

  // Buat user biasa untuk contoh
  const user = await prisma.user.create({
    data: {
      username: "testuser",
      email: "user@genshinimpact.com",
      password: await bcrypt.hash("user123", salt),
      name: "Test User",
      isAdmin: false,
      bio: "Regular user account",
      lastLogin: new Date(),
    },
  });

  console.log("User created:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
