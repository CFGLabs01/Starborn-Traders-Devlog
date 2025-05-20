export const vertexShader = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float opacity;
uniform float radius;

varying vec3 vWorldPosition;

void main() {
  float normalizedY = (vWorldPosition.y + radius) / (2.0 * radius); // Normalize Y to 0-1 range
  normalizedY = clamp(normalizedY, 0.0, 1.0);
  vec3 color = mix(bottomColor, topColor, normalizedY);
  gl_FragColor = vec4(color, opacity);
}
`; 