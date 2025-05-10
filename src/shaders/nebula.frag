uniform float iTime;
uniform vec3 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

varying vec2 vUv;

void main() {
  vec2 SC = vUv * iResolution.xy;
  vec2 res = iResolution.xy;
  vec4 a_col = vec4(0.0);

  float time = iTime;
  float i = 0.0;
  float rayDepth = 0.0;
  float stepD, d;

    // Raymarch loop (30 steps for performance)
  for(a_col *= i; i++ < 10.0; 
      a_col += (cos(d + d - vec4(1.0, 1.0, 1.0, 3.0)) + 1.4) / stepD / rayDepth) {

      // Calculate ray direction from pixel to scene
    vec3 rayDir = normalize(vec3(SC + SC, 0.0) - res.xyy);
    vec3 currentPoint = rayDepth * rayDir;
    currentPoint.z -= time;

      // Add volumetric displacement via cosine turbulence
    for(stepD = 1.0; stepD < 64.0; stepD += stepD) {
      currentPoint += 0.7 * cos(currentPoint.yzx * stepD) / stepD;
    }

      // Rotate the xy plane using z-depth
    float ra = rayDepth * 0.8;
    mat2 rM = mat2(cos(ra), -sin(ra), sin(ra), cos(ra));
    currentPoint.xy *= rM;

      // Distance estimate to a volumetric structure along x-axis
    d = 3.0 - abs(currentPoint.x);

      // Adaptive step size: slower when closer to fog volume
    stepD = 0.09 + 0.1 * max(d, -d * 0.2);
    rayDepth += stepD;
  }

    // Simple tonemapping to compress HDR values into viewable range
  a_col = tanh(a_col * a_col / 3000.0);

  gl_FragColor = a_col;
}
