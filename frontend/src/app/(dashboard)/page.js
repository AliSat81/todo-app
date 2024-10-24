"use client"
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Card from '../_components/Card';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import useDragAndDrop from '@/lib/hooks/useDragAndDrop';
import { Add } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import Link from 'next/link';

const Column = ({ title, tasks }) => {
  const {
    items,
    handleDragStart,
    handleDrop,
    setHoveredIndex,
    draggedIndex,
    hoveredIndex,
  } = useDragAndDrop(tasks);

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: { xs: 3, md: 0 },  }}>
        <Typography variant="h6" gutterBottom align="center" sx={{fontWeight: "600"}}>
          {title}
        </Typography>
        <Tooltip title="Add Item">
          <Link href={{ pathname: '/task', query: { status: title } }}>
            <IconButton>
              <Add/>
            </IconButton>
          </Link>
        </Tooltip>
      </Box>
      <Grid container justifyContent="center">
        <Grid item>
          {items?.map((row, index) => {
            const isDragging = index === draggedIndex;
            const isHovered = index === hoveredIndex;

            return (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setHoveredIndex(index)}
                onDragEnd={() => handleDrop(index)}
                onDrop={() => handleDrop(index)}
                // onMouseEnter={() => handleDragStart(index) }
                style={{ 
                  transition: 'margin 0.2s ease, background-color 0.2s ease',
                  margin: isDragging || isHovered ? '30px 0px' : '', 
                  backgroundColor: isHovered ? '#e0f7fa' : 'transparent',
                  border: isHovered ? '1px dashed #1976d2' : 'none',
                  willChange: 'margin, background-color',
                  touchAction: "none"
                }}
              >
                <Card data={row} isDragging={isDragging}/>
              </div>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default function Page(props) {
  const data = useSelector(state => state?.todos?.data);

  return (
    <div>
      <Grid container spacing={{ xs: 5, md: 5 }} justifyContent="center">
        <Column title="Done" tasks={data?.done || []} />
        <Column title="Doing" tasks={data?.doing || []} />
        <Column title="To Do" tasks={data?.todo || []} />
        <Column title="Extra" tasks={data?.extra || []} />
      </Grid>
    </div>
  );
}
