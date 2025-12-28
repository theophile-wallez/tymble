import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Briefcase,
  Clock,
  HandCoins,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/ui/button';
import { BankCard } from './bank-card';

type WalletCardProps = {
  totalLabel?: string;
  amount?: string;
};

// Leather noise texture as inline SVG data URI (works reliably as CSS background)
const LEATHER_NOISE = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

export const WalletCard = ({
  totalLabel = 'Total Balance',
  amount = '$534,435.53',
}: WalletCardProps) => {
  return (
    <div className="w-full place-items-center p-4">
      {/* Outer wallet container - plain dark frame */}
      <div className="relative w-full overflow-hidden rounded-[34px] border border-white/10 bg-[#0d0e10] p-3 shadow-[0_26px_70px_rgba(0,0,0,.60),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-18px_40px_rgba(0,0,0,.55)]">
        {/* Account cards stack - positioned at top, behind wallet */}
        <div className="relative z-10" id="account-cards">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
            <BankCard
              amount="$243,940.03"
              icon={Briefcase}
              index={0}
              name="Funding"
            />
            <BankCard
              amount="$310,495.50"
              icon={TrendingUp}
              index={1}
              name="Unified Trading"
            />
            <BankCard
              amount="$100,000.00"
              icon={HandCoins}
              index={4}
              name="P2P Trading"
            />
          </div>
        </div>
        {/* SVG clipPath definitions using objectBoundingBox (0-1 coordinates) */}
        <svg aria-hidden="true" className="absolute" height="0" width="0">
          <defs>
            <clipPath clipPathUnits="objectBoundingBox" id="walletNotchLeft">
              <path d="M0,1 C1,1 0.4,0 1,0 L1,1 L0,1 Z" />
            </clipPath>
            <clipPath clipPathUnits="objectBoundingBox" id="walletNotchRight">
              <path d="M1,1 C0,1 0.6,0 0,0 L0,1 L1,1 Z" />
            </clipPath>
          </defs>
        </svg>
        <section className="h-30" id="wallet">
          <div className="flex h-6 w-full shrink-0 flex-row items-start justify-between">
            <div
              className="aspect-square h-full shrink-0 bg-blue-500"
              style={{ clipPath: 'url(#walletNotchLeft)' }}
            />
            <div className="h-full grow bg-blue-500" />
            <div
              className="aspect-square h-full shrink-0 bg-blue-500"
              style={{ clipPath: 'url(#walletNotchRight)' }}
            />
          </div>
        </section>
      </div>

      {/* Action buttons below the wallet */}
      <div className="mt-4 flex w-full max-w-[420px] items-center gap-3">
        <Button className="flex-1" size="lg">
          <ArrowDown className="h-4 w-4" />
          Deposit
        </Button>
        <Button className="flex-1" size="lg" variant="outline">
          <ArrowUp className="h-4 w-4" />
          Withdraw
        </Button>
        <Button size="icon" variant="outline">
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline">
          <Clock className="h-4 w-4" />
        </Button>
      </div>

      {/* Account management options below */}
      <div className="mt-4 w-full max-w-[420px] space-y-3">
        <button
          className="flex w-full items-center gap-3 rounded-lg bg-card px-4 py-3 text-left transition-colors hover:bg-accent"
          type="button"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffaabe]/20">
            <Briefcase className="h-5 w-5 text-[#ffaabe]" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground">Funding Account</div>
            <div className="text-muted-foreground text-sm">
              Manage your funding account
            </div>
          </div>
        </button>

        <button
          className="flex w-full items-center gap-3 rounded-lg bg-card px-4 py-3 text-left transition-colors hover:bg-accent"
          type="button"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#beb9ff]/20">
            <TrendingUp className="h-5 w-5 text-[#beb9ff]" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground">
              Unified Trading Account
            </div>
            <div className="text-muted-foreground text-sm">
              Manage your trading account
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
