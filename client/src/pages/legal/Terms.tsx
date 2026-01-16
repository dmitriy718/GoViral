import { PageHeader, GlassCard } from "@/components/ui/design-system";

import { SEO } from '@/components/seo/SEO';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <SEO title="Terms of Service" description="Legal terms." />
      <PageHeader title="Terms of Service" subtitle="Last updated: October 2023" />
      <GlassCard className="prose prose-invert max-w-none">
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using PostDoctor AI, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h3>2. Service Description</h3>
        <p>PostDoctor AI provides AI-powered social media management tools. We reserve the right to modify or discontinue the service at any time.</p>

        <h3>3. User Conduct</h3>
        <p>You agree not to use the service to generate harmful, illegal, or abusive content. We reserve the right to terminate accounts that violate this policy.</p>

        {/* More terms would go here */}
      </GlassCard>
    </div>
  );
}
