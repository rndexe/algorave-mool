/*
    "Irregular Gyroids" by @XorDev

    Here's a neat little formula I've found for creating aperiodic patterns
    that almost look like Simplex noise for a tiny fraction of the cost.
*/

uniform float lo;
uniform float lomid;
uniform float mid;
uniform float himid;
uniform float hi;
uniform float iTime;
uniform vec2 iResolution;

float map(vec3 p)
{
    //Scaling factor (the less rational is generally better)
    float S = exp(cos((floor(iTime / 10.0))));//1.618;
    // float S = 1.618;// + cos(iTime/100.0);
    //Gyroid with cos scaled separately
    float d = dot(sin(p), cos(p.yzx*S)) + p.y;
    //Correct for scaling factor
    return d*inversesqrt(1.+S*S);
}

void main()
{
    //Ray direction
    vec3 d = normalize(vec3(gl_FragCoord.xy,0)-iResolution.xyy*.5);
    //Rotate pitch down
    d.yz *= mat2(.8,.6,-.6,.8);
    
    //Camera moving forward
    vec3 p = vec3(9,5,-iTime);
    
    //Raymarch loop with 100 iterations
    for(float i = 0.0; i<100.0; i++)
        //Step forward
        p += d*map(p);
    
    //Highlight edges using derivatives
    float e = length(fwidth(p))*iResolution.y;
    //Color and tonemap with tanh
    gl_FragColor = 1.0 - tanh(e/vec4(20,20,20,1));
}