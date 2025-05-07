import { create } from 'zustand';
import { useEffect } from 'react';
import { addEffect } from '@react-three/fiber';

export const useAudioStore = create()((set) => ({
    lo: 0,
    lomid: 0,
    mid: 0,
    himid: 0,
    hi: 0,
    setBandLevels: (levels) => set(levels),
}));

// 🧠 Mic input and R3F render-sync
let started = false;

export async function initMicAudio() {
    if (started) return; // prevent re-initializing
    started = true;

    const stream = await getAudioStreamByDeviceName(
        'OnePlus Bullets Wireless Z2'
    );
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.9;
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const nyquist = audioCtx.sampleRate / 2;
    const binSize = nyquist / data.length;

    const getAvg = (fromHz, toHz) => {
        const from = Math.floor(fromHz / binSize);
        const to = Math.floor(toHz / binSize);
        let sum = 0;
        for (let i = from; i <= to; i++) sum += data[i];
        return sum / (to - from + 1) / 255;
    };

    // 💡 Update state every render frame
    addEffect(() => {
        analyser.getByteFrequencyData(data);
        // console.log(data)
        useAudioStore.getState().setBandLevels({
            lo: getAvg(20, 250),
            lomid: getAvg(250, 500),
            mid: getAvg(500, 2000),
            himid: getAvg(2000, 6000),
            hi: getAvg(6000, 20000),
        });
    });
}

export function useMicAudio() {
  useEffect(() => {
    initMicAudio();
  }, []);
}

async function getAudioStreamByDeviceName(deviceName) {
    // Step 1: Request mic permission (once)
    await navigator.mediaDevices.getUserMedia({ audio: true });

    // Step 2: Enumerate devices
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = devices.filter((d) => d.kind === 'audioinput');

    // Step 3: Find matching device by label
    const selected = audioInputs.find((d) => d.label.includes(deviceName));
    if (!selected) {
        throw new Error(
            `Audio device with name containing "${deviceName}" not found.`
        );
    }

    // Step 4: Use deviceId to get stream
    return navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selected.deviceId },
    });
}
