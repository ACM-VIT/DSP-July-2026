import { describe, expect, it } from 'vitest'
import { defaultOrganicSphereSettings } from './types'
import { getWireframeStyleDefinition, wireframeStyleIds, wireframeStyles } from './wireframeStyles'

describe('wireframeStyles', () => {
  it('defines six unique renderer styles and keeps Ice Grid as the default', () => {
    expect(wireframeStyles).toHaveLength(6)
    expect(new Set(wireframeStyles.map((style) => style.id)).size).toBe(6)
    expect(new Set(wireframeStyles.map((style) => style.shaderIndex)).size).toBe(6)
    expect(wireframeStyles.map((style) => style.id)).toEqual(wireframeStyleIds)
    expect(defaultOrganicSphereSettings.wireframeStyle).toBe('ice-grid')
  })

  it('resolves every public style id to its renderer definition', () => {
    for (const styleId of wireframeStyleIds) {
      expect(getWireframeStyleDefinition(styleId).id).toBe(styleId)
    }
  })
})
