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
    // vec2 pixelCoord = (gl_FragCoord.xy + gl_FragCoord.xy - resolution) / resolution.y;
    vec2 I = gl_FragCoord.xy;
    vec2 p = (I + I - a) / a.y;
    for(; i++ < 20.; accumulatedColor += (cos(sin(i * .2 + t) * vec4(0, 4, 3, 1)) + 2.) / (i / 1e3 + abs(length(a - .5 * min(a + a.yx, .1)) - .05))) a.x = abs(a = fract(.2 * t + .3 * p * i * mat2(cos(cos(.2 * (t + i)) + vec4(0, 11, 33, 0)))) - .5).x;

    // Final tonemapping using hyperbolic tangent of squared color
    accumulatedColor = tanh(accumulatedColor * accumulatedColor / 200000.0);

    gl_FragColor = accumulatedColor;
}
