import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PLAN_LIMITS = {
    FREE: 1,
    PRO: 5,
    ENTERPRISE: Infinity
};

export const createWorkspace = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const userPayload = (req as any).user;

        // Get user and their plan
        const user = await prisma.user.findUnique({
            where: { email: userPayload.email },
            include: { subscription: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Determine limit
        const rawPlan = user.subscription?.plan;
        const plan = (rawPlan || 'FREE').toUpperCase() as keyof typeof PLAN_LIMITS;
        const limit = PLAN_LIMITS[plan] || 1;

        // Count owned workspaces
        const ownedCount = await prisma.workspace.count({
            where: { ownerId: user.id }
        });

        // Admin Bypass Logic
        const isAdmin = user.email === 'admin@postdoctor.app';

        console.log(`[CreateWorkspace] User: ${user.email}, Plan: ${plan}, Limit: ${limit}, Owned: ${ownedCount}, Admin: ${isAdmin}`);

        if (!isAdmin && ownedCount >= limit) {
            console.log('[CreateWorkspace] Limit reached.');
            return res.status(403).json({
                error: `Plan limit reached. You can only create ${limit} workspace(s) on the ${plan} plan.`
            });
        }

        // Create Workspace
        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(7);

        const workspace = await prisma.workspace.create({
            data: {
                name,
                slug,
                ownerId: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: 'OWNER'
                    }
                }
            }
        });

        res.json(workspace);

    } catch (error) {
        console.error('Create workspace error:', error);
        res.status(500).json({ error: 'Failed to create workspace' });
    }
};

export const getWorkspaces = async (req: Request, res: Response) => {
    try {
        const userPayload = (req as any).user;

        // Find user by email to get their ID
        // Sync user from token payload if they don't exist in DB
        let user = await prisma.user.findUnique({
            where: { email: userPayload.email },
            select: { id: true }
        });

        if (!user) {
            console.log(`[GetWorkspaces] User ${userPayload.email} not found in DB. Auto-creating...`);
            user = await prisma.user.create({
                data: {
                    id: userPayload.uid, // Explicitly use Firebase UID
                    email: userPayload.email,
                    name: userPayload.name || 'New User',
                    subscription: {
                        create: { plan: 'FREE' }
                    }
                },
                select: { id: true }
            });
        }

        let workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });


        // Seed default workspace if none exist (Robust check)
        if (workspaces.length === 0) {
            // Double check to prevent race conditions
            const existing = await prisma.workspace.findFirst({
                where: { ownerId: user.id }
            });

            if (!existing) {
                const defaultWs = await prisma.workspace.create({
                    data: {
                        name: 'Default Workspace',
                        slug: 'default-workspace-' + Math.random().toString(36).substring(7),
                        ownerId: user.id,
                        members: {
                            create: {
                                userId: user.id,
                                role: 'OWNER'
                            }
                        }
                    }
                });
                workspaces = [defaultWs];
            } else {
                // If existing found but not in member list (shouldn't happen with correct query), add it
                workspaces = [existing];
            }
        }

        // Clean up duplicates if any exist (Self-healing)
        if (workspaces.filter(w => w.name === 'Default Workspace').length > 1) {
            const defaults = workspaces.filter(w => w.name === 'Default Workspace');
            // Keep the oldest, delete others
            const toKeep = defaults.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
            const toDelete = defaults.filter(w => w.id !== toKeep.id);

            for (const ws of toDelete) {
                // Delete members first due to foreign key
                await prisma.workspaceMember.deleteMany({ where: { workspaceId: ws.id } });
                await prisma.workspace.delete({ where: { id: ws.id } });
            }
            workspaces = workspaces.filter(w => !toDelete.find(d => d.id === w.id));
        }

        res.json(workspaces);
    } catch (error) {
        console.error('Get workspaces error:', error);
        res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
};
