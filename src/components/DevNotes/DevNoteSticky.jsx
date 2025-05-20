import React, { useState, useRef } from 'react';

const DevNoteSticky = () => {
  const [text, setText] = useState('Dev Note: Initial thoughts...');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const noteRef = useRef(null);

  const handleMouseDown = (e) => {
    // Prevent drag from starting if clicking on textarea
    if (e.target.tagName.toLowerCase() === 'textarea') {
        return;
    }
    setIsDragging(true);
    const noteRect = noteRef.current.getBoundingClientRect();
    // Calculate offset from top-left of the note to the mouse click
    dragStartPos.current = {
      x: e.clientX - noteRect.left,
      y: e.clientY - noteRect.top,
    };
    // Prevent text selection while dragging
    e.preventDefault(); 
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      // Calculate new position based on mouse movement and initial offset
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add mouse move and mouse up listeners to the window to handle dragging outside the note
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={noteRef}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 1000, // Ensure it's on top
      }}
      className="bg-yellow-200/70 backdrop-blur-sm p-3 rounded-lg shadow-xl w-64 h-48 text-sm text-yellow-900 flex flex-col"
      onMouseDown={handleMouseDown}
    >
      <h4 className="font-semibold mb-1 text-yellow-800 cursor-move select-none">Dev Sticky Note</h4>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow bg-transparent border border-yellow-400/50 rounded p-1.5 text-xs focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
        placeholder="Jot down notes here..."
      />
    </div>
  );
};

export default DevNoteSticky; 