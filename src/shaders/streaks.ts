// The cards' paint, streamed to the right instead of spun, in yellow alone:
// the paint's yellow is drawn and everything else is left see-through, so the
// row behind supplies the second colour in either theme. It's held solid
// under a title on the left, then squashed into long streaks carried away to
// the right, breaking into ragged fingers that fade out

import { paintGLSL } from "./paint";

export const streaksFragment = `
// mediump is 16-bit on mobile GPUs, which flattens the swirl to solid blue
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float iTime;
uniform vec2 iResolution;
// Device pixels per paint unit, so the paint is the same size as on the cards
uniform float iUnit;
// Device pixels from the left edge that sit under the title, kept solid
uniform float iSolid;
// Random offset, so each strip paints its own pattern
uniform float iSeed;

// Paint units per second the paint travels to the right
#define FLOW 1.5
// Below 1 squashes the paint sideways, drawing each swirl out into a streak
#define STRETCH 0.18
// Above 1 packs more streaks into the strip's height
#define BANDING 2.2
// How fast the paint churns as it goes. Well below the cards' SPIN_SPEED,
// or the churning swamps the travel and the strip boils instead of flowing
#define CHURN 0.8
// How far the paint scrolls (in squashed units) before it mirrors back. The
// paint is coloured by distance from its centre, so it has to stay near it
#define SPAN 14.0
// Least yellow under the title, so dark text on it stays readable
#define SOLID_FLOOR 0.85

${paintGLSL}

// Hash without sin, which loses precision on big inputs and starts repeating
// (Dave Hoskins, https://www.shadertoy.com/view/4djSRW)
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx)*0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y)*p3.z);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f*f*(3. - 2.*f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x),
               mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y);
}

// Folds x back and forth across [-SPAN, SPAN]; the paint moves the same way
// on both sides of a fold, so it keeps flowing in one direction
float fold(float x) {
    return SPAN - abs(mod(x + SPAN, 4.*SPAN) - 2.*SPAN);
}

void main() {
    vec2 q = gl_FragCoord.xy / iUnit;
    float travelled = q.x - iTime*FLOW;

    // The paint's warp is built from sines, so a straight slice through it
    // repeats. Slow noise carried with the flow bends the slice up and down
    // and nudges it along, so the streaks never line up the same way twice
    float bend = noise(vec2(travelled*0.05 + iSeed, 3.7)) - 0.5;
    float nudge = noise(vec2(travelled*0.09 - iSeed, q.y*1.3 + 9.1)) - 0.5;
    // Around y = -12 the paint is about half yellow wherever x scrolls to;
    // nearer its centre whole stretches go blue and dark, which show nothing
    vec2 uv = vec2(fold(travelled*STRETCH + iSeed) + nudge*3.,
                   q.y*BANDING - 12. + bend*6.);
    vec4 colour = paint(uv, iTime*CHURN);

    // How yellow the paint is here: full on its yellow, none on its blue
    // and dark, which become the row behind
    float yellow = clamp((colour.r - 0.1)/0.9, 0., 1.);

    // Paint units past the end of the title, and how much row is left there
    float past = (gl_FragCoord.x - iSolid)/iUnit;
    float rest = max((iResolution.x - iSolid)/iUnit, 1.);

    // Streak lengths: noise drawn out along x and carried with the paint, so
    // each finger reaches its own distance and the ends drift rightwards
    float ragged = noise(vec2(travelled*0.12 + iSeed, q.y*3.))*0.65
                 + noise(vec2(travelled*0.3 - iSeed, q.y*7.))*0.35;
    float heat = 1. - clamp(past/rest, 0., 1.);
    float alpha = smoothstep(0.42, 0.58, heat*1.15 + (ragged - 0.5)*0.9);

    // Under the title, and for a unit and a half after it, the paint only
    // shimmers between full and nearly full yellow
    float solid = smoothstep(1.5, 0., past);
    yellow = mix(yellow, mix(SOLID_FLOOR, 1., yellow), solid);

    float a = alpha*yellow;
    gl_FragColor = vec4(COLOUR_1.rgb*a, a);
}
`;
