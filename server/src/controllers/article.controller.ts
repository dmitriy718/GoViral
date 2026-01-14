import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';


export const getAllArticles = async (req: Request, res: Response) => {
    try {
        const articles = await prisma.article.findMany({
            select: {
                id: true,
                title: true,
                category: true,
                time: true,
                description: true,
                // Content is heavy, fetched in detail view usually, but for now we fetch it all or select fields
                // For the list view we don't need content.
            }
        });
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

export const getArticleById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const article = await prisma.article.findUnique({
            where: { id: parseInt(id) }
        });

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        res.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
};
