import * as THREE from "three";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial, Plane } from "@react-three/drei";
import { useRef } from "react";
import { useAudioStore } from "./store"; // ← your Zustand store

// Shader definition
const FireShaderMaterial = shaderMaterial(
    {
        iTime: 0,
        iResolution: new THREE.Vector3(),
        uLo: 0,
        uMid: 0,
        uHigh: 0,
    },
    `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
  `,
    `
  uniform float iTime;
  uniform vec3 iResolution;
  uniform float uLo;
  uniform float uMid;
  uniform float uHigh;

  varying vec2 vUv;

  void main() {
    vec2 screenCoord = vUv * iResolution.xy;

    vec4 accumulatedColor = vec4(0.0);
    float time = iTime;
    float stepIndex = 0.0;
    float rayDepth = 0.0;
    float stepSize;

    for (accumulatedColor *= stepIndex; stepIndex++ < 20.0;
        //Add color and glow attenuation
         accumulatedColor += ((rayDepth / 3.0 + vec4(7, 2, 3, 0)) + 1.1) / stepSize) {

      vec3 rayPosition = rayDepth * normalize(vec3(screenCoord + screenCoord, 0.0) - iResolution.xyy);
    //Shift back and animate

      rayPosition.z += 5.0 + cos(time);

    //Twist and rotate
      rayPosition.xz *= mat2(cos(rayPosition.y * 0.5 + vec4(0, 33, 11, 0)))
                        / max(rayPosition.y * 0.1 + 1.0, 0.1);

    //Turbulence loop (increase frequency)
      for (stepSize = 2.0; stepSize < 15.0; stepSize /= 0.6) {

        //Add a turbulence wave
        rayPosition += cos((rayPosition.yzx - vec3(time / 0.1, time, stepSize)) * stepSize) / stepSize;
      }

     //Sample approximate distance to hollow cone
      float distanceEstimate = abs(length(rayPosition.xz) + rayPosition.y * 0.3 - 0.5);
      rayDepth += stepSize = 0.01 + distanceEstimate / 7.0;
    }

    accumulatedColor = tanh(accumulatedColor / 1000.0);
    // accumulatedColor.rgb *= vec3(0.8 + uLo * 0.3, 0.9 + uMid * 0.3, 1.0 + uHigh * 0.3);

    gl_FragColor = accumulatedColor;
  }
  `
);

extend({ FireShaderMaterial });

export default function FireEffect() {
    const shaderRef = useRef();
    const { size } = useThree();

    // 🔊 Zustand audio band values
    const uLo = useAudioStore((s) => s.uLo);
    const uMid = useAudioStore((s) => s.uMid);
    const uHigh = useAudioStore((s) => s.uHigh);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (shaderRef.current) {
            shaderRef.current.iTime = t;
            shaderRef.current.iResolution.set(size.width, size.height, 1);

            shaderRef.current.uLo = uLo;
            shaderRef.current.uMid = uMid;
            shaderRef.current.uHigh = uHigh;
        }
    });

    return (
        <Plane args={[2, 2]}>
            {/* key is optional, useful if you're conditionally remounting */}
            <fireShaderMaterial key={FireShaderMaterial.key} ref={shaderRef} />
        </Plane>
    );
}
