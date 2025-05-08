uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;
uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;

void main() {
    // Output color accumulator
    vec4 accumulatedColor = vec4(0.0);

    // Time variable
    float t = iTime;
    float i = 0.0;
    vec2 a = iResolution.xy;
    vec2 I = gl_FragCoord.xy;
    vec2 p = (I + I - a) / a.y;
    for(; i++ < 20.; 
    accumulatedColor += 
        (cos(sin(i * 0.2 + t) *
        
        // Color change
          vec4(0, 4, 3, 1)) + 2.) / 
        // Heart shape
          (i / 1e3 + abs(length(a - .5 * min(a + a.yx, .1)) - .05)))
    a.x = abs(a = fract(.2 * t + .3 * p * i *
        
        // Rotation speed
          mat2(cos(cos(.2 * (iTime + i)) +
        // Rotation Factor 
          vec4(0, 11, 33, 0)))) - .5).x;

    accumulatedColor = tanh(accumulatedColor * accumulatedColor / 200000.0);

    gl_FragColor = accumulatedColor;
}
