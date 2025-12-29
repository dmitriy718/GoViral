import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users.`);

        for (const user of users) {
            await prisma.subscription.upsert({
                where: { userId: user.id },
                update: { plan: 'ENTERPRISE' },
                create: {
                    userId: user.id,
                    plan: 'ENTERPRISE'
                }
            });
            console.log(`Upgraded user ${user.email} to ENTERPRISE.`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
