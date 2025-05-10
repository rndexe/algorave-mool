uniform float iTime;
uniform vec2 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

varying vec2 vUv;


// Applies turbulent displacement to the input coordinates
vec2 applyTurbulence(vec2 position) {
    
  // Turbulence parameters
  float turbulenceBaseFrequency = 2.0;
  float currentFrequency = turbulenceBaseFrequency;
  float turbulenceOctaveCount = 10.0;
  float amp = 0.7;
  float turbulenceWaveSpeed = 0.7;
  float turbulenceFrequencyMultiplier = 1.4;

  // Initial 2D rotation matrix
  mat2 rotationMatrix = mat2(0.6, -0.8, 0.8, 0.6);

  for(float octave = 0.0; octave < turbulenceOctaveCount; octave++) {
    // Phase shift over time and octave index
    float wavePhase = currentFrequency *
                      (position * rotationMatrix).y +
                      turbulenceWaveSpeed *
                      (iTime) +
                      octave;
     // Apply sine wave displacement perpendicular to the wave direction
    position += ((amp) * rotationMatrix[0] * sin(wavePhase)) / 
                currentFrequency;
     // Rotate and scale frequency for the next octave
    rotationMatrix *= mat2(0.6, -0.8, 0.9, 0.5);
    currentFrequency *= turbulenceFrequencyMultiplier;
  }

  return position;
}

void main() {
  vec2 FC = gl_FragCoord.xy;
  vec2 res = iResolution;
  // Normalize screen coordinates to range [-1, 1] with aspect ratio correction
  vec2 centeredCoords = 2.0 * (FC * 2.0 - res.xy) / res.y;

  // Apply turbulence to the coordinates
  vec2 turbCoord = applyTurbulence(centeredCoords);

  // Generate a soft color gradient from blue to yellow using an exponential function
  vec3 baseColor = 0.1 * exp(1.0 * vec3(1.0, 1.0, 1.0));

  // Modulate brightness based on a trigonometric pattern for visual complexity
  baseColor /= dot(
                    cos(turbCoord * 3.0), 
                    sin(-turbCoord.yx * 2.0 * 1.618)
                  ) + 1.5;

   // Apply exponential tonemapping for high dynamic range appearance
  vec3 finalColor = 1.0 - exp(-baseColor);

  gl_FragColor = vec4(finalColor, 1.0);
}
