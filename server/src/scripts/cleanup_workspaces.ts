import { prisma } from '../utils/prisma';

async function main() {
    const user = await prisma.user.findUnique({ where: { email: 'admin@postdoctor.app' } });
    if (!user) return;

    const workspaces = await prisma.workspace.findMany({
        where: { ownerId: user.id },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`User has ${workspaces.length} workspaces.`);

    if (workspaces.length > 1) {
        const toDelete = workspaces[0]; // Delete the newest one, assume it's the duplicate default or failed attempt
        console.log(`Deleting workspace: ${toDelete.name} (${toDelete.id})`);

        await prisma.workspaceMember.deleteMany({ where: { workspaceId: toDelete.id } });
        await prisma.workspace.delete({ where: { id: toDelete.id } });

        console.log("Deleted.");
    }
}

main().finally(() => prisma.$disconnect());
