uniform float iTime;
uniform vec2 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

varying vec2 vUv;

// Constants
const float colorWaveFrequency = 1.0;
const vec3 rgbPhaseShift = vec3(0.0, 2.0, 5.0);
const float translucencyOpacity = 0.1;

const float perspectiveDepth = 1.0;
const float raymarchSteps = 75.0;

const vec3 cameraVelocity = vec3(0.0, 1.0, 1.0);

const float cubeDistortionFrequency = 0.2;

void main() {
    // Get the screen resolution and compute UV coordinates in range [-1, 1]
    vec2 resolution = iResolution;
    vec2 screenUv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;

    // Create the ray direction from the camera through the pixel
    vec3 rayDirection = normalize(vec3(screenUv, -perspectiveDepth));

    // Initialize color accumulation
    vec3 accumulatedColor = vec3(0.0);

    // Ray depth and distance tracker
    float rayDepth = 0.0;
    float distanceStep = 0.0;

    for(float step = 0.0; step < raymarchSteps; step++) {
        // Compute the current raymarch point in space
        vec3 rayPosition = rayDepth * rayDirection - iTime * cameraVelocity;

        // Create a repeating cubic pattern with distortions
        vec3 distortedPosition = cos(rayPosition + cos(rayPosition / cubeDistortionFrequency));

        // Approximate a cube distance field with translucency using max()
        rayDepth += distanceStep = length(max(distortedPosition, distortedPosition.yzx * translucencyOpacity)) / 6.0;

        // Add glow color based on wave-shifted sine of y-position
        accumulatedColor += (sin(colorWaveFrequency * rayPosition.y + rgbPhaseShift) + 1.0) / distanceStep;
    }

    // Tonemapping for high dynamic range
    vec3 finalColor = 1.0 - exp(-accumulatedColor / raymarchSteps / 100.0);

    gl_FragColor = vec4(finalColor, 1.0);
}
