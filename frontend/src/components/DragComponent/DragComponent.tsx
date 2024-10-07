import React, { useState } from 'react';

const DragAndDrop: React.FC = () => {
  const [dragging, setDragging] = useState<boolean>(false);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    // Perform actions with dropped data
    const data = event.dataTransfer.getData('text/plain');
    console.log('Dropped data:', data);
  };

  return (
    <div
      className={`drop-zone ${dragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="draggable bg-[red]"
        draggable
        // onDragStart={handleDragStart}
      >
        Drag me
      </div>
      <p className='w-[300px] h-[300px] bg-[blue]'>Drop zone</p>
    </div>
  );
};

export default DragAndDrop;
