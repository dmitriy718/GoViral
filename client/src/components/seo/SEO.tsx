import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string[];
    type?: string;
    image?: string;
    canonicalPath?: string;
}

export function SEO({
    title,
    description = "PostDoctor - The Cure for Boring Feeds. Schedule, Analyze, and Go Viral.",
    keywords = ["social media", "automation", "AI marketing", "viral content", "analytics"],
    type = "website",
    image = "/vite.svg",
    canonicalPath
}: SEOProps) {
    const siteTitle = "PostDoctor";
    const fullTitle = `${title} | ${siteTitle}`;
    const appUrl = (import.meta.env.APP_URL || '').replace(/\/$/, '');
    const baseUrl = appUrl || '';
    const resolvedPath = canonicalPath ?? (typeof window !== 'undefined' ? window.location.pathname : undefined);
    const logoUrl = baseUrl ? `${baseUrl}/vite.svg` : '/vite.svg';
    const canonicalUrl = baseUrl && resolvedPath ? `${baseUrl}${resolvedPath}` : baseUrl || undefined;
    const imageUrl = image.startsWith('http') ? image : (baseUrl ? `${baseUrl}${image}` : image);

    return (
        <Helmet defer={false}>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="robots" content="index,follow" />
            {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
            <meta property="og:image" content={imageUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />

            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "PostDoctor",
                    "url": appUrl,
                    "logo": logoUrl,
                    "sameAs": [
                        "https://twitter.com/postdoctor?utm_source=postdoctor&utm_medium=referral&utm_campaign=seo",
                        "https://linkedin.com/company/postdoctor?utm_source=postdoctor&utm_medium=referral&utm_campaign=seo"
                    ]
                })}
            </script>
        </Helmet>
    );
}
