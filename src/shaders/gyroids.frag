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
    vec2 res = iResolution;
    vec2 FC = gl_FragCoord.xy;
    //Ray direction
    vec3 d = normalize(vec3(FC,0)-res.xyy*.5);
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
