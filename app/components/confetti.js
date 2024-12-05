import React, { useRef, forwardRef, useImperativeHandle } from "react";
import confetti from 'canvas-confetti';

const Confetti = forwardRef((props, ref) => {
    const triggerConfetti = () => {
        confetti({
            particleCount: 1000,
            angle: 90,
            spread: 250,
            origin: { x: 0.5, y: 1 },
        });

        if (props.onSuccess) {
            props.onSuccess(true);
        }
    };

    useImperativeHandle(ref, () => ({
        triggerConfettiFromParent: triggerConfetti
    }));

    // return (
    //     <button onClick={triggerConfetti} className="py-2 px-4 bg-blue-500 text-white rounded">
    //         Celebrate!
    //     </button>
    // );
});

Confetti.displayName = 'Confetti';
export default Confetti;
