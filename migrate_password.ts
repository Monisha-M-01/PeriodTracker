import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  
  if (users.length === 0) {
    console.log("No users found.");
    return;
  }

  const firstUser = users[0];
  console.log(`Updating password for ${firstUser.email}...`);

  const saltRounds = 10;
  const newPasswordHash = await bcrypt.hash('password123', saltRounds);

  await prisma.user.update({
    where: { id: firstUser.id },
    data: { passwordHash: newPasswordHash, isVerified: true }
  });

  console.log("Password updated successfully to 'password123'");
}

main().catch(console.error).finally(() => prisma.$disconnect());
