uniform float iTime;
uniform vec2 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

varying vec2 vUv;

void main() {
  
  vec2 FC = gl_FragCoord.xy;
  float colorWaveFrequency = 2.0;
  vec3 rgbPhaseShift = vec3(1.0, 1.0, 1.0);
  float translucencyOpacity = 0.1;
  float pDepth = 1.0;
  float rm_Steps = 25.0;
  float cubeDistFreq = 0.2;
  vec3 cameraVel = vec3(0.0, 1.0, 1.0);

  // Get the screen resolution and compute UV coordinates in range [-1, 1]
  vec2 res = iResolution.xy;
  vec2 sUv = (2.0 * FC - res) / res.y;
  // Create the ray direction from the camera through the pixel
  vec3 rayDir = normalize(vec3(sUv, -pDepth));
  // Initialize color accumulation
  vec3 a_col = vec3(0.0);
  // Ray depth and distance tracker
  float rayDepth = 0.0;
  float distanceStep = 0.0;
  

  for(float step = 0.0; step < rm_Steps; step++) {
  
//Compute the current raymarch point in space
    vec3 rayPosition = 
         rayDepth * rayDir - iTime * cameraVel;
    
//Create a repeating cubic pattern with distortions
    vec3 distortedPosition = 
        cos(rayPosition + 
            cos(rayPosition / cubeDistFreq));

//Approximate a cube distance field with translucency using max()
    rayDepth += 
      distanceStep = 
        length(max(distortedPosition, 
                   distortedPosition.yzx * 
                   translucencyOpacity)) / 5.0;
    
// Add glow color based on wave-shifted sine of y-position
    a_col += 
      (sin(colorWaveFrequency * 
           rayPosition.y + 
           rgbPhaseShift) + 1.0) / distanceStep;
  }
  
  // Tonemapping for high dynamic range
  vec3 finalColor = 
  1.0 - exp(-a_col / rm_Steps / 100.0);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
