import { Canvas } from '@react-three/fiber';
import { BandSphere } from './BandSphere';
import SunsetPlane from './Sunset';
import { OrbitControls, Stats } from '@react-three/drei';
import { NebulaPlane } from './Nebula';
import { NebulaTunnelPlane } from './NebulaTunnel';
import FireEffect from './Fire';
import { useMicAudio } from './store';
import { AudioDisplay } from './AudioDisplay';

export default function App() {
    useMicAudio();

    return (
        <>
            <Canvas>
                <Stats />
                {/* <SunsetPlane/> */}
                {/* <NebulaPlane/> */}
                {/* <NebulaTunnelPlane/> */}
                <FireEffect />
            </Canvas>
            <AudioDisplay />
        </>
    );
}
