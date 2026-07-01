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
        name: "פסל דרקון",
        nameEn: "Dragon Figurine",
        description: "פסל דרקון מודפס בתלת-ממד עם מרקם קשקשים מפורט. מושלם לתצוגה או לגיימינג שולחני.",
        descriptionEn: "A 3D printed dragon figurine with detailed scale texture. Perfect for display or tabletop gaming.",
        price: 24.99,
        priceIls: 92.90,
        imageUrl: "https://placehold.co/600x400?text=Dragon+Figurine",
        category: "פסלונים",
        available: true,
        stock: 8,
      },
      {
        name: "נחש מפורק",
        nameEn: "Articulated Snake",
        description: "נחש מודפס בתלת-ממד גמיש ומתנייע, מודפס במקום אחד – זז בדיוק כמו האמיתי.",
        descriptionEn: "A flexible, articulated 3D printed snake, printed in one piece — moves just like the real thing.",
        price: 14.99,
        priceIls: 54.90,
        imageUrl: "https://placehold.co/600x400?text=Articulated+Snake",
        category: "פסלונים",
        available: true,
        stock: 15,
      },
      {
        name: "טירה מיניאטורית",
        nameEn: "Miniature Castle",
        description: "טירה מימי-ביניים רב-חלקית, מצוינת לדיורמות או לתצוגה על המדף.",
        descriptionEn: "A multi-part medieval castle, great for dioramas or shelf display.",
        price: 39.99,
        priceIls: 149.90,
        imageUrl: "https://placehold.co/600x400?text=Miniature+Castle",
        category: "פסלונים",
        available: true,
        stock: 4,
      },
      {
        name: "אגרטל גיאומטרי",
        nameEn: "Geometric Vase",
        description: "אגרטל מודרני לו-פולי בסגנון גיאומטרי, מתאים לפרחים מלאכותיים או כקישוט עצמאי.",
        descriptionEn: "A modern low-poly geometric vase, suitable for artificial flowers or as a standalone decoration.",
        price: 18.99,
        priceIls: 69.90,
        imageUrl: "https://placehold.co/600x400?text=Geometric+Vase",
        category: "עיצוב הבית",
        available: true,
        stock: 12,
      },
      {
        name: "ארגונית שולחן",
        nameEn: "Desk Organizer",
        description: "ארגונית שולחן מודולרית עם מקומות לעטים, כרטיסים ופריטים קטנים. מסדרת את סביבת העבודה.",
        descriptionEn: "A modular desk organizer with slots for pens, cards, and small items. Keeps your workspace tidy.",
        price: 22.50,
        priceIls: 83.00,
        imageUrl: "https://placehold.co/600x400?text=Desk+Organizer",
        category: "עיצוב הבית",
        available: true,
        stock: 20,
      },
      {
        name: "מסגרת שעון קיר",
        nameEn: "Wall Clock Frame",
        description: "מסגרת שעון קיר מושלמת בצורת משושה. מצריכה מנגנון שעון סטנדרטי (לא כלול).",
        descriptionEn: "A sleek hexagonal wall clock frame. Requires a standard clock mechanism (not included).",
        price: 29.99,
        priceIls: 110.90,
        imageUrl: "https://placehold.co/600x400?text=Wall+Clock+Frame",
        category: "עיצוב הבית",
        available: false,
        stock: 0,
      },
      {
        name: "סט קליפסים לניהול כבלים",
        nameEn: "Cable Clip Set",
        description: "סט של 10 קליפסים לניהול כבלים הנצמדים לכל משטח שטוח ושומרים על הכבלים מסודרים.",
        descriptionEn: "Set of 10 cable management clips that adhere to any flat surface and keep cables organized.",
        price: 9.99,
        priceIls: 36.90,
        imageUrl: "https://placehold.co/600x400?text=Cable+Clips",
        category: "חלקים פונקציונליים",
        available: true,
        stock: 50,
      },
      {
        name: "מארז Raspberry Pi",
        nameEn: "Raspberry Pi Case",
        description: "מארז מאוורר ל-Raspberry Pi 4 עם חורי הרכבה והרכבה קלה בלחיצה.",
        descriptionEn: "A ventilated case for Raspberry Pi 4 with mounting holes and easy snap-together assembly.",
        price: 12.50,
        priceIls: 45.90,
        imageUrl: "https://placehold.co/600x400?text=Pi+Case",
        category: "חלקים פונקציונליים",
        available: true,
        stock: 10,
      },
    ],
  });

  console.log("Seeded 8 bilingual products across 3 categories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
