import prisma from './prismaClient.js';

const connectDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('PostgreSQL (Neon) connected successfully via Prisma');
    } catch (err) {
        console.error(`Database connection failed: ${err.message}`);
        process.exit(1);
    }
};

export default connectDatabase;