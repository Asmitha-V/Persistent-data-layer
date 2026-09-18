// Populates the database with sample data for local testing/demos.
// Run with: npm run seed

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = bcrypt.hashSync('secret123', 10);

  const ada = await prisma.user.upsert({
    where: { email: 'ada@example.com' },
    update: {},
    create: { name: 'Ada Lovelace', email: 'ada@example.com', password: passwordHash },
  });

  const grace = await prisma.user.upsert({
    where: { email: 'grace@example.com' },
    update: {},
    create: { name: 'Grace Hopper', email: 'grace@example.com', password: passwordHash },
  });

  const project = await prisma.project.create({
    data: {
      name: 'Website Revamp',
      description: 'Q4 redesign of the marketing site',
      ownerId: ada.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Design homepage',
        status: 'in_progress',
        projectId: project.id,
        assigneeId: grace.id,
      },
      {
        title: 'Set up CI pipeline',
        status: 'todo',
        projectId: project.id,
        assigneeId: ada.id,
      },
      {
        title: 'Write launch announcement',
        status: 'done',
        projectId: project.id,
      },
    ],
  });

  console.log('Seed complete:');
  console.log(`  Users: ${ada.email} (id ${ada.id}), ${grace.email} (id ${grace.id})`);
  console.log(`  Project: "${project.name}" (id ${project.id})`);
  console.log('  Password for both seeded users: secret123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
