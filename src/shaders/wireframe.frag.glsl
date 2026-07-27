#version 300 es

precision highp float;

uniform float uOpacity;
uniform float uTime;
uniform int uWireframeStyle;

in vec3 vSphereDirection;
in vec3 vViewPosition;
in vec3 vViewNormal;
in float vDisplacedRadius;
in float vNoiseValue;

out vec4 outputColor;

void main() {
  const vec3 iceBlue = vec3(0.760784, 0.898039, 0.996078); // #C2E5FE
  vec3 color = iceBlue;
  float alpha = uOpacity;
  float facing = dot(normalize(vViewNormal), normalize(-vViewPosition));

  if (uWireframeStyle == 1) {
    float flow = 0.5 + 0.5 * sin(
      vSphereDirection.y * 5.0 +
      vNoiseValue * 4.0 +
      uTime * 1.4
    );
    float pulse = 0.72 + 0.28 * sin(uTime * 2.0 + vSphereDirection.x * 4.0);
    color = mix(
      vec3(0.384314, 0.960784, 0.823529),
      vec3(0.709804, 0.517647, 1.0),
      flow
    );
    alpha *= pulse;
  } else if (uWireframeStyle == 2) {
    float scanPosition = vSphereDirection.y * 13.0 - uTime * 8.0;
    float scan = pow(0.5 + 0.5 * sin(scanPosition), 9.0);
    float digitalGap = step(
      0.22,
      fract(
        (vSphereDirection.x - vSphereDirection.z) * 7.5 +
        uTime * 0.35
      )
    );
    color = mix(iceBlue, vec3(1.0), scan);
    alpha *= (0.22 + scan * 0.98) * digitalGap;
  } else if (uWireframeStyle == 3) {
    float longitude = atan(vSphereDirection.z, vSphereDirection.x);
    float flow = 0.5 + 0.5 * sin(longitude * 3.0 + uTime * 1.8);
    float frontEmphasis = mix(0.25, 1.0, smoothstep(-0.45, 0.8, facing));
    color = mix(
      vec3(0.407843, 0.835294, 1.0),
      vec3(1.0, 0.47451, 0.776471),
      flow
    );
    alpha *= frontEmphasis;
  } else if (uWireframeStyle == 4) {
    float spark = pow(
      abs(
        sin(
          vNoiseValue * 18.0 +
          vDisplacedRadius * 11.0 +
          uTime * 3.5
        )
      ),
      5.0
    );
    color = mix(
      vec3(0.486275, 0.92549, 1.0),
      vec3(0.956863, 0.647059, 1.0),
      spark
    );
    alpha *= 0.55 + spark * 0.75;
  } else if (uWireframeStyle == 5) {
    float front = smoothstep(-0.35, 0.72, facing);
    color = mix(
      vec3(0.403922, 0.313725, 0.643137),
      vec3(0.917647, 0.968627, 1.0),
      front
    );
    alpha *= mix(0.2, 1.0, front);
  }

  if (alpha < 0.01) {
    discard;
  }

  outputColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
