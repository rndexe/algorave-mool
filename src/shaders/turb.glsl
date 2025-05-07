uniform float iTime;
uniform vec2 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

varying vec2 vUv;

// Turbulence parameters
const float turbulenceOctaveCount = 10.0;
const float turbulenceAmplitude = 0.7;
const float turbulenceWaveSpeed = 0.3;
const float turbulenceBaseFrequency = 2.0;
const float turbulenceFrequencyMultiplier = 1.4;

// Applies turbulent displacement to the input coordinates
vec2 applyTurbulence(vec2 position) {
    float currentFrequency = turbulenceBaseFrequency;

    // Initial 2D rotation matrix
    mat2 rotationMatrix = mat2(0.6, -0.8, 0.8, 0.6);

    for(float octave = 0.0; octave < turbulenceOctaveCount; octave++) {
        // Phase shift over time and octave index
        float wavePhase = currentFrequency * (position * rotationMatrix).y + turbulenceWaveSpeed * iTime + octave;

        // Apply sine wave displacement perpendicular to the wave direction
        position += (turbulenceAmplitude * rotationMatrix[0] * sin(wavePhase)) / currentFrequency;

        // Rotate and scale frequency for the next octave
        rotationMatrix *= mat2(0.6, -0.8, 0.8, 0.6);
        currentFrequency *= turbulenceFrequencyMultiplier;
    }

    return position;
}

void main() {
    // Normalize screen coordinates to range [-1, 1] with aspect ratio correction
    vec2 centeredCoords = 2.0 * (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;

    // Apply turbulence to the coordinates
    vec2 turbulentCoords = applyTurbulence(centeredCoords);

    // Generate a soft color gradient from blue to yellow using an exponential function
    vec3 baseColor = 0.5 * exp(0.1 * turbulentCoords.x * vec3(-1.0, 0.0, 2.0));

    // Modulate brightness based on a trigonometric pattern for visual complexity
    baseColor /= dot(cos(turbulentCoords * 3.0), sin(-turbulentCoords.yx * 3.0 * 0.618)) + 2.0;

    // Apply exponential tonemapping for high dynamic range appearance
    vec3 finalColor = 1.0 - exp(-baseColor);

    gl_FragColor = vec4(finalColor, 1.0);
}
