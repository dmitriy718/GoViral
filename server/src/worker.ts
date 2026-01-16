import { logger } from './utils/logger';
import './services/scheduler.service';
import { startPublishWorker } from './utils/queue';

startPublishWorker();
logger.info('Worker started');
