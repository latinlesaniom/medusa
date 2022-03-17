varying vec2 VuV;

uniform sampler2D uTexture;
uniform vec3 uColorStart;

void main() {
    float distancetoCenter = distance(gl_PointCoord, vec2(0.5));
    float strenght = 0.05 / distancetoCenter - 1.0;

    vec3 color = uColorStart * strenght;

    gl_FragColor = vec4(color, 1.0);
}