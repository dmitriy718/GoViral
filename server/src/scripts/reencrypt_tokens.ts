import { prisma } from '../utils/prisma';
import { decrypt, encrypt } from '../utils/crypto';

const reencryptValue = (value: string | null) => {
    if (!value) return value;
    const plaintext = decrypt(value);
    return encrypt(plaintext);
};

const run = async () => {
    const socials = await prisma.socialAccount.findMany();
    for (const account of socials) {
        const updatedAccess = reencryptValue(account.accessToken);
        const updatedRefresh = account.refreshToken ? reencryptValue(account.refreshToken) : null;
        await prisma.socialAccount.update({
            where: { id: account.id },
            data: {
                accessToken: updatedAccess,
                refreshToken: updatedRefresh
            }
        });
    }

    const integrations = await prisma.integration.findMany();
    for (const integration of integrations) {
        const updatedConfig = reencryptValue(integration.config);
        await prisma.integration.update({
            where: { id: integration.id },
            data: { config: updatedConfig }
        });
    }
};

run()
    .catch((error) => {
        console.error('Re-encryption failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
