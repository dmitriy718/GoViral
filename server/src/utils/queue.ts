import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import { logger } from './logger';
import { prisma } from './prisma';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const connection = new IORedis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: 3
});

export const publishQueue = new Queue('publish-posts', {
    connection: connection as any,
    defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: 100,
        removeOnFail: 100
    }
});

const publishQueueEvents = new QueueEvents('publish-posts', { connection: connection as any });
publishQueueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.error({ jobId, failedReason }, 'Publish queue job failed');
});

export const startPublishWorker = () => {
    const worker = new Worker('publish-posts', async (job) => {
        const postId = job.data.postId as string;
        await prisma.post.update({
            where: { id: postId },
            data: { status: 'PUBLISHED' }
        });
    }, {
        connection: connection as any,
        concurrency: 5,
        lockDuration: 30000
    });

    worker.on('completed', (job) => {
        logger.info({ jobId: job.id }, 'Publish job completed');
    });

    worker.on('failed', (job, err) => {
        logger.error({ err, jobId: job?.id }, 'Publish job failed');
    });
};
