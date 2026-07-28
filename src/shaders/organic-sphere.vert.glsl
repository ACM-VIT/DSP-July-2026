#version 300 es

precision highp float;

layout(location = 0) in vec3 aPosition;

uniform mat4 uProjection;
uniform float uTime;
uniform float uBaseFrequency;
uniform float uFrequency;
uniform float uBaseAmplitude;
uniform float uPeakAmplitude;
uniform float uPeakSharpness;
uniform float uPeakBias;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uValleyAmplitude;
uniform float uDetailFrequency;
uniform float uDetailAmplitude;
uniform float uMicroFrequency;
uniform float uMicroAmplitude;
uniform float uScrollFlow;
uniform float uRotation;
uniform float uCameraDistance;

out vec3 vSphereDirection;
out vec3 vViewPosition;
out vec3 vViewNormal;
out float vDisplacedRadius;
out float vNoiseValue;

float randomValue(vec3 position) {
  position = fract(position * 0.3183099 + 0.1);
  position *= 17.0;
  return fract(position.x * position.y * position.z * (position.x + position.y + position.z));
}

float noise3d(vec3 position) {
  vec3 cell = floor(position);
  vec3 local = fract(position);
  vec3 curve = local * local * (3.0 - 2.0 * local);

  float nearBottomLeft = randomValue(cell);
  float nearBottomRight = randomValue(cell + vec3(1.0, 0.0, 0.0));
  float nearTopLeft = randomValue(cell + vec3(0.0, 1.0, 0.0));
  float nearTopRight = randomValue(cell + vec3(1.0, 1.0, 0.0));
  float farBottomLeft = randomValue(cell + vec3(0.0, 0.0, 1.0));
  float farBottomRight = randomValue(cell + vec3(1.0, 0.0, 1.0));
  float farTopLeft = randomValue(cell + vec3(0.0, 1.0, 1.0));
  float farTopRight = randomValue(cell + vec3(1.0, 1.0, 1.0));

  float nearBottom = mix(nearBottomLeft, nearBottomRight, curve.x);
  float nearTop = mix(nearTopLeft, nearTopRight, curve.x);
  float farBottom = mix(farBottomLeft, farBottomRight, curve.x);
  float farTop = mix(farTopLeft, farTopRight, curve.x);
  float nearFace = mix(nearBottom, nearTop, curve.y);
  float farFace = mix(farBottom, farTop, curve.y);

  return mix(nearFace, farFace, curve.z) * 2.0 - 1.0;
}

float fbm(vec3 position) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int octave = 0; octave < 2; octave += 1) {
    value += noise3d(position) * amplitude;
    position = position * 2.03 + vec3(0.83, 1.71, 2.47);
    amplitude *= 0.5;
  }

  return value / 0.75;
}

vec3 rotateObject(vec3 position, float rotation) {
  float tilt = -0.16;
  float tiltCosine = cos(tilt);
  float tiltSine = sin(tilt);
  vec3 tilted = vec3(
    position.x,
    position.y * tiltCosine - position.z * tiltSine,
    position.y * tiltSine + position.z * tiltCosine
  );

  float rotationCosine = cos(rotation);
  float rotationSine = sin(rotation);

  return vec3(
    tilted.x * rotationCosine + tilted.z * rotationSine,
    tilted.y,
    -tilted.x * rotationSine + tilted.z * rotationCosine
  );
}

void main() {
  vec3 sphereDirection = normalize(aPosition);

  // Scrolling advances the same phase the idle animation runs on, so the waves simply
  // travel further and faster while you scroll instead of a separate effect switching on.
  float wavePhase = uTime + uScrollFlow;
  vec3 timeOffset = vec3(
    cos(wavePhase * 0.7),
    sin(wavePhase * 0.6),
    cos(wavePhase * 0.4)
  ) * 0.18;

  // Water reads as water because the swell keeps travelling in one direction. The
  // orbiting phase above only churns in place, so add a steady drift that runs even
  // when idle; scrolling pushes the same travel forward rather than adding an effect.
  // uTime already scales with the mutation speed, so this coefficient is kept low to
  // stop a fast ripple turning the drift into the whole field visibly sliding.
  float travel = uTime * 0.5 + uScrollFlow;
  vec3 flowDrift = vec3(0.0, -travel * 0.5, travel * 0.18);

  float base = fbm(sphereDirection * uBaseFrequency + timeOffset * 0.25 + flowDrift * 0.25);
  vec3 warp = vec3(
    fbm(sphereDirection * uWarpFrequency + vec3(17.1, 3.7, 9.2)),
    fbm(sphereDirection * uWarpFrequency + vec3(4.3, 21.7, 2.8)),
    fbm(sphereDirection * uWarpFrequency + vec3(8.4, 6.1, 19.3))
  );

  vec3 warpedDirection = sphereDirection + warp * uWarpStrength;
  float noiseValue = fbm(
    warpedDirection * uFrequency + timeOffset + flowDrift
  );
  float normalizedNoise = noiseValue * 0.5 + 0.5;
  float peaks = pow(
    clamp(normalizedNoise, 0.0, 1.0),
    uPeakSharpness
  );
  float valleys = pow(
    clamp(1.0 - normalizedNoise, 0.0, 1.0),
    uPeakSharpness
  );
  float detailNoise = 0.0;
  if (uDetailAmplitude > 0.0001) {
    detailNoise = fbm(
      warpedDirection * (uFrequency * uDetailFrequency) -
      timeOffset * 0.8 +
      vec3(6.4, 13.7, 2.9)
    );
  }

  float microNoise = 0.0;
  if (uMicroAmplitude > 0.0001) {
    microNoise = noise3d(
      warpedDirection * (uFrequency * uMicroFrequency) +
      timeOffset * 1.4 +
      vec3(3.1, 8.7, 15.4)
    );
  }
  float displacement =
    base * uBaseAmplitude +
    (peaks - uPeakBias) * uPeakAmplitude -
    valleys * uValleyAmplitude +
    detailNoise * uDetailAmplitude +
    microNoise * uMicroAmplitude;

  float displacedRadius = max(0.4, 1.0 + displacement);
  vec3 deformedPosition = sphereDirection * displacedRadius;
  vec3 rotatedPosition = rotateObject(deformedPosition, uRotation);
  vec3 viewPosition = rotatedPosition + vec3(0.0, -0.04, -uCameraDistance);

  vSphereDirection = sphereDirection;
  vViewPosition = viewPosition;
  vViewNormal = normalize(rotateObject(sphereDirection, uRotation));
  vDisplacedRadius = displacedRadius;
  vNoiseValue = noiseValue;
  gl_Position = uProjection * vec4(viewPosition, 1.0);
}
