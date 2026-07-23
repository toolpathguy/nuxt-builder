import type { Registry } from '../types/registry'

export const entries: Registry = {
  PageHero: {
    type: 'PageHero',
    label: 'Page Hero',
    category: 'layout',
    icon: 'i-lucide-layout-template',
    compileAs: 'UPageHero',
    acceptsChildren: false,
    props: {
      title: { type: 'string', default: 'Your Page Title' },
      description: { type: 'text', default: 'A compelling description for your hero section' },
      headline: { type: 'string', default: '' },
      orientation: { type: 'enum', options: ['vertical', 'horizontal'], default: 'vertical' },
    },
  },

  PageSection: {
    type: 'PageSection',
    label: 'Page Section',
    category: 'layout',
    icon: 'i-lucide-panel-top',
    compileAs: 'UPageSection',
    acceptsChildren: true,
    props: {
      title: { type: 'string', default: 'Section Title' },
      description: { type: 'text', default: '' },
      headline: { type: 'string', default: '' },
      orientation: { type: 'enum', options: ['vertical', 'horizontal'], default: 'vertical' },
      reverse: { type: 'boolean', default: false },
    },
  },

  PageColumns: {
    type: 'PageColumns',
    label: 'Page Columns',
    category: 'layout',
    icon: 'i-lucide-columns-3',
    compileAs: 'UPageColumns',
    acceptsChildren: true,
    props: {},
  },

  PageGrid: {
    type: 'PageGrid',
    label: 'Page Grid',
    category: 'layout',
    icon: 'i-lucide-grid-3x3',
    compileAs: 'UPageGrid',
    acceptsChildren: true,
    props: {},
  },

  PageCTA: {
    type: 'PageCTA',
    label: 'Page CTA',
    category: 'content',
    icon: 'i-lucide-megaphone',
    compileAs: 'UPageCTA',
    acceptsChildren: false,
    props: {
      title: { type: 'string', default: 'Ready to Get Started?' },
      description: { type: 'text', default: 'Start building your next project today.' },
      headline: { type: 'string', default: '' },
    },
  },

  PageFeature: {
    type: 'PageFeature',
    label: 'Page Feature',
    category: 'content',
    icon: 'i-lucide-sparkles',
    compileAs: 'UPageFeature',
    acceptsChildren: false,
    props: {
      title: { type: 'string', default: 'Feature Title' },
      description: { type: 'text', default: 'Describe this feature and its benefits.' },
      icon: { type: 'string', default: 'i-lucide-star' },
      orientation: { type: 'enum', options: ['vertical', 'horizontal'], default: 'vertical' },
    },
  },

  PageCard: {
    type: 'PageCard',
    label: 'Page Card',
    category: 'content',
    icon: 'i-lucide-credit-card',
    compileAs: 'UPageCard',
    acceptsChildren: false,
    props: {
      title: { type: 'string', default: 'Card Title' },
      description: { type: 'text', default: 'Card description goes here.' },
      to: { type: 'url', default: '' },
    },
  },

  Card: {
    type: 'Card',
    label: 'Card',
    category: 'content',
    icon: 'i-lucide-square',
    compileAs: 'UCard',
    acceptsChildren: true,
    props: {},
  },

  Button: {
    type: 'Button',
    label: 'Button',
    category: 'content',
    icon: 'i-lucide-mouse-pointer-click',
    compileAs: 'UButton',
    acceptsChildren: false,
    props: {
      label: { type: 'string', default: 'Click Me' },
      to: { type: 'url', default: '#' },
      color: { type: 'enum', options: ['primary', 'secondary', 'neutral', 'success', 'warning', 'error'], default: 'primary' },
      variant: { type: 'enum', options: ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'], default: 'solid' },
      size: { type: 'enum', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
    },
  },

  Separator: {
    type: 'Separator',
    label: 'Separator',
    category: 'layout',
    icon: 'i-lucide-minus',
    compileAs: 'USeparator',
    acceptsChildren: false,
    props: {
      orientation: { type: 'enum', options: ['horizontal', 'vertical'], default: 'horizontal' },
      label: { type: 'string', default: '' },
    },
  },

  RichText: {
    type: 'RichText',
    label: 'Rich Text',
    category: 'content',
    icon: 'i-lucide-text',
    acceptsChildren: false,
    props: {
      body: { type: 'text', default: 'Enter your content here.' },
      align: { type: 'enum', options: ['left', 'center', 'right'], default: 'left' },
    },
  },

  Image: {
    type: 'Image',
    label: 'Image',
    category: 'media',
    icon: 'i-lucide-image',
    acceptsChildren: false,
    props: {
      src: { type: 'image', default: 'https://placehold.co/800x400' },
      alt: { type: 'string', default: '' },
      rounded: { type: 'boolean', default: false },
    },
  },

  Spacer: {
    type: 'Spacer',
    label: 'Spacer',
    category: 'layout',
    icon: 'i-lucide-move-vertical',
    acceptsChildren: false,
    props: {
      size: { type: 'enum', options: ['sm', 'md', 'lg'], default: 'md' },
    },
  },
}
