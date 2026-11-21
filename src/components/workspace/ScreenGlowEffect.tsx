import { motion, AnimatePresence } from 'motion/react';

interface ScreenGlowEffectProps {
  isGlowing: boolean;
  glowStyle?: 'siri' | 'amber' | 'violet';
}

export default function ScreenGlowEffect({ isGlowing, glowStyle = 'siri' }: ScreenGlowEffectProps) {
  const getGradientStyle = () => {
    switch (glowStyle) {
      case 'amber':
        return 'from-amber-500 via-orange-500 to-yellow-400';
      case 'violet':
        return 'from-violet-600 via-purple-500 to-indigo-400';
      case 'siri':
      default:
        // Apple Siri / Circle-to-Search aura: Vibrant cyan, violet, magenta & warm amber
        return 'from-cyan-400 via-indigo-500 via-purple-500 via-pink-500 to-amber-400';
    }
  };

  return (
    <AnimatePresence>
      {isGlowing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
        >
          {/* Edge aura border sweep */}
          <div
            className={`absolute inset-0 rounded-none border-[12px] border-transparent bg-origin-border p-1 bg-gradient-to-r ${getGradientStyle()} animate-pulse blur-xl opacity-80`}
            style={{
              maskImage: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />

          {/* Inner perimeter shimmer light */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.85, 0.4],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.2,
              ease: 'easeInOut',
            }}
            className={`absolute -inset-[20px] bg-gradient-to-r ${getGradientStyle()} blur-2xl opacity-40`}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 4px 4px, 4px calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 4px, 4px 4px)',
            }}
          />

          {/* Polishing Indicator Badge at Top Center */}
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/90 border border-border/80 shadow-2xl backdrop-blur-xl text-foreground text-sm font-medium"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
              Polishing with AI...
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
