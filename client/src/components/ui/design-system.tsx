import { motion } from 'framer-motion';
import type { ReactNode, ComponentProps, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const FadeIn = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
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
  <div className={cn("glass rounded-2xl p-6", hoverEffect && "glass-hover", className)} {...props}>
    {children}
  </div>
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    ghost: "hover:bg-white/10 text-foreground",
    outline: "border border-white/10 hover:bg-white/5"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export const PageHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-8 animate-in">
    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2 text-glow">{title}</h1>
    {subtitle && <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>}
  </div>
);
