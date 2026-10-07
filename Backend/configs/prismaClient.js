import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis;

const basePrisma = globalForPrisma.rawPrisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.rawPrisma = basePrisma;
}

// Add automatic retry extension for transient connection resets (e.g. Neon idle auto-suspend / Windows 10054 ConnectionReset)
const prismaWithRetry = basePrisma.$extends({
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                let attempts = 0;
                const maxAttempts = 3;
                while (attempts < maxAttempts) {
                    try {
                        return await query(args);
                    } catch (error) {
                        attempts++;
                        const errMsg = error?.message || '';
                        const isConnectionReset =
                            errMsg.includes('10054') ||
                            errMsg.includes('ConnectionReset') ||
                            errMsg.includes('forcibly closed') ||
                            errMsg.includes('connection closed') ||
                            error?.code === 'P1001' ||
                            error?.code === 'P1017';

                        if (isConnectionReset && attempts < maxAttempts) {
                            console.warn(`[Prisma] Connection reset detected on ${model}.${operation} (attempt ${attempts}/${maxAttempts}), retrying...`);
                            await new Promise(resolve => setTimeout(resolve, 600 * attempts));
                            continue;
                        }
                        throw error;
                    }
                }
            },
        },
    },
});

const prisma = globalForPrisma.prisma ?? prismaWithRetry;

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
