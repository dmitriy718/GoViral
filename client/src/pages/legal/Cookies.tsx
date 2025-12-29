import { PageHeader, GlassCard } from "@/components/ui/design-system";

export function Cookies() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <PageHeader title="Cookie Policy" subtitle="Understanding how we use cookies." />
      <GlassCard className="prose prose-invert max-w-none space-y-4 text-gray-300">
        <p>ViralPost AI uses cookies to improve your experience. By using our service, you agree to our use of cookies.</p>
        
        <h3 className="text-xl font-bold text-white mt-6">What are cookies?</h3>
        <p>Cookies are small text files stored on your device that help us recognize you and remember your preferences.</p>

        <h3 className="text-xl font-bold text-white mt-6">Types of Cookies We Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-white">Essential</h4>
                <p className="text-sm">Required for the app to function (e.g., authentication).</p>
            </div>
             <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <h4 className="font-bold text-white">Analytics</h4>
                <p className="text-sm">Help us understand how users interact with the app.</p>
            </div>
        </div>
      </GlassCard>
    </div>
  );
}
