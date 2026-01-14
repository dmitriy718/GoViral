import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export const requestId = (req: Request, res: Response, next: NextFunction) => {
    const id = randomUUID();
    (req as Request & { id?: string }).id = id;
    res.setHeader('X-Request-Id', id);
    next();
};
