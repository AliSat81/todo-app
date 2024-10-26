import React from 'react';

const useDragAndDrop = (initialItems) => {
  const [items, setItems] = React.useState(initialItems);
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (dropIndex) => {
    if (draggedIndex === null || dropIndex === null) return;

    // Avoid moving the item to its own position
    if (draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setHoveredIndex(null);
      return;
    }

    const updatedItems = [...items];
    const [draggedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(dropIndex, 0, draggedItem);

    setItems(updatedItems);
    setDraggedIndex(null);
    setHoveredIndex(null);
  };

  return {
    items,
    handleDragStart,
    handleDrop,
    setHoveredIndex,
    draggedIndex,
    hoveredIndex,
  };
};

export default useDragAndDrop;
