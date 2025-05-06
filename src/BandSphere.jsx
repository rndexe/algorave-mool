import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useAudioStore } from './store';

export function BandSphere({ band, x }) {
  const ref = useRef(null);

  useFrame(() => {
    const val = useAudioStore.getState()[band];
    // console.log(val)
    ref.current.scale.setScalar(1 + val);
  });

  return (
    <mesh ref={ref} position={[x, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}
