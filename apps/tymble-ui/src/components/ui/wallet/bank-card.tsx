import type { LucideIcon } from 'lucide-react';
import { cn } from '@/ui/utils';

const gradientVariants = [
  'from-[#beb9ff] to-[#beb9ff]/60', // Lavender
  'from-[#ff9a9e] to-[#fecfef]/60', // Rose blush
  'from-[#a8edea] to-[#fed6e3]/60', // Mint peach
  'from-[#ffecd2] to-[#fcb69f]/60', // Warm sunset
  'from-[#667eea] to-[#764ba2]/60', // Deep purple
  'from-[#11998e] to-[#38ef7d]/60', // Emerald glow
  'from-[#fc4a1a] to-[#f7b733]/60', // Tangerine
  'from-[#00c6ff] to-[#0072ff]/60', // Ocean blue
  'from-[#f857a6] to-[#ff5858]/60', // Hot pink
  'from-[#4facfe] to-[#00f2fe]/60', // Electric cyan
] as const;

type Props = {
  name: string;
  icon: LucideIcon;
  amount: string;
  index: number;
};

export const BankCard = ({ name, icon: Icon, amount, index }: Props) => {
  const gradientClass = gradientVariants[index % gradientVariants.length];

  return (
    <div
      className={cn(
        'flex h-12 items-center justify-between border-white/10 border-t bg-linear-to-r px-5 py-4 transition-all duration-300',
        gradientClass,
        'hover:h-18'
      )}
      style={{
        zIndex: 2 + index,
      }}
    >
      <div className="flex items-center gap-3 font-semibold">
        <Icon className="h-4 w-4" />
        {name}
      </div>
      <div className="font-semibold">{amount}</div>
    </div>
  );
};
