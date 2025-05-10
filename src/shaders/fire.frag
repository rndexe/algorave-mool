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
  float t = iTime;
  float stepI = 0.0;
  float rayDepth = 0.0;
  float ss;

  for(a_col *= stepI; stepI++ < 10.0;
    //Add color and glow attenuation
    a_col += (
               sin(rayDepth / 3.0 +
                   vec4(2.0 ,2.0, 2.0, 0)) + 1.1
             ) / ss) {

    vec3 rayPos = rayDepth *
                       normalize(
                                  vec3(SC + SC, 0.0) - 
                                  res.xyy
                                );
    //Shift back and animate
    rayPos.z += 5.0 + cos(t);

    //Twist and rotate
    rayPos.xz *= 
      mat2(
            cos(rayPos.y * 0.01 + vec4(0,33,11,0))) / 
            max(rayPos.y * 0.1 + 1.0, 0.1
          );

    //Turbulence loop (increase frequency)
    for(ss = 2.0; ss < 15.0; ss /= 0.6) {

      //Add a turbulence wave
      rayPos += 
      cos((rayPos.yzx - vec3(t / 0.1, t, ss)) * ss)
      / ss;
    }

     //Sample approximate distance to hollow cone
    float distanceEstimate = 
      abs(length(rayPos.xz) + rayPos.y * 0.3 - 0.5);
    rayDepth += ss = 0.01 + distanceEstimate / 7.0;
  }

  a_col = tanh(a_col / 200.0);

  gl_FragColor = a_col;
}
