export type SphereGrid = {
  positions: Float32Array
  indices: Uint16Array
}

export type SphereGridTopology = 'grid' | 'latitudes' | 'longitudes' | 'lattice'

export function createSphereGrid(
  longitudeSegments: number,
  latitudeSegments: number,
  topology: SphereGridTopology = 'grid',
): SphereGrid {
  if (longitudeSegments < 3 || latitudeSegments < 2) {
    throw new RangeError('A sphere grid requires at least 3 longitude and 2 latitude segments')
  }

  const positions: number[] = []
  const indices: number[] = []

  for (let latitude = 0; latitude <= latitudeSegments; latitude += 1) {
    const verticalProgress = latitude / latitudeSegments
    const polarAngle = verticalProgress * Math.PI
    const ringRadius = Math.sin(polarAngle)
    const y = Math.cos(polarAngle)

    for (let longitude = 0; longitude < longitudeSegments; longitude += 1) {
      const horizontalProgress = longitude / longitudeSegments
      const azimuth = horizontalProgress * Math.PI * 2

      positions.push(ringRadius * Math.cos(azimuth), y, ringRadius * Math.sin(azimuth))
    }
  }

  if (topology !== 'longitudes') {
    for (let latitude = 1; latitude < latitudeSegments; latitude += 1) {
      const ringStart = latitude * longitudeSegments

      for (let longitude = 0; longitude < longitudeSegments; longitude += 1) {
        indices.push(ringStart + longitude, ringStart + ((longitude + 1) % longitudeSegments))
      }
    }
  }

  if (topology !== 'latitudes') {
    for (let latitude = 0; latitude < latitudeSegments; latitude += 1) {
      const ringStart = latitude * longitudeSegments
      const nextRingStart = ringStart + longitudeSegments

      for (let longitude = 0; longitude < longitudeSegments; longitude += 1) {
        indices.push(ringStart + longitude, nextRingStart + longitude)
      }
    }
  }

  if (topology === 'lattice') {
    for (let latitude = 0; latitude < latitudeSegments; latitude += 1) {
      const ringStart = latitude * longitudeSegments
      const nextRingStart = ringStart + longitudeSegments

      for (let longitude = 0; longitude < longitudeSegments; longitude += 1) {
        indices.push(ringStart + longitude, nextRingStart + ((longitude + 1) % longitudeSegments))
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    indices: new Uint16Array(indices),
  }
}
