import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import { useMicAudio } from './store';
import { AudioDisplay } from './components/AudioDisplay';
import ShaderPlane from './components/ShaderPlane'

export default function App() {
    useMicAudio();

    

    return (
        <>
            <Canvas>
                <Stats />
                <ShaderPlane />
            </Canvas>
            <AudioDisplay />
        </>
    );
}
