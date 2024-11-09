import { Link as RouterLink, LinkProps } from 'react-router-dom';

import { cn } from '@/utils/cn';

// a wrapper of react router dom link tag
export const Link = ({ className, children, ...props }: LinkProps) => {
  return (
    <RouterLink
      // merge with some default class
      className={cn('text-slate-600 hover:text-slate-900', className)}
      // pass every other props down
      {...props}
    >
      {/* wrap the children */}
      {children}
    </RouterLink>
  );
};
