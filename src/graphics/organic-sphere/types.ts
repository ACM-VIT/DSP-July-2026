import type { WireframeStyle } from './wireframeStyles'

export type OrganicSphereSettings = {
  wireframeStyle: WireframeStyle
  baseFrequency: number
  frequency: number
  baseAmplitude: number
  peakAmplitude: number
  peakSharpness: number
  peakBias: number
  warpStrength: number
  warpFrequency: number
  valleyAmplitude: number
  detailFrequency: number
  detailAmplitude: number
  microFrequency: number
  microAmplitude: number
  animationSpeed: number
  rotationSpeed: number
  opacity: number
}

export type OrganicSphereRenderer = {
  start: () => void
  destroy: () => void
  setInViewport: (isInViewport: boolean) => void
  setReducedMotion: (prefersReducedMotion: boolean) => void
  setScrollDistortion: (strength: number) => void
  setSettings: (settings: Partial<OrganicSphereSettings>) => void
}

export const defaultOrganicSphereSettings: Readonly<OrganicSphereSettings> = {
  wireframeStyle: 'ice-grid',
  baseFrequency: 1.5,
  frequency: 2.4,
  baseAmplitude: 0.12,
  peakAmplitude: 0.72,
  peakSharpness: 3.6,
  peakBias: 0.18,
  warpStrength: 0.3,
  warpFrequency: 1.2,
  valleyAmplitude: 0,
  detailFrequency: 2.35,
  detailAmplitude: 0,
  microFrequency: 4.8,
  microAmplitude: 0,
  animationSpeed: 0.07,
  rotationSpeed: 0.08,
  opacity: 0.14,
}

export const noisyOrganicSphereSettings: Readonly<OrganicSphereSettings> = {
  wireframeStyle: 'ice-grid',
  baseFrequency: 2.2,
  frequency: 4.2,
  baseAmplitude: 0.18,
  peakAmplitude: 0.9,
  peakSharpness: 1.45,
  peakBias: 0.06,
  warpStrength: 0.42,
  warpFrequency: 2,
  valleyAmplitude: 0.75,
  detailFrequency: 2.35,
  detailAmplitude: 0.2,
  microFrequency: 4.8,
  microAmplitude: 0.055,
  animationSpeed: 0.07,
  rotationSpeed: 0.08,
  opacity: 0.16,
}
