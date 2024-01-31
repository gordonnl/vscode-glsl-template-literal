VSCode extension that adds glsl syntax highlighting for template literals using `/* glsl */` comment tag.

Forked from [vscode-comment-tagged-templates](https://github.com/mjbvz/vscode-comment-tagged-templates) and edited for personal use.

Requires GLSL language extension (such as [WebGL GLSL Editor](https://marketplace.visualstudio.com/items?itemName=raczzalan.webgl-glsl-editor)) to be installed.

```glsl
const fragment = /* glsl */ `
    precision highp float;

    varying vec2 vUv;

    void main() {
        gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
`;
```
