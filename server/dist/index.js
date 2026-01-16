"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const Sentry = __importStar(require("@sentry/node"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const requestId_1 = require("./middleware/requestId");
const metrics_1 = require("./middleware/metrics");
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const workspace_routes_1 = __importDefault(require("./routes/workspace.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const error_routes_1 = __importDefault(require("./routes/error.routes"));
const competitor_routes_1 = __importDefault(require("./routes/competitor.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const trends_routes_1 = __importDefault(require("./routes/trends.routes"));
const social_routes_1 = __importDefault(require("./routes/social.routes"));
const article_routes_1 = __importDefault(require("./routes/article.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const notion_routes_1 = __importDefault(require("./routes/notion.routes"));
const app = (0, express_1.default)();
const PORT = env_1.env.PORT;
if (env_1.env.SENTRY_DSN) {
    Sentry.init({
        dsn: env_1.env.SENTRY_DSN,
        environment: env_1.env.NODE_ENV,
        tracesSampleRate: env_1.env.NODE_ENV === 'production' ? 0.1 : 1.0
    });
}
app.use(express_1.default.json({ limit: '1mb' }));
app.use(requestId_1.requestId);
app.use(metrics_1.metricsMiddleware);
const allowedOrigins = (env_1.env.CORS_ORIGIN || env_1.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use((0, cors_1.default)({
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
app.use((0, helmet_1.default)());
morgan_1.default.token('id', (req) => req.id || '-');
app.use((0, morgan_1.default)(':id :method :url :status :res[content-length] - :response-time ms'));
app.use('/api/posts', post_routes_1.default);
app.use('/api/workspaces', workspace_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/errors', error_routes_1.default);
app.use('/api/competitors', competitor_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/trends', trends_routes_1.default);
app.use('/api/social', social_routes_1.default);
app.use('/api/articles', article_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/notion', notion_routes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
    logger_1.logger.error({ err, requestId: req.id }, 'Unhandled server error');
    if (env_1.env.SENTRY_DSN) {
        Sentry.captureException(err);
    }
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our end.'
    });
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
app.get('/metrics', (req, res) => {
    res.json((0, metrics_1.getMetrics)());
});
app.listen(PORT, () => {
    logger_1.logger.info({ port: PORT }, 'Server running');
});
