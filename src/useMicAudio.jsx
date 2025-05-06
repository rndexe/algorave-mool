import { useEffect } from 'react';
import { initMicAudio } from './store';

export default function useMicAudio() {
  useEffect(() => {
    initMicAudio();
  }, []);
}