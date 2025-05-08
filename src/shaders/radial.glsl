uniform float iTime;
uniform vec2 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

void main() {
    // Current pixel coordinates
    vec2 fragCoord = gl_FragCoord.xy;

    // Get the resolution
    vec2 resolution = iResolution.xy;

    // Normalize coordinates and center them (aspect-corrected)
    vec2 offset = (fragCoord + fragCoord - resolution); // same as 2*fragCoord - resolution
    vec2 uv = offset / resolution.y;

    // Convert Cartesian coordinates to polar-like space
    float logRadius = log(length(uv));        // radial component, scaled logarithmically
    float angle = atan(uv.x, uv.y);           // angular component (atan(x, y))
    vec2 polarCoords = vec2(logRadius, angle) / 0.1;

    // Time-animated distortion
    polarCoords.x -= iTime;

    // Distance from animated sine-cosine shape
    float distortion = length(cos(polarCoords.x) - sin(polarCoords));

    // Distance from center
    float radialDistance = length(uv);

    // Base color (red/orange tint)
    vec4 baseColor = vec4(1.0, 1.0, 1.0, 0.0) * .1;

    // Final color using tanh tone mapping
    vec4 finalColor = baseColor / (distortion * radialDistance);
    finalColor = tanh(finalColor);

    gl_FragColor = finalColor;
}
