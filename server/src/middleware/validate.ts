import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: 'Validation Error',
                details: error.issues.map((e: any) => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        next(error);
    }
};
