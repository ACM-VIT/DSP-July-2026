import type { SphereGridTopology } from './createSphereGrid'

export const wireframeStyleIds = [
  'ice-grid',
  'aurora-flow',
  'signal-scan',
  'polar-threads',
  'chaos-lattice',
  'ghost-xray',
] as const

export type WireframeStyle = (typeof wireframeStyleIds)[number]

export type WireframeStyleDefinition = {
  id: WireframeStyle
  label: string
  description: string
  topology: SphereGridTopology
  shaderIndex: number
  swatches: readonly [string, string]
}

export const wireframeStyles: readonly WireframeStyleDefinition[] = [
  {
    id: 'ice-grid',
    label: 'Ice Grid',
    description: 'The original clean latitude-longitude mesh.',
    topology: 'grid',
    shaderIndex: 0,
    swatches: ['#c2e5fe', '#ffffff'],
  },
  {
    id: 'aurora-flow',
    label: 'Aurora Flow',
    description: 'A breathing cyan-violet gradient flowing across the mesh.',
    topology: 'grid',
    shaderIndex: 1,
    swatches: ['#62f5d2', '#b584ff'],
  },
  {
    id: 'signal-scan',
    label: 'Signal Scan',
    description: 'Horizontal contour bands with a traveling digital scan.',
    topology: 'latitudes',
    shaderIndex: 2,
    swatches: ['#c2e5fe', '#ffffff'],
  },
  {
    id: 'polar-threads',
    label: 'Polar Threads',
    description: 'Meridian strands with aqua-magenta colour flow.',
    topology: 'longitudes',
    shaderIndex: 3,
    swatches: ['#68d5ff', '#ff79c6'],
  },
  {
    id: 'chaos-lattice',
    label: 'Chaos Lattice',
    description: 'A dense diagonal network that flickers with the noise field.',
    topology: 'lattice',
    shaderIndex: 4,
    swatches: ['#7cecff', '#f4a5ff'],
  },
  {
    id: 'ghost-xray',
    label: 'Ghost X-Ray',
    description: 'Bright front wires with dim violet rear structure.',
    topology: 'grid',
    shaderIndex: 5,
    swatches: ['#eaf7ff', '#6750a4'],
  },
]

export function getWireframeStyleDefinition(style: WireframeStyle): WireframeStyleDefinition {
  return wireframeStyles.find((definition) => definition.id === style) ?? wireframeStyles[0]!
}
