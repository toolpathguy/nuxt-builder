import type { Component } from 'vue'
import type { RegistryEntry } from '../types/registry'
import { entries } from './entries'
import { validateRegistry } from './validation'

// Block component imports
import BlockPageHero from '~/components/blocks/BlockPageHero.vue'
import BlockPageSection from '~/components/blocks/BlockPageSection.vue'
import BlockPageColumns from '~/components/blocks/BlockPageColumns.vue'
import BlockPageGrid from '~/components/blocks/BlockPageGrid.vue'
import BlockPageCTA from '~/components/blocks/BlockPageCTA.vue'
import BlockPageFeature from '~/components/blocks/BlockPageFeature.vue'
import BlockPageCard from '~/components/blocks/BlockPageCard.vue'
import BlockCard from '~/components/blocks/BlockCard.vue'
import BlockButton from '~/components/blocks/BlockButton.vue'
import BlockSeparator from '~/components/blocks/BlockSeparator.vue'
import BlockRichText from '~/components/blocks/BlockRichText.vue'
import BlockImage from '~/components/blocks/BlockImage.vue'
import BlockSpacer from '~/components/blocks/BlockSpacer.vue'

// Dev-time validation guard
if (import.meta.dev) {
  validateRegistry(entries)
}

// Re-export entries as registry
export const registry = entries

// Component map linking type strings to Vue component references
export const componentMap: Record<string, Component> = {
  PageHero: BlockPageHero,
  PageSection: BlockPageSection,
  PageColumns: BlockPageColumns,
  PageGrid: BlockPageGrid,
  PageCTA: BlockPageCTA,
  PageFeature: BlockPageFeature,
  PageCard: BlockPageCard,
  Card: BlockCard,
  Button: BlockButton,
  Separator: BlockSeparator,
  RichText: BlockRichText,
  Image: BlockImage,
  Spacer: BlockSpacer,
}

// Helper: get a single registry entry by type
export function getEntry(type: string): RegistryEntry | undefined {
  if (!Object.hasOwn(registry, type)) return undefined
  return registry[type]
}

// Helper: get default prop values for a given type
export function defaultPropsFor(type: string): Record<string, unknown> | undefined {
  if (!Object.hasOwn(registry, type)) return undefined
  const entry = registry[type]!
  const defaults: Record<string, unknown> = {}
  for (const [key, schema] of Object.entries(entry.props)) {
    defaults[key] = schema.default ?? undefined
  }
  return defaults
}

// Helper: group entries by category
export function entriesByCategory(): Record<string, RegistryEntry[]> {
  const grouped: Record<string, RegistryEntry[]> = {}
  for (const entry of Object.values(registry)) {
    if (!grouped[entry.category]) grouped[entry.category] = []
    grouped[entry.category]!.push(entry)
  }
  return grouped
}
