
import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react';
import type { ComponentProps } from 'react';

export type IconType = HugeiconsIconProps['icon'];

type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, 'icon'> & {
  icon: IconType;
};

export const Icon = ({ icon, ...props }: IconProps) => (
  <HugeiconsIcon icon={icon} {...props} />
);
