const { PrismaClient } = require('@prisma/client');
import { recordDbDuration } from '../middleware/metrics';

export const prisma = new PrismaClient();

prisma.$use(async (params: unknown, next: (arg: unknown) => Promise<unknown>) => {
    const start = Date.now();
    try {
        return await next(params);
    } finally {
        recordDbDuration(Date.now() - start);
    }
});
