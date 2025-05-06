import { Canvas } from '@react-three/fiber';
import { BandSphere } from './BandSphere';
import SunsetPlane from './SunsetShader'
import useMicAudio from './useMicAudio';
import { OrbitControls, Stats } from '@react-three/drei';

export default function App() {
  useMicAudio();

  return (
    <Canvas>
      <Stats/>
      <ambientLight />
      <BandSphere band="low" x={-4} />
      <BandSphere band="loMid" x={-2} />
      <BandSphere band="mid" x={0} />
      <BandSphere band="hiMid" x={2} />
      <BandSphere band="high" x={4} />
      <SunsetPlane/>
      <OrbitControls/>
    </Canvas>
  );
}

