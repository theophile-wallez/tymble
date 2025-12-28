import { WalletCard } from '@/components/ui/wallet/wallet';
import { WidgetLayout } from './widget-layout';

type Props = {
  amount: string;
  subAmount: string;
  fundingAmount: string;
  totalLabel: string;
  isEditing?: boolean;
};

export const WalletWidget = ({
  amount,
  subAmount,
  fundingAmount,
  totalLabel,
  isEditing,
}: Props) => (
  <WidgetLayout isEditing={isEditing} transparent={true}>
    <WalletCard amount={amount} totalLabel={totalLabel} />
  </WidgetLayout>
);
