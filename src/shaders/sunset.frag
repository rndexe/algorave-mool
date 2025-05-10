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
  vec2 SC = vUv * iResolution.xy;
  vec2 res = iResolution.xy;

  vec4 a_col = vec4(0.0); // Final output color
  float t = iTime;
  float i = 0.0;
  float depth = 0.0;        // Depth along the ray
  float ss, distF;

// Raymarching loop (10 steps)
  for(a_col *= i; i++ < 10.0;) {
    // Generate a normalized ray direction from camera through pixel
    vec3 rayDir = normalize(vec3(SC + SC, 0.0) - res.xyy);
    vec3 curPos = depth * rayDir;

    // Add layered turbulence using sine waves at increasing frequency
    for(ss = 5.0; ss < 200.0; ss += ss) {
      vec3 displaced = sin(curPos.yzx * ss - 0.2 * t);
      curPos += 0.6 * displaced / ss;
    }

    // Compute signed distance to cloud layer (centered around y = 0)
    distF = 0.3 - abs(curPos.y);

    // Compute dynamic step size: smaller when inside clouds
    ss = 0.005 + max(distF, -distF * 0.2) / 4.0;
    depth += ss;

    // Phase offset controls how color pulses over space and t
    float colorPhase = distF / 0.07 + curPos.x + 0.5 * t;

    // Add colorful banded light with exponential falloff
    a_col += (cos(
                    colorPhase -
                    vec4(1.0, 1.0, 1.0, 3.0) - 3.0
                ) + 1.5) * 
             exp(distF / 0.1) / ss;
  }

      // Tone mapping: compress brightness into visible range
  a_col = tanh(a_col * a_col / 4e7);

  gl_FragColor = a_col;
}
