import { prisma } from '../utils/prisma';

async function main() {
    const users = await prisma.user.findMany({
        include: { subscription: true, _count: { select: { workspaceMemberships: true } } }
    });

    console.log('--- USER REPORT ---');
    for (const u of users) {
        console.log(`User: ${u.email} | ID: ${u.id}`);
        console.log(`Plan: ${u.subscription?.plan || 'None (Defaulting to FREE)'}`);
        console.log(`Workspaces Owned: ${await prisma.workspace.count({ where: { ownerId: u.id } })}`);
        console.log('---');
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
