"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const argon2 = __importStar(require("argon2"));
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set in the environment');
}
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding database with default demo accounts...');
    const passwordHash = await argon2.hash('password123');
    const demoAccounts = [
        { email: 'admin@sitebank.com', firstName: 'System', lastName: 'Admin', role: client_1.RoleName.ADMIN },
        { email: 'nri@sitebank.com', firstName: 'Demo', lastName: 'NRI', role: client_1.RoleName.NRI },
        { email: 'rm@sitebank.com', firstName: 'Demo', lastName: 'RM', role: client_1.RoleName.RELATIONSHIP_MANAGER },
        { email: 'agent@sitebank.com', firstName: 'Demo', lastName: 'Agent', role: client_1.RoleName.AGENT },
        { email: 'lawyer@sitebank.com', firstName: 'Demo', lastName: 'Lawyer', role: client_1.RoleName.LAWYER },
        { email: 'ca@sitebank.com', firstName: 'Demo', lastName: 'CA', role: client_1.RoleName.CA },
    ];
    for (const account of demoAccounts) {
        let role = await prisma.role.findUnique({ where: { name: account.role } });
        if (!role) {
            role = await prisma.role.create({ data: { name: account.role } });
        }
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
        }
        else {
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
//# sourceMappingURL=seed.js.map