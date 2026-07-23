import { registry, componentMap, getEntry, defaultPropsFor, entriesByCategory } from '../../registry'

export function useRegistry() {
  return {
    registry,
    componentMap,
    getEntry,
    defaultPropsFor,
    entriesByCategory,
  }
}
