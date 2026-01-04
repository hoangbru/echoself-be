import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

import { genreData } from "./seeds/genreData";

const prisma = new PrismaClient();

async function seedGenres() {
  console.log("Starting genre seeding...");

  let created = 0;
  let skipped = 0;

  for (const genre of genreData) {
    try {
      // Check if genre already exists
      const existing = await prisma.genre.findUnique({
        where: { slug: genre.slug },
      });

      if (existing) {
        console.log(`Skipped: ${genre.name} (already exists)`);
        skipped++;
        continue;
      }

      // Create genre
      await prisma.genre.create({
        data: {
          id: uuidv4(),
          name: genre.name,
          slug: genre.slug,
          description: genre.description,
          imageUrl: genre.imageUrl,
        },
      });

      created++;
    } catch (error) {
      console.error(`Failed to create ${genre.name}:`, error);
    }
  }
}

async function seedDemoData() {
  console.log("\n Seeding demo data...");

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@echoself.com" },
    update: {},
    create: {
      id: uuidv4(),
      email: "demo@echoself.com",
      username: "demo_artist",
      password: "$2b$10$rK5yV5OxQG5qYXQqYXQqYeKj6KvKj6KvKj6KvKj6KvKj6Kv", // hashed "demo123"
      displayName: "Demo Artist",
      role: "ARTIST",
      isVerified: true,
    },
  });

  console.log(`Created demo user: ${demoUser.email}`);

  // Create demo artist
  let demoArtist = await prisma.artist.findFirst({
    where: { userId: demoUser.id },
  });

  if (!demoArtist) {
    demoArtist = await prisma.artist.create({
      data: {
        id: uuidv4(),
        userId: demoUser.id,
        stageName: "Demo Artist",
        bio: "This is a demo artist account for testing purposes",
        verified: true,
      },
    });
    console.log(`Created demo artist: ${demoArtist.stageName}`);
  } else {
    console.log(`Skipped: ${demoArtist.stageName} (already exists)`);
  }

  return { demoUser, demoArtist };
}

async function main() {
  console.log("Starting database seeding...\n");

  try {
    // Seed genres
    await seedGenres();

    // Seed demo data (optional)
    const shouldSeedDemo = process.env.SEED_DEMO_DATA === "true";
    if (shouldSeedDemo) {
      await seedDemoData();
    }

    console.log("\n Seeding completed successfully!\n");
  } catch (error) {
    console.error("\n Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
