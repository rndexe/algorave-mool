uniform float iTime;
uniform vec3 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

varying vec2 vUv;

void main() {
      // Convert UV coordinates to screen space
  vec2 screenPos = vUv * iResolution.xy;

  vec4 accumulatedColor = vec4(0.0); // Final output color
  float time = iTime;
  float iteration = 0.0;
  float depth = 0.0;        // Depth along the ray
  float stepSize, distanceField;

      // Raymarching loop (10 steps)
  for(accumulatedColor *= iteration; iteration++ < 10.0;) {
        // Generate a normalized ray direction from camera through pixel
    vec3 rayDirection = normalize(vec3(screenPos + screenPos, 0.0) - iResolution.xyy);
    vec3 currentPosition = depth * rayDirection;

        // Add layered turbulence using sine waves at increasing frequency
    for(stepSize = 5.0; stepSize < 200.0; stepSize += stepSize) {
      vec3 displaced = sin(currentPosition.yzx * stepSize - 0.2 * time);
      currentPosition += 0.6 * displaced / stepSize;
    }

        // Compute signed distance to cloud layer (centered around y = 0)
    distanceField = 0.3 - abs(currentPosition.y);

        // Compute dynamic step size: smaller when inside clouds
    stepSize = 0.005 + max(distanceField, -distanceField * 0.2) / 4.0;
    depth += stepSize;

        // Phase offset controls how color pulses over space and time
    float colorPhase = distanceField / 0.07 + currentPosition.x + 0.5 * time;

        // Add colorful banded light with exponential falloff
    accumulatedColor += (cos(colorPhase - vec4(0, 1, 2, 3) - 3.0) + 1.5) * exp(distanceField / 0.1) / stepSize;
  }

      // Tone mapping: compress brightness into visible range
  accumulatedColor = tanh(accumulatedColor * accumulatedColor / 1e7);

  gl_FragColor = accumulatedColor;
}