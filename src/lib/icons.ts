import type { LucideIcon } from 'lucide-react';
import { ShoppingBasket, Coffee, Users, Briefcase, Plane, HelpCircle, UserCircle2 } from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  ShoppingBasket,
  Coffee,
  Users,
  Briefcase,
  Plane,
  HelpCircle,
  UserCircle2,
};

export const getIconByName = (name: string | undefined): LucideIcon => {
  if (name && iconMap[name]) {
    return iconMap[name];
  }
  return HelpCircle; // Default fallback icon
};
