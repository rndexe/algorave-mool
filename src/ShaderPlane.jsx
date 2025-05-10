import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { Plane, shaderMaterial } from '@react-three/drei';
import { useRef } from 'react';
import { useAudioStore } from './store';

import vertexShader from './shaders/vertex.vert';

// import fragmentShader from '../shaders/radial.frag';
// import fragmentShader from '../shaders/stars.frag';
// import fragmentShader from '../shaders/turb.frag';
// import fragmentShader from '../shaders/gyroids.frag';
// import fragmentShader from '../shaders/nebula.frag';
// import fragmentShader from '../shaders/hearts.frag';
// import fragmentShader from '../shaders/fire.frag';
// import fragmentShader from '../shaders/cubic.frag';
// import fragmentShader from '../shaders/nebula2.frag';
import fragmentShader from './shaders/sunset.frag';

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
    <Plane args={[2, 2]}>
      <myMaterial key={MyMaterial.key} ref={shaderRef} />
    </Plane>
  );
}
