export function createPerspectiveMatrix(
  fieldOfViewRadians: number,
  aspectRatio: number,
  near: number,
  far: number,
): Float32Array {
  const focalLength = 1 / Math.tan(fieldOfViewRadians / 2)
  const depthRange = 1 / (near - far)

  return new Float32Array([
    focalLength / aspectRatio,
    0,
    0,
    0,
    0,
    focalLength,
    0,
    0,
    0,
    0,
    (far + near) * depthRange,
    -1,
    0,
    0,
    2 * far * near * depthRange,
    0,
  ])
}
