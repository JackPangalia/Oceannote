'use client'

import { useState } from 'react';

const Inspector = () => {
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);

  const handleMouseDown = (e) => {
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (startPos) {
      setCurrentPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setStartPos(null);
    setCurrentPos(null);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="absolute w-full h-screen bg-transparent"
    >
      {startPos && currentPos && (
        <div
          className="absolute bg-blue-300 opacity-50 border border-blue-500"
          style={{
            left: Math.min(startPos.x, currentPos.x),
            top: Math.min(startPos.y, currentPos.y),
            width: Math.abs(startPos.x - currentPos.x),
            height: Math.abs(startPos.y - currentPos.y),
          }}
        />
      )}
    </div>
  );
};

export default Inspector;
