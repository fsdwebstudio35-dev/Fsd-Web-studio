import React from 'react';
import {
  Cpu,
  Globe,
  LayoutTemplate,
  MessageSquare,
  Palette,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Smartphone,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { ServiceItem, WhyChooseUsItem } from '../types';

export const ServiceIcon: React.FC<{
  name: ServiceItem['iconName'];
  className?: string;
}> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Globe':
      return <Globe className={className} aria-hidden="true" />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} aria-hidden="true" />;
    case 'Palette':
      return <Palette className={className} aria-hidden="true" />;
    case 'Cpu':
      return <Cpu className={className} aria-hidden="true" />;
    case 'LayoutTemplate':
      return <LayoutTemplate className={className} aria-hidden="true" />;
    case 'Search':
      return <Search className={className} aria-hidden="true" />;
    case 'RefreshCw':
      return <RefreshCw className={className} aria-hidden="true" />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} aria-hidden="true" />;
  }
};

export const ReasonIcon: React.FC<{
  name: WhyChooseUsItem['iconName'];
  className?: string;
}> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Sparkles':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'Smartphone':
      return <Smartphone className={className} aria-hidden="true" />;
    case 'Zap':
      return <Zap className={className} aria-hidden="true" />;
    case 'Users':
      return <Users className={className} aria-hidden="true" />;
    case 'MessageSquare':
      return <MessageSquare className={className} aria-hidden="true" />;
    case 'Sliders':
      return <Sliders className={className} aria-hidden="true" />;
  }
};
