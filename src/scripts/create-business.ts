import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.findUnique({
    where: {
      email: "owner@laundrix.com",
    },
  });

  if (!owner) {
    throw new Error(
      "Business owner not found"
    );
  }

  const existingBusiness =
    await prisma.business.findUnique({
      where: {
        ownerId: owner.id,
      },
    });

  if (existingBusiness) {
    console.log(
      "Business already exists"
    );
    return;
  }

  const business =
    await prisma.business.create({
      data: {
        name: "Laundrix Group",
        slug: "laundrix-group",

        currencyCode: "INR",

        ownerId: owner.id,
      },
    });

  console.log(
    "Business created successfully"
  );

  console.log(business);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });