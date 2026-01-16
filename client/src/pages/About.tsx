import { GlassCard, FadeIn } from "@/components/ui/design-system";
import { Users, Zap, Shield, Globe } from "lucide-react";

import { SEO } from '@/components/seo/SEO';

export function About() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <SEO title="About Us" description="We are PostDoctor." />
      <FadeIn>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-6 text-glow">
            We Are PostDoctor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering creators and brands to dominate the digital landscape through the power of generative artificial intelligence.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <FadeIn delay={0.2}>
          <GlassCard className="h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To democratize professional-grade content creation. We believe that every voice deserves to be heard, and we provide the tools to amplify that voice across every platform, instantly.
            </p>
          </GlassCard>
        </FadeIn>
        <FadeIn delay={0.4}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Zap, label: "Speed", val: "10x" },
              { icon: Users, label: "Users", val: "50k+" },
              { icon: Shield, label: "Secure", val: "100%" },
              { icon: Globe, label: "Global", val: "24/7" },
            ].map((stat, i) => (
              <GlassCard key={i} className="flex flex-col items-center justify-center p-6 text-center">
                <stat.icon className="w-8 h-8 text-primary mb-2" />
                <span className="text-2xl font-bold text-white">{stat.val}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
