import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { Plane, shaderMaterial } from '@react-three/drei';
import { useRef } from 'react';
import { useAudioStore } from '../store';

import vertexShader from '../shaders/vertex.glsl';
// import fragmentShader from '../shaders/turb.glsl';
// import fragmentShader from '../shaders/cubic.glsl';
// import fragmentShader from '../shaders/fire.glsl';
import fragmentShader from '../shaders/hearts.glsl';
// import fragmentShader from '../shaders/nebula.glsl';
// import fragmentShader from '../shaders/nebula2.glsl';
// import fragmentShader from '../shaders/sunset.glsl';

const MyMaterial = shaderMaterial(
    {
        iTime: 0,
        iResolution: new THREE.Vector3(),
        lo: 0,
        lomid: 0,
        mid: 0,
        himid: 0,
        hi: 0,
    },
    vertexShader,
    fragmentShader
);

extend({ MyMaterial });

export default function ShaderPlane() {
    const shaderRef = useRef();
    const { size } = useThree();

    // 🔊 Zustand audio band values
    const { lo, lomid, mid, himid, hi } = useAudioStore();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (shaderRef.current) {
            shaderRef.current.iTime = t;
            shaderRef.current.iResolution.set(size.width, size.height, 1);

            shaderRef.current.lo = lo;
            shaderRef.current.lomid = lomid;
            shaderRef.current.mid = mid;
            shaderRef.current.himid = himid;
            shaderRef.current.hi = hi;
        }
    });

    return (
        <Plane args={[1.5, 1.5]}>
            {/* key is optional, useful if you're conditionally remounting */}
            <myMaterial key={MyMaterial.key} ref={shaderRef} />
        </Plane>
    );
}
