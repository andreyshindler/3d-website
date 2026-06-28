import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Dragon Figurine",
        description: "A detailed 3D printed dragon with intricate scale texture. Perfect for display or tabletop gaming.",
        price: 24.99,
        imageUrl: "https://placehold.co/600x400?text=Dragon+Figurine",
        category: "Figurines",
        available: true,
      },
      {
        name: "Articulated Snake",
        description: "A flexible, print-in-place articulated snake that moves just like the real thing.",
        price: 14.99,
        imageUrl: "https://placehold.co/600x400?text=Articulated+Snake",
        category: "Figurines",
        available: true,
      },
      {
        name: "Miniature Castle",
        description: "A multi-piece medieval castle miniature, great for dioramas or shelf display.",
        price: 39.99,
        imageUrl: "https://placehold.co/600x400?text=Miniature+Castle",
        category: "Figurines",
        available: true,
      },
      {
        name: "Geometric Vase",
        description: "A modern low-poly geometric vase, suitable for artificial flowers or as a standalone decoration.",
        price: 18.99,
        imageUrl: "https://placehold.co/600x400?text=Geometric+Vase",
        category: "Home Decor",
        available: true,
      },
      {
        name: "Desk Organizer",
        description: "A modular desk organizer with slots for pens, cards, and small items. Keeps your workspace tidy.",
        price: 22.5,
        imageUrl: "https://placehold.co/600x400?text=Desk+Organizer",
        category: "Home Decor",
        available: true,
      },
      {
        name: "Wall Clock Frame",
        description: "A stylish hexagonal wall clock frame. Requires a standard clock movement insert (not included).",
        price: 29.99,
        imageUrl: "https://placehold.co/600x400?text=Wall+Clock+Frame",
        category: "Home Decor",
        available: false,
      },
      {
        name: "Cable Management Clip Set",
        description: "A set of 10 cable management clips that mount to any flat surface to keep wires organized.",
        price: 9.99,
        imageUrl: "https://placehold.co/600x400?text=Cable+Clips",
        category: "Functional Parts",
        available: true,
      },
      {
        name: "Raspberry Pi Case",
        description: "A vented enclosure for Raspberry Pi 4 with mounting holes and easy snap-fit assembly.",
        price: 12.5,
        imageUrl: "https://placehold.co/600x400?text=Pi+Case",
        category: "Functional Parts",
        available: true,
      },
    ],
  });

  console.log("Seeded 8 products across 3 categories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
