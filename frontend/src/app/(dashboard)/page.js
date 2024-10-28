"use client"
import * as React from 'react';
import Typography from '@mui/material/Typography';
import ToDoCard from '@/components/Card';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import useDragAndDrop from '@/hooks/useDragAndDrop';
import { Add } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';
import { STATUSES } from '@/lib/constant';
import { statusFormatter } from '@/lib/helper';

const styles = {
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: { xs: 3, md: 0 },
    // maxWidth: ,
  },
  title: {
    fontWeight: "600",
  },
  draggableItem: (isDragging, isHovered) => ({
    transition: 'margin 0.2s ease, background-color 0.2s ease',
    margin: isDragging || isHovered ? '30px 0px' : '0',
    backgroundColor: isHovered ? '#e0f7fa' : 'transparent',
    border: isHovered ? '1px dashed #1976d2' : 'none',
    willChange: 'margin, background-color',
    touchAction: "none",
    cursor: 'grab'
  })
};

const DraggableCard = React.memo(({ 
  row, 
  index, 
  isDragging, 
  isHovered, 
  isLoading,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onDrop,
  columnStatus,
  mainColumn,
}) => (
  <div
    key={row.id || index}
    draggable
    onDragStart={() => onDragStart(index, columnStatus)}
    onDragOver={(e) => e.preventDefault()}
    onDragEnter={() => {
      if(row.status !== mainColumn) return;
      onDragEnter(index)
    }}
    onDragEnd={() => onDragEnd()}
    onDrop={(e) => {
      e.preventDefault();
      onDrop(index);
    }}
    style={styles.draggableItem(isDragging, isHovered)}
  >
    <ToDoCard 
      data={row} 
      isDragging={isDragging}
      isLoading={isLoading}
    />
  </div>
));

DraggableCard.displayName = 'DraggableCard';

const Column = React.memo(({ title, tasks, isLoading = false }) => {
  const {
    items,
    handleDragStart,
    handleDrop,
    setHoveredIndex,
    draggedIndex,
    hoveredIndex,
    mainColumn,
  } = useDragAndDrop(tasks, statusFormatter(title));
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Box sx={styles.columnHeader}>
          <Typography 
            variant="h6" 
            gutterBottom 
            align="center" 
            sx={styles.title}
          >
            {title}
          </Typography>
          <Tooltip title="Add Item">
            <Link href={{ pathname: '/task', query: { status: title } }}>
              <IconButton>
                <Add />
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
        <Grid container justifyContent="center">
          <Grid item>
            {items?.map((row, index) => (
              <DraggableCard
                key={row.id || index}
                row={row}
                index={index}
                isDragging={index === draggedIndex}
                isHovered={index === hoveredIndex}
                isLoading={isLoading}
                onDragStart={handleDragStart}
                onDragEnter={setHoveredIndex}
                onDragEnd={() => setHoveredIndex(null)}
                onDrop={handleDrop}
                columnStatus={title}
                mainColumn={mainColumn}
              />
            ))}
          </Grid>
        </Grid>
    </Grid>
  );
});

Column.displayName = 'Column';

const Page = () => {
  const { data, loading, error } = useSelector((state) => state.todo);
  const isLoading = loading?.fetchTodos;

  return (
    <Grid container spacing={{ xs: 5, md: 5 }} justifyContent="center">
      {STATUSES.map((title, index) => (
        <Column 
          key={`${title}-${index}`} 
          title={title} 
          tasks={isLoading ? Array(3).fill({}) : data[statusFormatter(title)]}
          isLoading={isLoading}
        />
      ))}
    </Grid>
  );
};

export default Page;