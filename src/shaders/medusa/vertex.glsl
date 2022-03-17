varying vec2 vUv;
uniform float uTime;
uniform float uWidth;
uniform float uIteration;
#define PI 3.14159265359


void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 pos = position.xyz;

    modelPosition.xz *= uWidth - (1.9 * smoothstep(0.0, -0.8, modelPosition.y) * 2.0 ) * uWidth * 0.3;
    modelPosition.y += 1.0 + cos(pos.y + (uTime + 0.3) * 5.2 * PI * 0.2) * 0.5;

    float bumps = 0.0;
    pos *= 1.0 + bumps;
    pos.xz *= 1.0 -smoothstep(0.2, 0.1, position.y) * 0.35;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}