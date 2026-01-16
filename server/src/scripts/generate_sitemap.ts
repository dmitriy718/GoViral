import { prisma } from '../utils/prisma';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = (process.env.APP_URL || 'https://postdoctor.app').replace(/\/$/, '');

async function generateSitemap() {
    console.log('Generating Sitemap...');

    // 1. Static Routes
    const staticRoutes = [
        '/',
        '/login',
        '/about',
        '/privacy',
        '/terms',
        '/cookies',
        '/features',
        '/pricing'
    ];

    // 2. Dynamic Routes (Articles)
    const articles = await prisma.article.findMany({
        select: { id: true, updatedAt: true }
    });

    const dynamicRoutes = articles.map((article: { id: number; updatedAt: Date }) => ({
        url: `/learn/${article.id}`,
        lastmod: article.updatedAt.toISOString()
    }));

    // 3. Build XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add Static
    staticRoutes.forEach((route: string) => {
        sitemap += `
    <url>
        <loc>${BASE_URL}${route}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    // Add Dynamic
    dynamicRoutes.forEach((route: { url: string; lastmod: string }) => {
        sitemap += `
    <url>
        <loc>${BASE_URL}${route.url}</loc>
        <lastmod>${route.lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`;
    });

    sitemap += `
</urlset>`;

    // 4. Write to file
    const outputPath = path.join(__dirname, '../../../client/public/sitemap.xml');
    fs.writeFileSync(outputPath, sitemap);
    console.log(`Sitemap generated successfully at ${outputPath}`);
}

generateSitemap()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
