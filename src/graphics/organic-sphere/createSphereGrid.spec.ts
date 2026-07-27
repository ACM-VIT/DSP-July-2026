import { describe, expect, it } from 'vitest'
import { createSphereGrid, type SphereGridTopology } from './createSphereGrid'

function edgeKinds(indices: Uint16Array, longitudeSegments: number) {
  const kinds = new Set<string>()

  for (let index = 0; index < indices.length; index += 2) {
    const start = indices[index]!
    const end = indices[index + 1]!
    const startLatitude = Math.floor(start / longitudeSegments)
    const endLatitude = Math.floor(end / longitudeSegments)
    const startLongitude = start % longitudeSegments
    const endLongitude = end % longitudeSegments

    if (startLatitude === endLatitude) {
      kinds.add('latitude')
    } else if (startLongitude === endLongitude) {
      kinds.add('longitude')
    } else {
      kinds.add('diagonal')
    }
  }

  return kinds
}

describe('createSphereGrid', () => {
  it('creates unit-sphere vertices and latitude-longitude lines without triangle diagonals', () => {
    const longitudeSegments = 8
    const latitudeSegments = 4
    const grid = createSphereGrid(longitudeSegments, latitudeSegments)

    expect(grid.positions).toHaveLength((latitudeSegments + 1) * longitudeSegments * 3)
    expect(grid.indices).toHaveLength(
      ((latitudeSegments - 1) * longitudeSegments + latitudeSegments * longitudeSegments) * 2,
    )

    for (let index = 0; index < grid.positions.length; index += 3) {
      const length = Math.hypot(
        grid.positions[index],
        grid.positions[index + 1],
        grid.positions[index + 2],
      )

      expect(length).toBeCloseTo(1, 5)
    }
  })

  it('rejects resolutions that cannot form a sphere', () => {
    expect(() => createSphereGrid(2, 4)).toThrow(RangeError)
    expect(() => createSphereGrid(8, 1)).toThrow(RangeError)
  })

  it.each<{
    topology: SphereGridTopology
    expectedEdges: number
    expectedKinds: string[]
  }>([
    { topology: 'grid', expectedEdges: 56, expectedKinds: ['latitude', 'longitude'] },
    { topology: 'latitudes', expectedEdges: 24, expectedKinds: ['latitude'] },
    { topology: 'longitudes', expectedEdges: 32, expectedKinds: ['longitude'] },
    {
      topology: 'lattice',
      expectedEdges: 88,
      expectedKinds: ['latitude', 'longitude', 'diagonal'],
    },
  ])('creates only the permitted $topology edges', ({ topology, expectedEdges, expectedKinds }) => {
    const longitudeSegments = 8
    const grid = createSphereGrid(longitudeSegments, 4, topology)

    expect(grid.indices).toHaveLength(expectedEdges * 2)
    expect([...edgeKinds(grid.indices, longitudeSegments)].sort()).toEqual(expectedKinds.sort())
  })
})
