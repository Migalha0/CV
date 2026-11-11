// The swirling paint of the balatro shader (original by localthunk,
// https://www.playbalatro.com): a warp loop and a three-colour palette,
// recoloured to the site's yellow, grey and ink.
// Shared so every shader on the page paints with the same look, and differs
// only in how it moves the paint around

export const paintGLSL = `
#define COLOUR_1 vec4(1., 1., 0., 1.0)
#define COLOUR_2 vec4(0.122, 0.129, 0.149, 1.0)
#define COLOUR_3 vec4(0.078, 0.082, 0.094, 1.0)
#define CONTRAST 3.5
#define LIGTHING 0.4
#define SPIN_AMOUNT 0.25

// uv in paint units (one unit is about a 30th of the card's diagonal);
// speed drives the warp, so the paint churns in place as it grows
vec4 paint(vec2 uv, float speed) {
    vec2 uv2 = vec2(uv.x+uv.y);

    for(int i=0; i < 5; i++) {
        uv2 += sin(max(uv.x, uv.y)) + uv;
        uv  += 0.5*vec2(cos(5.1123314 + 0.353*uv2.y + speed*0.131121),sin(uv2.x - 0.113*speed));
        uv  -= 1.0*cos(uv.x + uv.y) - 1.0*sin(uv.x*0.711 - uv.y);
    }

    float contrast_mod = (0.25*CONTRAST + 0.5*SPIN_AMOUNT + 1.2);
    float paint_res = min(2., max(0.,length(uv)*(0.035)*contrast_mod));
    float c1p = max(0.,1. - contrast_mod*abs(1.-paint_res));
    float c2p = max(0.,1. - contrast_mod*abs(paint_res));
    float c3p = 1. - min(1., c1p + c2p);
    float light = (LIGTHING - 0.2)*max(c1p*5. - 4., 0.) + LIGTHING*max(c2p*5. - 4., 0.);
    return (0.3/CONTRAST)*COLOUR_1 + (1. - 0.3/CONTRAST)*(COLOUR_1*c1p + COLOUR_2*c2p + vec4(c3p*COLOUR_3.rgb, c3p*COLOUR_1.a)) + light;
}
`;

// COLOUR_1..3 as a CSS gradient, shown where WebGL isn't available
export const PAINT_FALLBACK =
  "conic-gradient(from 45deg, #ffff00, #1f2126, #141518, #1f2126, #ffff00)";
