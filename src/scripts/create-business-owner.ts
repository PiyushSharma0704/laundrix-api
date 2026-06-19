import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "owner@laundrix.com";

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    console.log("Business owner already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(
    "Password@123",
    10,
  );

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: "Arjun",
      lastName: "Singh",
      role: UserRole.BUSINESS_OWNER,
    },
  });

  console.log("Business owner created");
  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });