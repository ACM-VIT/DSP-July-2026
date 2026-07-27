import { describe, expect, it } from 'vitest'
import { defaultOrganicSphereSettings } from './types'
import { getWireframeStyleDefinition, wireframeStyleIds, wireframeStyles } from './wireframeStyles'

describe('wireframeStyles', () => {
  it('defines seven unique renderer styles and keeps Aqua Mesh as the default', () => {
    expect(wireframeStyles).toHaveLength(7)
    expect(new Set(wireframeStyles.map((style) => style.id)).size).toBe(7)
    expect(new Set(wireframeStyles.map((style) => style.shaderIndex)).size).toBe(7)
    expect(wireframeStyles.map((style) => style.id)).toEqual(wireframeStyleIds)
    expect(defaultOrganicSphereSettings.wireframeStyle).toBe('aqua-mesh')
  })

  it('resolves every public style id to its renderer definition', () => {
    for (const styleId of wireframeStyleIds) {
      expect(getWireframeStyleDefinition(styleId).id).toBe(styleId)
    }
  })
})
