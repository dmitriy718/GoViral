import { PageHeader, GlassCard } from "@/components/ui/design-system";

import { SEO } from '@/components/seo/SEO';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <SEO title="Privacy Policy" description="Your data security is our priority." />
      <PageHeader title="Privacy Policy" subtitle="Your data security is our priority." />
      <GlassCard className="prose prose-invert max-w-none space-y-4 text-gray-300">
        <p>At PostDoctor AI, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your personal information.</p>

        <h3 className="text-xl font-bold text-white mt-6">1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, connect your social media profiles, or contact customer support.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Account Information: Name, email, password.</li>
          <li>Social Data: Access tokens for connected accounts (encrypted).</li>
          <li>Usage Data: How you interact with our features.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6">2. How We Use Information</h3>
        <p>We use your information to provide, maintain, and improve our services, including:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Generating content via AI models.</li>
          <li>Scheduling and publishing posts.</li>
          <li>Processing payments.</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6">3. Data Security</h3>
        <p>We use industry-standard encryption to protect your sensitive data, including OAuth tokens and billing information.</p>
      </GlassCard>
    </div>
  );
}
