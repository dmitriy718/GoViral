import { useNavigate } from 'react-router-dom';
import { GlassCard, FadeIn } from "@/components/ui/design-system";
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';

export function ArticleView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const ARTICLE_CONTENT = {
        "1": {
            title: "App Walkthrough: From Zero to Viral",
            content: `
                <p>Welcome to <strong>ViralPost AI</strong>. This ecosystem is designed to take you from a blank page to a viral sensation using a data-driven workflow.</p>
                <h3>The Core Workflow</h3>
                <ol>
                    <li><strong>The Wizard</strong>: Start every new initiative here. Define your project goals and create a "Persona" (the voice of your brand).</li>
                    <li><strong>Content Studio</strong>: Use our AI to generate posts based on your keywords and selected persona.</li>
                    <li><strong>Calendar</strong>: Schedule your drafts. Drag and drop to optimize timing.</li>
                    <li><strong>Dashboard</strong>: Watch the metrics roll in. Track your "Viral Score" and competitor moves.</li>
                </ol>
                <p>Don't just post randomly. follows this loop: <em>Plan -> Generate -> Schedule -> Analyze</em>. That is the path to growth.</p>
            `
        },
        "2": {
            title: "Dashboard: Mastering Your Command Center",
            content: `
                <p>Your Dashboard is more than just a stats page—it's your mission control.</p>
                <h3>Key Metrics Explained</h3>
                <ul>
                    <li><strong>Viral Score™</strong>: An AI-calculated probability of your content trending. It factors in keyword velocity, sentiment, and historical engagement. Aim for 80+.</li>
                    <li><strong>Est. ROI Value</strong>: The estimated dollar value of your organic reach, based on current CPM rates in your niche.</li>
                    <li><strong>Trend Watch</strong>: A real-time feed of rising topics. If you see a trend with >100% growth, post about it immediately.</li>
                </ul>
                <h3>Competitor Spy</h3>
                <p>Use the "Add Competitor" button to track rival accounts. We monitor their posting frequency and top-performing posts so you can reverse-engineer their success.</p>
            `
        },
        "3": {
            title: "Wizard: Setting Up Your First Campaign",
            content: `
                <p>The Campaign Wizard is where strategy happens. A campaign groups your posts under a unified theme.</p>
                <h3>Step-by-Step</h3>
                <ol>
                    <li><strong>Project Details</strong>: Name your campaign (e.g., "Q4 Product Launch") and select the target platforms. Multi-channel campaigns often perform better.</li>
                    <li><strong>Context Gathering</strong>: The more you tell the AI, the better the output. Paste your landing page copy or value proposition here.</li>
                    <li><strong>Persona Setup</strong>: This is crucial. Don't sound like a bot. creation a specific character (e.g., "Sassy Intern" vs. "Professional CEO").</li>
                </ol>
                <p><strong>Pro Tip</strong>: You can create reusable Global Personas in the Settings if you use the same voice across multiple projects.</p>
            `
        },
        "4": {
            title: "Content Studio: Creating Magic",
            content: `
                <p>The Content Studio is your creative partner. It supports Text, Image ideas, Video scripts, Polls, and Threads.</p>
                <h3>Using the AI Generator</h3>
                <p>Click "Generate with AI" but don't just use the raw output. Use the <strong>Trending Now</strong> pills to inject high-velocity keywords into your prompt.</p>
                <h3>Platform Previews</h3>
                <p>Always check the "Live Preview" sidebar. What looks good on Twitter might look terrible on LinkedIn. Use the platform toggles to verify formatting before you save.</p>
                <h3>Link Crawler</h3>
                <p>Paste a URL into the "Link" tab and hit Crawl. The AI will read the article and summarize it into a shareable post with key takeaways. Huge time saver.</p>
            `
        },
        "5": {
            title: "Calendar: Scheduling for Success",
            content: `
                <p>Consistency is key to the algorithm. The Calendar allows you to visualize your posting density.</p>
                <h3>Drag & Drop</h3>
                <p>Your "Saved Drafts" live in the sidebar. Simply drag them onto a day to schedule them. You'll be prompted to set a specific time.</p>
                <h3>Viral Daily Drops</h3>
                <p>These are pre-made, high-potential post structures (memes, hooks, questions) that update daily. If you're stuck, drag one of these onto your calendar and fill in the blanks.</p>
                <h3>Status Indicators</h3>
                <p>Orange = Draft, Blue = Scheduled, Green = Published. Ensure your week is mostly Blue by Sunday night.</p>
            `
        },
        "6": {
            title: "Support: Getting Help When You Need It",
            content: `
                <p>Stuck? We've got you covered.</p>
                <ul>
                    <li><strong>Ticket System</strong>: Use the form on the Support page for technical bugs. Expect a reply within 24 hours.</li>
                    <li><strong>Live Chat</strong>: Available 9am-5pm EST for user on the Enterprise plan.</li>
                    <li><strong>Community</strong>: Join our Discord (link in footer) to swap growth hacks with other users.</li>
                </ul>
                <p>Before submitting a ticket, please check if your platform connections (Twitter/LinkedIn) are still active in the Dashboard.</p>
            `
        },
        "7": {
            title: "Settings: Managing Your Account",
            content: `
                <p>Configure your workspace and subscription.</p>
                <h3>Workspaces</h3>
                <p>Use the workspace switcher in the sidebar to manage multiple brands or clients. PRO users get 5 workspaces; Enterprise is unlimited.</p>
                <h3>API Access</h3>
                <p>Developers can generate an API Key in the "API" tab. This allows you to programmatically create drafts from your own internal tools.</p>
                <h3>Team Members</h3>
                <p>Invite your copywriters or clients. You can assign them "Editor" or "Viewer" roles. Only "Admins" can change billing details.</p>
            `
        }
    };

    const article = ARTICLE_CONTENT[id];

    return (
        <div className="max-w-4xl mx-auto p-8">
            <button onClick={() => navigate('/learn')} className="flex items-center gap-2 text-muted-foreground hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Knowledge Base
            </button>
            <FadeIn>
                <GlassCard className="prose prose-invert max-w-none">
                    {article ? (
                        <>
                            <h1>{article.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </>
                    ) : (
                        <>
                            <h1>Article Not Found</h1>
                            <p>The article with ID "{id}" could not be found.</p>
                            <p>Please check the URL or return to the knowledge base.</p>
                        </>
                    )}
                    <div className="h-64 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-muted-foreground my-8">
                        Example Image / Diagram
                    </div>
                    <h3>Key Takeaways</h3>
                    <ul>
                        <li>ViralPost is powerful.</li>
                        <li>Use the wizard to get started.</li>
                        <li>Check your analytics daily.</li>
                    </ul>
                </GlassCard>
            </FadeIn>
        </div>
    )
}
