import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: "admin@laundrypilot.com",
    },
  });

  if (existingUser) {
    console.log("Super admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(
    "Testpass@123",
    10,
  );

  const user = await prisma.user.create({
    data: {
      email: "admin@laundrypilot.com",
      passwordHash,
      firstName: "Platform",
      lastName: "Admin",
      role: UserRole.PLATFORM_SUPER_ADMIN,
    },
  });

  console.log("Super admin created");
  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });