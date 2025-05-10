uniform float iTime;
uniform vec3 iResolution;
varying vec2 vUv;

void main() {
  vec2 SC = vUv * iResolution.xy;
  vec2 res = iResolution.xy;
  vec4 a_col = vec4(0.0);

  float t = iTime;
  float i = 0.0;
  float rayDepth = 0.0;
  float ss;

  for(a_col *= i; i++ < 15.0;) {
    vec3 rayPos = rayDepth * normalize(vec3(SC + SC, 0.0) - res.xxy);
    rayPos.y = length(
                      cos(
                        rayPos * 0.2 + rayDepth * 0.2
                        )
                    ) * 4.0 - abs(rayPos.y);

    for(ss = 1.4; ss < 100.0; ss /= 0.5) {
      rayPos += 
        cos(
            rayPos.yzx * ss -
            vec3(3.0, ss * t, t / 3.0)
          ) / ss;
    }

    float signedY = max(rayPos.y, -rayPos.y * 0.3);
    ss = 0.01 + 0.1 * signedY;
    rayDepth += ss;

    a_col += (sin(
                   vec4(1.0, 1.0, 1.0, 0.0) -
                  rayPos.y * 1.0
                ) + 0.5);
  }

  a_col = 1.0 - tanh(a_col / 5.);
  gl_FragColor = a_col;
}
