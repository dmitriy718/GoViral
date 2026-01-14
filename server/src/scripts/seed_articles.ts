import { prisma } from '../utils/prisma';
import { openai } from '../utils/openai';
import fs from 'fs';
import path from 'path';
import https from 'https';


const ARTICLES = [
    {
        id: 1,
        title: "App Walkthrough: From Zero to Viral",
        category: "Getting Started",
        time: "10 min read",
        description: "A complete tour of the entire PostDoctor ecosystem.",
        imagePrompt: "A futuristic digital command center dashboard glowing with analytics data and viral growth charts, purple and blue neon aesthetics, isometric view, high quality 3d render",
        content: `
            <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Welcome to <strong>PostDoctor AI</strong>. This ecosystem is designed to take you from a blank page to a viral sensation using a data-driven workflow. It's not just a tool; it's a growth engine.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div class="bg-gradient-to-br from-purple-900/20 to-transparent p-6 rounded-xl border border-purple-500/20">
                        <div class="text-purple-400 font-bold mb-2 flex items-center gap-2">
                             <span class="p-1 bg-purple-500/20 rounded">🚀</span> The Mission
                        </div>
                        <p class="text-sm text-gray-300">To replace guesswork with algorithmic precision. We reverse-engineer the platforms to ensure your content has the highest probability of success.</p>
                    </div>
                </div>

                <h2 class="text-2xl font-bold text-white mt-12 mb-6">The Core Loop</h2>
                <div class="space-y-4">
                    <div class="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-center group hover:border-primary/30 transition-colors">
                         <div class="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">1</div>
                         <div>
                             <h3 class="font-bold text-white">The Wizard</h3>
                             <p class="text-sm text-gray-400">Define your project goals and create a "Persona" (the voice of your brand).</p>
                         </div>
                    </div>
                    <div class="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-center group hover:border-primary/30 transition-colors">
                         <div class="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">2</div>
                         <div>
                             <h3 class="font-bold text-white">Content Studio</h3>
                             <p class="text-sm text-gray-400">Use our AI to generate posts based on your keywords and selected persona.</p>
                         </div>
                    </div>
                    <div class="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-center group hover:border-primary/30 transition-colors">
                         <div class="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">3</div>
                         <div>
                             <h3 class="font-bold text-white">Dashboard</h3>
                             <p class="text-sm text-gray-400">Watch the metrics roll in. Track your "Viral Score" and competitor moves.</p>
                         </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 2,
        title: "Dashboard: Mastering Your Command Center",
        category: "Features",
        time: "3 min read",
        description: "Understanding Viral Scores, ROI stats, and platform health.",
        imagePrompt: "A high-tech holographic user interface displaying social meida statistics and graphs, dark mode background, cyberpunk style, detailed and clean",
        content: `
            <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Your Dashboard is more than just a stats page—it's your mission control. It gives you a birds-eye view of your entire social operation across all connected platforms.
                </p>

                <h2 class="text-2xl font-bold text-white mt-12 mb-6">Key Metrics Explained</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-gray-900 border border-white/10 p-6 rounded-xl">
                        <h3 class="text-blue-400 font-bold mb-2">Viral Score™</h3>
                        <p class="text-sm text-gray-400">An AI-calculated probability. Factors in keyword velocity, sentiment, and historical engagement. Aim for 80+.</p>
                    </div>
                    <div class="bg-gray-900 border border-white/10 p-6 rounded-xl">
                        <h3 class="text-green-400 font-bold mb-2">Est. ROI</h3>
                        <p class="text-sm text-gray-400">Estimated dollar value of your organic reach, based on current CPM rates in your niche.</p>
                    </div>
                    <div class="bg-gray-900 border border-white/10 p-6 rounded-xl">
                        <h3 class="text-pink-400 font-bold mb-2">Trend Watch</h3>
                        <p class="text-sm text-gray-400">Real-time feed of rising topics. If a trend has >100% growth, post about it immediately.</p>
                    </div>
                </div>

                <div class="bg-white/5 p-6 rounded-xl border border-white/5 mt-8">
                     <h3 class="text-xl font-bold text-white mb-2">Competitor Spy</h3>
                     <p class="text-gray-300">Use the "Add Competitor" button to track rival accounts. We monitor their posting frequency and top-performing posts so you can reverse-engineer their success.</p>
                </div>
            </div>
        `
    },
    {
        id: 3,
        title: "Wizard: Setting Up Your First Campaign",
        category: "Setup",
        time: "5 min read",
        description: "How to use the engine bay to configure projects and personas.",
        imagePrompt: "A magical glowing digital wizard staff floating over a sleek laptop, interacting with a modern software interface, dark blue and purple lighting, digital art",
        content: `
            <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    The Campaign Wizard is where strategy happens. A campaign groups your posts under a unified theme, ensuring consistent messaging across the board.
                </p>
                
                <h2 class="text-2xl font-bold text-white mt-8 mb-6">Step-by-Step Guide</h2>
                <ol class="space-y-6 list-decimal list-inside text-gray-300">
                    <li class="pl-4 border-l-2 border-primary"><strong>Project Details</strong>: Name your campaign (e.g., "Q4 Product Launch") and select the target platforms. Multi-channel campaigns often perform better.</li>
                    <li class="pl-4 border-l-2 border-primary"><strong>Context Gathering</strong>: The more you tell the AI, the better the output. Paste your landing page copy or value proposition here.</li>
                    <li class="pl-4 border-l-2 border-primary"><strong>Persona Setup</strong>: This is crucial. Don't sound like a bot. Create a specific character (e.g., "Sassy Intern" vs. "Professional CEO").</li>
                </ol>

                <div class="mt-8 p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg flex items-start gap-3">
                    <span class="text-2xl">💡</span>
                    <div>
                        <h4 class="text-blue-400 font-bold text-sm">Pro Tip</h4>
                        <p class="text-xs text-blue-200/70 mt-1">You can create reusable Global Personas in the Settings if you use the same voice across multiple projects.</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 4,
        title: "Content Studio: Creating Magic",
        category: "Creation",
        time: "7 min read",
        description: "Using AI, trending data, and multi-platform previews.",
        imagePrompt: "A creative studio workspace with floating holographic social media posts, AI robot arm assisting a human creator, cinematic lighting, 8k resolution",
        content: `
             <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    The Content Studio is your creative partner. It supports Text, Image ideas, Video scripts, Polls, and Threads—all powered by GPT-4o.
                </p>

                <h2 class="text-2xl font-bold text-white mt-8 mb-6">Power Features</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div class="bg-white/5 p-6 rounded-xl border border-white/5">
                        <h3 class="font-bold text-white mb-2">AI Generator</h3>
                        <p class="text-sm text-gray-400">Click "Generate with AI" but don't just use the raw output. Use the <strong>Trending Now</strong> pills to inject high-velocity keywords into your prompt.</p>
                     </div>
                     <div class="bg-white/5 p-6 rounded-xl border border-white/5">
                        <h3 class="font-bold text-white mb-2">Live Preview</h3>
                        <p class="text-sm text-gray-400">Always check the sidebar. What looks good on Twitter might look terrible on LinkedIn. Use the platform toggles to verify formatting.</p>
                     </div>
                </div>

                <div class="bg-gradient-to-r from-gray-900 to-black p-8 rounded-xl border border-white/10 mt-8">
                     <h3 class="text-xl font-bold text-white mb-4">Link Crawler</h3>
                     <p class="text-gray-300 mb-4">Paste a URL into the "Link" tab and hit Crawl. The AI will read the article and summarize it into a shareable post with key takeaways. huge time saver.</p>
                     <div class="w-full h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
                </div>
             </div>
        `
    },
    {
        id: 5,
        title: "Calendar: Scheduling for Success",
        category: "Planning",
        time: "4 min read",
        description: "Drag-and-drop workflow and viral daily drops.",
        imagePrompt: "A modern digital calendar interface with glowing event blocks, time management concept, sleek 3d design, dark theme",
        content: `
             <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Consistency is key to the algorithm. The Calendar allows you to visualize your posting density and ensure you never miss a slot.
                </p>

                <div class="flex flex-col md:flex-row gap-8 items-center my-8">
                    <div class="flex-1 space-y-4">
                        <h3 class="text-lg font-bold text-white">Drag & Drop</h3>
                        <p class="text-gray-400 text-sm">Your "Saved Drafts" live in the sidebar. Simply drag them onto a day to schedule them. You'll be prompted to set a specific time.</p>
                    </div>
                    <div class="flex-1 space-y-4">
                         <h3 class="text-lg font-bold text-white">Status Indicators</h3>
                         <div class="flex gap-2">
                             <span class="px-2 py-1 bg-orange-500/20 text-orange-500 rounded text-xs border border-orange-500/30">Draft</span>
                             <span class="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs border border-blue-500/30">Scheduled</span>
                             <span class="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs border border-green-500/30">Published</span>
                         </div>
                    </div>
                </div>

                <div class="p-6 bg-primary/10 rounded-xl border border-primary/20">
                    <h2 class="text-xl font-bold text-primary mb-2">Viral Daily Drops</h2>
                    <p class="text-gray-300 text-sm">These are pre-made, high-potential post structures (memes, hooks, questions) that update daily. If you're stuck, drag one of these onto your calendar and fill in the blanks.</p>
                </div>
             </div>
        `
    },
    {
        id: 6,
        title: "Support: Getting Help When You Need It",
        category: "Support",
        time: "2 min read",
        description: "How to file tickets and use the self-service portal.",
        imagePrompt: "A helpful futuristic robot support agent, shaking hands with a human, warm lighting, approachable and friendly, 3d render",
        content: `
              <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Stuck? We've got you covered. Our support system is designed to get you back on track as fast as possible.
                </p>

                <h2 class="text-2xl font-bold text-white mt-8 mb-6">Channels</h2>
                <ul class="space-y-4">
                    <li class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center">🎫</div>
                        <div>
                            <strong class="text-white">Ticket System</strong>
                            <p class="text-sm text-gray-400">Use the form on the Support page for technical bugs. Expect a reply within 24 hours.</p>
                        </div>
                    </li>
                     <li class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center">💬</div>
                        <div>
                            <strong class="text-white">Live Chat</strong>
                            <p class="text-sm text-gray-400">Available 9am-5pm EST for user on the Enterprise plan.</p>
                        </div>
                    </li>
                     <li class="flex items-start gap-3">
                        <div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center">👥</div>
                        <div>
                            <strong class="text-white">Community</strong>
                            <p class="text-sm text-gray-400">Join our Discord (link in footer) to swap growth hacks with other users.</p>
                        </div>
                    </li>
                </ul>

                <div class="mt-8 p-4 bg-red-900/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                     <span class="text-red-400">⚠️</span>
                     <p class="text-xs text-red-300/70 mt-1">Before submitting a ticket, please check if your platform connections (Twitter/LinkedIn) are still active in the Dashboard.</p>
                </div>
              </div>
        `
    },
    {
        id: 7,
        title: "Settings: Managing Your Account",
        category: "Admin",
        time: "3 min read",
        description: "Billing, team members, and API keys.",
        imagePrompt: "A sleek settings gear icon made of glass and metal, floating in a dark void with illuminated circuits, administrative concept, 8k",
        content: `
            <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Configure your workspace, manage your subscription, and control access levels.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:border-primary/50 transition-colors">
                        <div class="text-3xl mb-2">🏢</div>
                        <h3 class="font-bold text-white">Workspaces</h3>
                        <p class="text-xs text-gray-400 mt-2">Manage multiple brands. PBRO users get 5 workspaces; Enterprise is unlimited.</p>
                    </div>
                     <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:border-primary/50 transition-colors">
                        <div class="text-3xl mb-2">🔑</div>
                        <h3 class="font-bold text-white">API Access</h3>
                        <p class="text-xs text-gray-400 mt-2">Generate an API Key. Allows you to programmatically create drafts from external tools.</p>
                    </div>
                     <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:border-primary/50 transition-colors">
                        <div class="text-3xl mb-2">👥</div>
                        <h3 class="font-bold text-white">Team</h3>
                        <p class="text-xs text-gray-400 mt-2">Invite copywriters. "Editor" role can create content; "Admin" manages billing.</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 8,
        title: "How to connect LinkedIn Page",
        category: "Setup Guide",
        time: "4 min read",
        description: "Step-by-step guide to linking your company page.",
        imagePrompt: "LinkedIn logo stylized 3d render, professional blue corporate aesthetic, connecting cables, secure connection concept",
        content: `
            <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    LinkedIn is the powerhouse of B2B viral growth. Connecting your Company Page allows PostDoctor to schedule posts and analyze engagement metrics in real-time.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div class="bg-gradient-to-br from-blue-900/20 to-transparent p-6 rounded-xl border border-blue-500/20">
                        <div class="text-blue-400 font-bold mb-2 flex items-center gap-2">
                            <span class="p-1 bg-blue-500/20 rounded">📋</span> Prerequisites
                        </div>
                        <ul class="space-y-3">
                            <li class="flex items-center gap-3 text-sm text-gray-300">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                <span>Must be a <strong>Super Admin</strong> of the Page</span>
                            </li>
                            <li class="flex items-center gap-3 text-sm text-gray-300">
                                <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                <span>Active PostDoctor Pro+ Subscription</span>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-white/5 p-6 rounded-xl border border-white/5">
                        <div class="text-white font-bold mb-2 flex items-center gap-2">
                            <span class="p-1 bg-white/10 rounded">💡</span> Pro Tip
                        </div>
                        <p class="text-sm text-gray-400">Personal profiles are currently supported via our Beta API. Contact support for early access.</p>
                    </div>
                </div>

                <h2 class="text-2xl font-bold text-white mt-12 mb-6">Connection Steps</h2>
                <div class="space-y-4">
                    <div class="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-start group hover:border-primary/30 transition-colors">
                        <div class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">1</div>
                        <div>
                            <h3 class="font-bold text-white mb-1">Navigate to Settings</h3>
                            <p class="text-sm text-gray-400">Go to <strong>Settings > Social Accounts</strong> in the main sidebar.</p>
                        </div>
                    </div>
                    
                    <div class="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-start group hover:border-primary/30 transition-colors">
                        <div class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">2</div>
                        <div>
                            <h3 class="font-bold text-white mb-1">Initiate Connection</h3>
                            <p class="text-sm text-gray-400">Click the "Connect" button next to the LinkedIn logo.</p>
                        </div>
                    </div>

                    <div class="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-start group hover:border-primary/30 transition-colors">
                        <div class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">3</div>
                        <div>
                            <h3 class="font-bold text-white mb-1">Authorize & Select</h3>
                            <p class="text-sm text-gray-400">Approve the permissions popup and select your target Company Page.</p>
                        </div>
                    </div>
                </div>

                <div class="mt-8 p-4 bg-red-900/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <div class="text-red-400 mt-1">⚠️</div>
                    <div>
                        <h4 class="text-red-400 font-bold text-sm">Troubleshooting</h4>
                        <p class="text-xs text-red-300/70 mt-1">If connection fails, clear your cache and ensure you are logged into the correct LinkedIn account.</p>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 9,
        title: "Best times to post for engagement",
        category: "Strategy",
        time: "6 min read",
        description: "Data-backed analysis of peak viral hours.",
        imagePrompt: "A sleek minimalist clock and calendar concept with upward trending graphs, dark mode, blue and green accents, business growth",
        content: `
            <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    Posting at 3 AM? You might as well be whispering into a void. Timing is everything when it comes to algorithmic velocity.
                </p>

                <h2 class="text-2xl font-bold text-white mt-8 mb-6">The "Golden Hours"</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-900 border border-white/10 p-6 rounded-xl relative overflow-hidden group">
                        <div class="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
                        <div class="relative z-10">
                            <div class="text-blue-400 font-bold mb-4 uppercase text-xs tracking-wider">Twitter / X</div>
                            <div class="text-2xl font-bold text-white mb-1">Tue & Thu</div>
                            <div class="text-sm text-gray-400">9:00 AM - 11:00 AM</div>
                        </div>
                    </div>
                     <div class="bg-gray-900 border border-white/10 p-6 rounded-xl relative overflow-hidden group">
                        <div class="absolute inset-0 bg-blue-700/5 group-hover:bg-blue-700/10 transition-colors"></div>
                        <div class="relative z-10">
                            <div class="text-blue-500 font-bold mb-4 uppercase text-xs tracking-wider">LinkedIn</div>
                            <div class="text-2xl font-bold text-white mb-1">Tue - Thu</div>
                            <div class="text-sm text-gray-400">8:00 AM - 10:00 AM</div>
                        </div>
                    </div>
                     <div class="bg-gray-900 border border-white/10 p-6 rounded-xl relative overflow-hidden group">
                        <div class="absolute inset-0 bg-pink-500/5 group-hover:bg-pink-500/10 transition-colors"></div>
                        <div class="relative z-10">
                            <div class="text-pink-400 font-bold mb-4 uppercase text-xs tracking-wider">Instagram</div>
                            <div class="text-2xl font-bold text-white mb-1">Weekdays</div>
                            <div class="text-sm text-gray-400">11:00 AM - 1:00 PM</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white/5 p-8 rounded-2xl border border-white/10 my-8">
                    <h2 class="text-xl font-bold text-white mb-4">The "Velocity" Factor</h2>
                    <div class="flex flex-col md:flex-row gap-6 items-center">
                        <div class="flex-1">
                            <p class="text-gray-300 leading-relaxed mb-4">
                                Platforms prioritize posts that get engagement within the first 15 minutes. This is why we recommend scheduling your "Viral Daily Drops" for exactly <strong>9:03 AM</strong> or <strong>8:57 AM</strong>.
                            </p>
                            <p class="text-gray-400 text-sm italic">
                                Avoid round hours (e.g. 9:00:00) when every other bot is firing.
                            </p>
                        </div>
                        <div class="w-full md:w-1/3 bg-black/40 rounded-lg p-4 border border-white/5 text-center">
                            <div class="text-4xl font-bold text-green-400 mb-2">+40%</div>
                            <div class="text-xs text-gray-500 uppercase tracking-widest">Reach Uplift</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 10,
        title: "Understanding the Viral Score",
        category: "Features",
        time: "5 min read",
        description: "Deep dive into our proprietary algorithm.",
        imagePrompt: "A glowing viral score indicator on a futuristic display, number 99 in bright neon, data streams in background, digital art",
        content: `
             <div class="space-y-8">
                <p class="text-xl text-gray-300 leading-relaxed font-light">
                    The <strong>Viral Score™</strong> is not just a random number—it's a probability engine designed to predict content success before you hit publish. It's your unfair advantage.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                    <div class="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        <h3 class="text-purple-400 font-bold mb-2">Keyword Velocity</h3>
                        <p class="text-sm text-purple-200/70">Are the words in your post currently trending up or down in global search volume?</p>
                    </div>
                    <div class="p-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <h3 class="text-indigo-400 font-bold mb-2">Sentiment Match</h3>
                        <p class="text-sm text-indigo-200/70">Does the emotional tone match the platform's current mood? (e.g. Inspirational vs Critical)</p>
                    </div>
                    <div class="p-6 rounded-xl bg-pink-500/10 border border-pink-500/20">
                        <h3 class="text-pink-400 font-bold mb-2">Resonance</h3>
                        <p class="text-sm text-pink-200/70">Have similar structures worked for your account in the past?</p>
                    </div>
                </div>

                <h2 class="text-2xl font-bold text-white mt-12 mb-6">Score Guide</h2>
                <div class="space-y-2">
                    <div class="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
                        <div class="w-16 text-center font-bold text-gray-500">0-40</div>
                        <div class="flex-1">
                            <div class="font-bold text-gray-400">Cold</div>
                            <div class="text-xs text-gray-500">Reword hook, adjust hashtags.</div>
                        </div>
                        <div class="w-2 h-2 rounded-full bg-gray-600"></div>
                    </div>
                    <div class="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
                        <div class="w-16 text-center font-bold text-yellow-500">41-79</div>
                        <div class="flex-1">
                            <div class="font-bold text-yellow-400">Warm</div>
                            <div class="text-xs text-gray-500">Good for maintenance posts.</div>
                        </div>
                        <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                    </div>
                    <div class="flex items-center gap-4 bg-primary/10 p-4 rounded-lg border border-primary/30">
                        <div class="w-16 text-center font-bold text-primary">80+</div>
                        <div class="flex-1">
                            <div class="font-bold text-white">Viral Likely</div>
                            <div class="text-xs text-primary/70">Hits all psychological triggers. Post now.</div>
                        </div>
                        <div class="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    </div>
                </div>

                <div class="mt-8 p-6 bg-gradient-to-r from-gray-900 to-black border-l-4 border-l-primary border-y border-r border-white/10 rounded-r-xl">
                    <div class="text-lg font-serif italic text-gray-300">
                        "Don't obsess over hitting 100. Consistency with scores of 70+ beats a single 99 once a year."
                    </div>
                    <div class="mt-4 flex items-center gap-3">
                         <div class="w-8 h-8 rounded-full bg-gray-700"></div>
                         <div class="text-xs text-gray-500 font-bold uppercase tracking-widest">PostDoctor AI Team</div>
                    </div>
                </div>
            </div>
        `
    }
];

const downloadImage = (url: string, filepath: string) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

async function main() {
    console.log('Seeding articles...');

    for (const article of ARTICLES) {
        let imageUrl = `/articles/article-${article.id}.png`;
        const imagePath = path.join(__dirname, '../../../client/public/articles', `article-${article.id}.png`);

        // Check if image exists
        if (!fs.existsSync(imagePath)) {
            console.log(`Generating image for article ${article.id}: ${article.title}...`);
            try {
                const response = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: article.imagePrompt,
                    n: 1,
                    size: "1024x1024",
                });

                const url = response.data?.[0]?.url;
                if (url) {
                    await downloadImage(url, imagePath);
                    console.log(`Image saved to ${imagePath}`);
                }
            } catch (error) {
                console.error(`Failed to generate image for article ${article.id}:`, error);
                imageUrl = ''; // Fallback
            }
        } else {
            console.log(`Image already exists for article ${article.id}, skipping generation.`);
        }

        // Upsert article in DB
        const { imagePrompt, ...articleData } = article;
        await prisma.article.upsert({
            where: { id: article.id },
            update: {
                ...articleData,
                imageUrl
            },
            create: {
                ...articleData,
                imageUrl
            }
        });
        console.log(`Upserted article ${article.id}`);
    }

    console.log('Seeding complete!');
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
