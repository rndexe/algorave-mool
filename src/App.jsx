import { Canvas } from '@react-three/fiber';
import { Stats, StatsGl } from '@react-three/drei';
import { useMicAudio } from './store';
import { AudioDisplay } from './components/AudioDisplay';
import ShaderPlane from './components/ShaderPlane'
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
