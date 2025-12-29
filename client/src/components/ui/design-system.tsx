import { motion } from 'framer-motion';
import type { ReactNode, ComponentProps } from 'react';

export const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

interface GlassCardProps extends ComponentProps<'div'> {
  children: ReactNode;
  hoverEffect?: boolean;
}

export const GlassCard = ({ children, className = "", hoverEffect = true, ...props }: GlassCardProps) => (
  <div className={`glass rounded-xl p-6 ${hoverEffect ? 'glass-hover' : ''} ${className}`} {...props}>
    {children}
  </div>
);

export const PageHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold tracking-tight text-white mb-2 text-glow">{title}</h1>
    {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
  </div>
);
