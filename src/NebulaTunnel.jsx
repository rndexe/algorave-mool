import React, { useRef } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial, Plane } from "@react-three/drei";
import { useAudioStore } from "./store";
import * as THREE from "three";

// Shader material with uniforms
const NebulaTunnelMaterial = shaderMaterial(
  {
    iTime: 0,
    iResolution: new THREE.Vector3(),
    uLow: 0,
    uMid: 0,
    uHigh: 0,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform float iTime;
  uniform vec3 iResolution;
  varying vec2 vUv;

  void main() {
    vec2 screenCoords = vUv * iResolution.xy;
    vec4 accumulatedColor = vec4(0.0);

    float time = iTime;
    float iteration = 0.0;
    float rayDepth = 0.0;
    float stepSize;

    for (accumulatedColor *= iteration; iteration++ < 15.0;) {
        vec3 rayPosition = rayDepth * normalize(vec3(screenCoords + screenCoords, 0.0) - iResolution.xxy);
        rayPosition.y = length(cos(rayPosition * 0.2 + rayDepth * 0.2)) * 4.0 - abs(rayPosition.y);

        for (stepSize = 1.4; stepSize < 100.0; stepSize /= 0.5) {
            rayPosition += cos(
                rayPosition.yzx * stepSize - vec3(3.0, stepSize * time, time / 3.0)
            ) / stepSize;
        }

        float signedY = max(rayPosition.y, -rayPosition.y * 0.3);
        stepSize = 0.01 + 0.1 * signedY;
        rayDepth += stepSize;

        accumulatedColor += (sin(vec4(1.0, 10.0, 10.0, 0.0) - rayPosition.y * 1.0) + 1.01)  / rayDepth / stepSize;
    }

    accumulatedColor = tanh(accumulatedColor / 50.0);
    gl_FragColor = accumulatedColor;
  }
  `
);

extend({ NebulaTunnelMaterial });

export function NebulaTunnelPlane() {
    const materialRef = useRef();
    const { size } = useThree();
    // ⬇️ Get audio bands from Zustand store
    const low = useAudioStore((s) => s.low);
    const mid = useAudioStore((s) => s.mid);
    const high = useAudioStore((s) => s.high);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.iTime = clock.getElapsedTime();
            materialRef.current.iResolution.set(size.width, size.height, 1);
            materialRef.current.uLow = low;
            materialRef.current.uMid = mid;
            materialRef.current.uHigh = high;
        }
    });

    return (
        <Plane args={[2, 2]}>
            <nebulaTunnelMaterial ref={materialRef} key={NebulaTunnelMaterial.key}/>
        </Plane>
    );
}