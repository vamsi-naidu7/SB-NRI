import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient, RoleName } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in the environment');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with default demo accounts...');
  
  const passwordHash = await argon2.hash('password123');

  const demoAccounts = [
    { email: 'admin@sitebank.com', firstName: 'System', lastName: 'Admin', role: RoleName.ADMIN },
    { email: 'nri@sitebank.com', firstName: 'Demo', lastName: 'NRI', role: RoleName.NRI },
    { email: 'rm@sitebank.com', firstName: 'Demo', lastName: 'RM', role: RoleName.RELATIONSHIP_MANAGER },
    { email: 'agent@sitebank.com', firstName: 'Demo', lastName: 'Agent', role: RoleName.AGENT },
    { email: 'lawyer@sitebank.com', firstName: 'Demo', lastName: 'Lawyer', role: RoleName.LAWYER },
    { email: 'ca@sitebank.com', firstName: 'Demo', lastName: 'CA', role: RoleName.CA },
  ];

  for (const account of demoAccounts) {
    // Check if role exists
    let role = await prisma.role.findUnique({ where: { name: account.role } });
    if (!role) {
      role = await prisma.role.create({ data: { name: account.role } });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: account.email } });
    
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: account.email,
          passwordHash,
          firstName: account.firstName,
          lastName: account.lastName,
          roles: {
            create: {
              roleId: role.id
            }
          }
        }
      });
      console.log(`Created account: ${account.email} with role ${account.role}`);
    } else {
      console.log(`Account already exists: ${account.email}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
