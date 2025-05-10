precision highp float;

uniform float iTime;
uniform vec2 iResolution;

void main() {
  // Fragment coordinates
  vec2 fragCoord = gl_FragCoord.xy;

   // Output color accumulator
  vec4 fragColor = vec4(0.0);

  // Dimensions of each "shooting star" streak
  // (like a narrow rectangle)
  vec2 halfs = vec2(0.0, 0.2);

   // Declare reusable rotation matrix
  mat2 rotationMatrix;

   // Declare variable for transformed position
  vec2 position;

   // Iterate multiple "stars" (20 passes)
  for (float i = 0.9; i < 20.0; i+= 1.0) {

     // Compute rotation matrix that varies per star
    float angle = i;
    rotationMatrix = mat2(
        cos(angle), -sin(angle),
        sin(angle),  cos(angle)
    );

    // Compute moving star pattern with fract and rotation
    vec2 uv = fragCoord / iResolution.y;
    vec2 movingUV = uv * i * 0.1 + iTime * halfs;
    vec2 wrapped = fract(movingUV * rotationMatrix) - 0.5;

    // Rotate and store position
    position = rotationMatrix * wrapped;

    // Calculate glow using distance to a clamped box shape
    vec2 clamped = clamp(position, -halfs, halfs);
    float distanceToBox = length(clamped - position);

    // Attenuate based on distance
    float intensity = 1e-3 / distanceToBox;

// Use a cycling color palette based on vertical position
    vec4 color = (cos(position.y / 0.1 + vec4(0.0, 0.0, 0.3, 0.0)) + 1.1);

    // Accumulate glowing streaks
    fragColor += intensity * color;
  }

   // Output the final color
  gl_FragColor = fragColor;
}
