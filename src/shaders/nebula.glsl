uniform float iTime;
uniform vec3 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

varying vec2 vUv;

void main() {
  vec2 screenPosition = vUv * iResolution.xy;
  vec4 accumulatedColor = vec4(0.0);

  float time = iTime;
  float iteration = 0.0;
  float rayDepth = 0.0;
  float stepDistance, signedDistance;

    // Raymarch loop (30 steps for performance)
  for(accumulatedColor *= iteration; iteration++ < 15.0; accumulatedColor += (cos(signedDistance + signedDistance - vec4(1.0, 0.0, 1.0, 3.0)) + 1.4) / stepDistance / rayDepth) {

      // Calculate ray direction from pixel to scene
    vec3 rayDirection = normalize(vec3(screenPosition + screenPosition, 0.0) - iResolution.xyy);
    vec3 currentPoint = rayDepth * rayDirection;
    currentPoint.z -= time;

      // Add volumetric displacement via cosine turbulence
    for(stepDistance = 1.0; stepDistance < 64.0; stepDistance += stepDistance) {
      currentPoint += 0.7 * cos(currentPoint.yzx * stepDistance) / stepDistance;
    }

      // Rotate the xy plane using z-depth
    float rotationAngle = rayDepth * 0.8;
    mat2 rotationMatrix = mat2(cos(rotationAngle), -sin(rotationAngle), sin(rotationAngle), cos(rotationAngle));
    currentPoint.xy *= rotationMatrix;

      // Distance estimate to a volumetric structure along x-axis
    signedDistance = 3.0 - abs(currentPoint.x);

      // Adaptive step size: slower when closer to fog volume
    stepDistance = 0.09 + 0.1 * max(signedDistance, -signedDistance * 0.2);
    rayDepth += stepDistance;
  }

    // Simple tonemapping to compress HDR values into viewable range
  accumulatedColor = tanh(accumulatedColor * accumulatedColor / 5000.0);

  gl_FragColor = accumulatedColor;
}
