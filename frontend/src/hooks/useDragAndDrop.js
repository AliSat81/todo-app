import React from 'react';
import { useDispatch } from 'react-redux';
import { swapTask } from '@/app/store/slices/todoSlice';

const useDragAndDrop = (items, status) => {
  const dispatch = useDispatch();
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const [mainColumn, setMainColumn] = React.useState(null);

  const handleDragStart = (index, columnStatus) => {
    setDraggedIndex(index);
    setMainColumn(columnStatus)
  };

  const handleDrop = (dropIndex) => {

    if (draggedIndex === null || dropIndex === null) {
      setDraggedIndex(null);
      return;
    }

    // Avoid moving the item to its own position
    if (draggedIndex === dropIndex) {
      setDraggedIndex(null);
      // setHoveredIndex(null);
      return;
    }


    const draggedTaskId = items[draggedIndex].id;
    const dropTaskId = items[dropIndex].id;

    dispatch(swapTask({
      ids: [draggedTaskId, dropTaskId],
      status: status
    }));

    setDraggedIndex(null);
    // setHoveredIndex(null);
  };

  const getReorderedItems = () => {
    if (draggedIndex === null || hoveredIndex === null) return items;
    
    const reorderedItems = [...items];
    const [draggedItem] = reorderedItems.splice(draggedIndex, 1);
    reorderedItems.splice(hoveredIndex, 0, draggedItem);
    return reorderedItems;
  };

  return {
    items: getReorderedItems(),
    handleDragStart,
    handleDrop,
    setHoveredIndex,
    draggedIndex,
    hoveredIndex,
    setMainColumn,
    mainColumn
  };
};

export default useDragAndDrop;