import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { logger } from './utils/logger';
import { requestId } from './middleware/requestId';
import { metricsMiddleware, getMetrics } from './middleware/metrics';
import postRoutes from './routes/post.routes';
import workspaceRoutes from './routes/workspace.routes';
import projectRoutes from './routes/project.routes';
import errorRoutes from './routes/error.routes';
import competitorRoutes from './routes/competitor.routes';
import analyticsRoutes from './routes/analytics.routes';
import trendsRoutes from './routes/trends.routes';
import socialRoutes from './routes/social.routes';
import articleRoutes from './routes/article.routes';
import userRoutes from './routes/user.routes';
import notionRoutes from './routes/notion.routes';
const app = express();
const PORT = env.PORT;

app.use(express.json({ limit: '1mb' }));
app.use(requestId);
app.use(metricsMiddleware);
const allowedOrigins = (env.CORS_ORIGIN || env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(helmet());
morgan.token('id', (req: any) => req.id || '-');
app.use(morgan(':id :method :url :status :res[content-length] - :response-time ms'));

app.use('/api/posts', postRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/errors', errorRoutes);
app.use('/api/competitors', competitorRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notion', notionRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err, requestId: (req as any).id }, 'Unhandled server error');
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our end.'
  });
});


app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/metrics', (req, res) => {
  res.json(getMetrics());
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server running');
});
