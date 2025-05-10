// BottomDisplay.jsx
import React, { useEffect } from 'react';
import { useAudioStore } from './store';

export const AudioDisplay = () => {
    const { lo, lomid, mid, himid, hi } = useAudioStore();

    useEffect(() => {
        const interval = requestAnimationFrame(function update() {
            // updateValues();
            requestAnimationFrame(update);
        });
        return () => cancelAnimationFrame(interval);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                background: 'rgba(0,0,0,1)',
                color: 'white',
                padding: '10px',
                fontFamily: 'monospace',
                display: 'flex',
                justifyContent: 'space-around',
            }}
        >
            <span>lo: {lo.toFixed(2)}</span>
            <span>lomid: {lomid.toFixed(2)}</span>
            <span>mid: {mid.toFixed(2)}</span>
            <span>himid: {himid.toFixed(2)}</span>
            <span>hi: {hi.toFixed(2)}</span>
        </div>
    );
};
