import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconChevronDown, IconChevronUp, IconMinus } from '@tabler/icons-react';
import { DynamicIcon } from '@/components/custom/dynamic-icon';
import type { ComponentProps, ReactNode } from 'react';

export type PillProps = ComponentProps<typeof Badge> & {
  themed?: boolean;
};

export const Pill = ({
  variant = 'default',
  themed = false,
  className,
  ...props
}: PillProps) => (
  <Badge
    variant={variant}
    className={cn('gap-2 rounded-full px-3 py-1.5 font-normal', className)}
    {...props}
  />
);

export type PillAvatarProps = ComponentProps<typeof AvatarImage> & {
  fallback?: string;
};

export const PillAvatar = ({
  fallback,
  className,
  ...props
}: PillAvatarProps) => (
  <Avatar className={cn('-ml-1 h-4 w-4', className)}>
    <AvatarImage {...props} />
    <AvatarFallback>{fallback}</AvatarFallback>
  </Avatar>
);

export type PillButtonProps = ComponentProps<typeof Button>;

export const PillButton = ({ className, ...props }: PillButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      '-my-2 -mr-2 size-6 rounded-full p-0.5 hover:bg-foreground/5',
      className
    )}
    {...props}
  />
);

export type PillStatusProps = {
  children: ReactNode;
  className?: string;
};

export const PillStatus = ({
  children,
  className,
  ...props
}: PillStatusProps) => (
  <div
    className={cn(
      'flex items-center gap-2 border-r pr-2 font-medium',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type PillIndicatorProps = {
  variant?: 'success' | 'error' | 'warning' | 'info';
  pulse?: boolean;
};

export const PillIndicator = ({
  variant = 'success',
  pulse = false,
}: PillIndicatorProps) => (
  <span className="relative flex size-2">
    {pulse && (
      <span
        className={cn(
          'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
          variant === 'success' && 'bg-emerald-400',
          variant === 'error' && 'bg-rose-400',
          variant === 'warning' && 'bg-amber-400',
          variant === 'info' && 'bg-sky-400'
        )}
      />
    )}
    <span
      className={cn(
        'relative inline-flex size-2 rounded-full',
        variant === 'success' && 'bg-emerald-500',
        variant === 'error' && 'bg-rose-500',
        variant === 'warning' && 'bg-amber-500',
        variant === 'info' && 'bg-sky-500'
      )}
    />
  </span>
);

export type PillDeltaProps = {
  className?: string;
  delta: number;
};

export const PillDelta = ({ className, delta }: PillDeltaProps) => {
  if (!delta) {
    return (
      <IconMinus className={cn('size-3 text-muted-foreground', className)} />
    );
  }

  if (delta > 0) {
    return (
      <IconChevronUp className={cn('size-3 text-emerald-500', className)} />
    );
  }

  return <IconChevronDown className={cn('size-3 text-rose-500', className)} />;
};

export type PillIconProps = {
  icon: React.ElementType | string;
  className?: string;
  size?: number;
};

export const PillIcon = ({
  icon: Icon,
  className,
  ...props
}: PillIconProps) => (
  typeof Icon === 'string' ? (
    <DynamicIcon
      icon={Icon}
      className={className}
      {...props}
    />
  ) : (
    <Icon
      stroke={1.5}
      className={className}
      {...props}
    />
  )
);

export type PillAvatarGroupProps = {
  children: ReactNode;
  className?: string;
};

export const PillAvatarGroup = ({
  children,
  className,
  ...props
}: PillAvatarGroupProps) => (
  <div
    className={cn(
      '-space-x-1 flex items-center',
      '[&>*:not(:first-of-type)]:[mask-image:radial-gradient(circle_9px_at_-4px_50%,transparent_99%,white_100%)]',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type PillWithIconProps = ComponentProps<typeof Badge> & {
  iconName?: string;
  children: ReactNode;
};
