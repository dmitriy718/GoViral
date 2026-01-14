import { FadeIn, GlassCard, PageHeader } from "@/components/ui/design-system";
import { MessageSquare, Search, Book, ExternalLink, Ticket } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SEO } from '@/components/seo/SEO';

export function Support() {
    const [ticketSubject, setTicketSubject] = useState("");
    const [ticketMessage, setTicketMessage] = useState("");
    const mockMode = import.meta.env.VITE_MOCK_MODE === 'true';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!mockMode) return;
        if (!ticketSubject || !ticketMessage) return;

        // Simulate API call
        setTimeout(() => {
            toast.success("Ticket submitted successfully! We'll be in touch.");
            setTicketSubject("");
            setTicketMessage("");
        }, 1000);
    };



    return (
        <div className="p-8 max-w-7xl mx-auto">
            <SEO title="Help Desk" description="Get support for PostDoctor." />
            <PageHeader title="Help Desk" subtitle="We're here to help you go viral." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Ticket Area */}
                <div className="lg:col-span-2 space-y-8">
                    <FadeIn>
                        <GlassCard className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-primary" />
                                Submit a Request
                            </h2>
                            {!mockMode && (
                                <div className="text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    Support ticketing is not enabled in production yet.
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Subject</label>
                                    <input
                                        className="w-full bg-background/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none"
                                        placeholder="E.g. Issue with Instagram connection"
                                        value={ticketSubject}
                                        onChange={(e) => setTicketSubject(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-muted-foreground">Message</label>
                                    <textarea
                                        className="w-full bg-background/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary focus:outline-none h-40 resize-none"
                                        placeholder="Describe your issue in detail..."
                                        value={ticketMessage}
                                        onChange={(e) => setTicketMessage(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!mockMode || !ticketSubject || !ticketMessage}
                                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Submit Ticket
                                </button>
                            </div>
                        </GlassCard>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <h3 className="text-lg font-medium mb-4 ml-1">Your Recent Tickets</h3>
                        <div className="space-y-4">
                            {/* Real ticket logic would map here. Showing empty state for now as per requirement. */}
                            <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-dashed border-white/10 rounded-lg text-center">
                                <Ticket className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-gray-400">No open tickets found.</p>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Sidebar Knowledge Base */}
                <div className="space-y-6">
                    <FadeIn delay={0.2}>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50"
                                placeholder="Search knowledge base..."
                            />
                        </div>

                        <GlassCard className="space-y-4">
                            <h3 className="font-medium flex items-center gap-2 mb-4">
                                <Book className="w-4 h-4 text-secondary" />
                                Popular Articles
                            </h3>
                            {[
                                { title: "How to connect LinkedIn Page", to: "/learn/8" },
                                { title: "Best times to post for engagement", to: "/learn/9" },
                                { title: "Understanding the Viral Score", to: "/learn/10" },
                                { title: "Managing team permissions", to: "/learn/7" }
                            ].map((article, i) => (
                                <Link key={i} to={article.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-between group">
                                    {article.title}
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                            <Link to="/learn" className="block text-xs text-primary mt-4 font-medium hover:underline">View all articles →</Link>
                        </GlassCard>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
