uniform float iTime;
uniform vec3 iResolution;
uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;

varying vec2 vUv;

void main() {
  vec2 screenCoord = vUv * iResolution.xy;

  vec4 accumulatedColor = vec4(0.0);
  float time = iTime;
  float stepIndex = 0.0;
  float rayDepth = 0.0;
  float stepSize;

  for(accumulatedColor *= stepIndex; stepIndex++ < 20.0;
        //Add color and glow attenuation
    accumulatedColor += (sin(rayDepth / 3.0 + vec4(7.0 , 2.0, 3, 0)) + 1.1) / stepSize) {

    vec3 rayPosition = rayDepth * normalize(vec3(screenCoord + screenCoord, 0.0) - iResolution.xyy);
    //Shift back and animate

    rayPosition.z += 5.0 + cos(time);

    //Twist and rotate
    rayPosition.xz *= mat2(cos(rayPosition.y * 0.01 + vec4(0, 33, 11, 0))) / max(rayPosition.y * 0.1 + 1.0, 0.1);

    //Turbulence loop (increase frequency)
    for(stepSize = 2.0; stepSize < 15.0; stepSize /= 0.6) {

        //Add a turbulence wave
      rayPosition += cos((rayPosition.yzx - vec3(time / 0.1, time, stepSize)) * stepSize) / stepSize;
    }

     //Sample approximate distance to hollow cone
    float distanceEstimate = abs(length(rayPosition.xz) + rayPosition.y * 0.3 - 0.5);
    rayDepth += stepSize = 0.01 + distanceEstimate / 7.0;
  }

  accumulatedColor = tanh(accumulatedColor / 500.0);

  gl_FragColor = accumulatedColor;
}
