import { Canvas } from '@react-three/fiber';
import { Stats, StatsGl } from '@react-three/drei';
import { useMicAudio } from './store';
import { AudioDisplay } from './AudioDisplay';
import ShaderPlane from './ShaderPlane'
import { Perf } from 'r3f-perf';

export default function App() {
    useMicAudio();
    return (
        <>
            <Canvas>
                <Stats />
                <Perf />
                <ShaderPlane />
            </Canvas>
            <AudioDisplay />
        </>
    );
}
