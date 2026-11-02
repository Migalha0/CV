// Original by localthunk (https://www.playbalatro.com)
// Ported from Shadertoy to GLSL ES 1.00 (WebGL 1)

import { paintGLSL } from "./paint";

export const balatroFragment = `
// mediump is 16-bit on mobile GPUs, which flattens the swirl to solid blue
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float iTime;
uniform vec2 iResolution;

//random angle
uniform float iRotation;

// Configuration (modify these values to change the effect)
#define SPIN_ROTATION -2.0
#define SPIN_SPEED 7.0
#define OFFSET vec2(0.0)
#define PIXEL_FILTER 800.0
#define SPIN_EASE 1.0
#define PI 3.14159265359
#define IS_ROTATE false

${paintGLSL}

vec4 effect(vec2 screenSize, vec2 screen_coords) {
    float pixel_size = length(screenSize.xy) / PIXEL_FILTER;
    vec2 uv = (floor(screen_coords.xy*(1./pixel_size))*pixel_size - 0.5*screenSize.xy)/length(screenSize.xy) - OFFSET;
    float uv_len = length(uv);

    float speed = (SPIN_ROTATION*SPIN_EASE*0.2);
    if(IS_ROTATE){
       speed = iTime * speed;
    }
    speed += 302.2;
    float new_pixel_angle = atan(uv.y, uv.x) + speed + iRotation - SPIN_EASE*20.*(1.*SPIN_AMOUNT*uv_len + (1. - 1.*SPIN_AMOUNT));
    vec2 mid = (screenSize.xy/length(screenSize.xy))/2.;
    uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

    uv *= 30.;
    return paint(uv, iTime*SPIN_SPEED);
}

void main() {
    gl_FragColor = effect(iResolution, gl_FragCoord.xy);
}
`;
