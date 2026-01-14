import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';


export const createProject = async (req: Request, res: Response) => {
    try {
        const { name, description, platforms } = req.body;
        const userPayload = (req as any).user;

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: userPayload.email }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const project = await prisma.project.create({
            data: {
                name,
                description,
                platforms: JSON.stringify(platforms), // Store as JSON string
                userId: user.id
            }
        });

        res.json(project);
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const userPayload = (req as any).user;
        const user = await prisma.user.findUnique({ where: { email: userPayload.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const projects = await prisma.project.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        const formatted = projects.map(p => ({
            ...p,
            platforms: JSON.parse(p.platforms)
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
