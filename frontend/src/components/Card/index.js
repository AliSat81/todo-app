"use client"
import * as React from 'react';
import { updateTaskStatus } from '@/app/store/slices/todoSlice';
import { Circle, CircleOutlined, Edit, Visibility } from '@mui/icons-material';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Chip, 
  IconButton, 
  Stack, 
  Typography, 
  Skeleton,
} from '@mui/material';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useCallback, useTransition, useState } from 'react';
import { isEqual } from 'lodash';

const PRIORITY_COLORS = {
  High: 'error',
  Medium: 'warning',
  Low: 'success'
};

const TRACK_COLORS = {
  'On Track': 'success',
  'Off Track': 'warning',
  'At Risk': 'error'
};

const styles = {
  card: (isDragging) => ({
    mt: 1,
    width: 275,
    borderColor: "gray",
    borderWidth: 2,
    // minHeight: 150,
    borderRadius: 2.5,
    boxShadow: isDragging ? 8 : 0,
    transition: 'box-shadow 0.2s ease',
    cursor: "grab",
  }),
  statusButton: {
    p: 0,
    m: 0,
    mr: 0.2
  },
  title: {
    fontWeight: 800,
    color: 'text.primary',
    maxWidth: 125,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  titleDone: {
    textDecoration: "line-through",
    textDecorationColor: 'gray'
  },
  description: {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    lineHeight: '1.5em',
    maxHeight: '4.5em',
    textOverflow: 'ellipsis',
    color: 'text.secondary',
    wordBreak: 'break-word',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: 800
  },
  cardContent: {
    pt: 0,
  },
  tagStack: {
    mt: 2
  },
  confirmDialog: {
    '& .MuiDialog-paper': {
      width: '100%',
      maxWidth: 400,
    }
  }
};

const StatusIcon = React.memo(({ status, size = 16 }) => (
  status === "Done" ? 
    <Circle sx={{ fontSize: size }}/> : 
    <CircleOutlined sx={{ fontSize: size }}/>
));
StatusIcon.displayName = 'StatusIcon';

const LoadingSkeleton = React.memo(() => (
  <Card variant="outlined" sx={styles.card(false)}>
    <CardHeader
      title={
        <Box display="flex" flexDirection="row">
          <Skeleton variant="text" width={180} />
        </Box>
      }
      subheader={<Skeleton variant="text" width={80} />}
    />
    <CardContent sx={styles.cardContent}>
      <Skeleton variant="rectangular" width="100%" height={60} />
      <Stack direction="row" spacing={1} sx={styles.tagStack}>
        <Skeleton variant="rectangular" width={60} height={24} />
        <Skeleton variant="rectangular" width={60} height={24} />
      </Stack>
    </CardContent>
  </Card>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const Tag = React.memo(({ type, value }) => (
  <Chip
    label={<Typography sx={styles.chipLabel}>{value}</Typography>}
    color={type === 'priority' ? PRIORITY_COLORS[value] : TRACK_COLORS[value]}
    variant="contained"
  />
));

Tag.displayName = 'Tag';

const CardTitle = React.memo(({ data, onStatusClick, isPending }) => (
  <Box display="flex" flexDirection="row">
    <IconButton 
      aria-label="done" 
      sx={styles.statusButton} 
      size='small' 
      onClick={onStatusClick}
      disabled={isPending}
    >
      <StatusIcon status={data?.status} />
    </IconButton>
    <Typography 
      variant="body1" 
      sx={{
        ...styles.title,
        ...(data?.status === "Done" && styles.titleDone)
      }} 
      noWrap
    >
      {data?.title}
    </Typography>
  </Box>
));

CardTitle.displayName = 'CardTitle';

function ToDoCard({ data, isDragging = false, isLoading = false }) {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();


  const cardStyle = useMemo(() => styles.card(isDragging), [isDragging]);

  const editModelinkConfig = useMemo(() => ({
    pathname: '/task',
    query: { id: data?.id, status: data?.status }
  }), [data?.id, data?.status]);
  
  const viewModelinkConfig = useMemo(() => ({
    pathname: '/task',
    query: { id: data?.id, status: data?.status, mode: "view" }
  }), [data?.id, data?.status]);  


  const handleStatusClick = useCallback(async () => {
    if (!isLoading && data?.id) {
      try {
        startTransition(async () => {
          await dispatch(updateTaskStatus({taskId: data?.id, previousStatus: data?.status, status: 'Done' })).unwrap();
        });
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  }, [isLoading, data?.id, data?.status]);

  const tags = useMemo(() => (
    <Stack direction="row" spacing={1} sx={styles.tagStack}>
      {data?.priorityTag && <Tag type="priority" value={data.priorityTag} />}
      {data?.trackTag && <Tag type="track" value={data.trackTag} />}
    </Stack>
  ), [data?.priorityTag, data?.trackTag]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card variant="outlined" sx={cardStyle}>
      <CardHeader
        sx={styles.cardHeader}
        title={
          <CardTitle 
            data={data} 
            onStatusClick={handleStatusClick}
            isPending={isPending} 
          />
        }
        action={
          <>
            <Link href={editModelinkConfig}>
              <IconButton aria-label="edit" disabled={isPending}>
                <Edit />
              </IconButton>
            </Link>
            <Link href={viewModelinkConfig}>
              <IconButton aria-label="view" disabled={isPending}>
                <Visibility />
              </IconButton>
            </Link>
        </>
        }
        subheader={
          <Typography variant="caption">
            {new Date(data?.updatedAt).toLocaleDateString('en-US', {
              month: 'numeric',
              day: 'numeric',
            })}
          </Typography>
        }
      />
      { ((data?.priorityTag || data?.trackTag) || data?.description) &&
        <CardContent sx={styles.cardContent}>
          <Typography variant="body2" sx={styles.description}>
            {data?.description}
          </Typography>
          {tags}
        </CardContent> 
      }

    </Card>
  );
}


export default React.memo(ToDoCard, (prevProps, nextProps) => (
  prevProps.isDragging === nextProps.isDragging &&
  prevProps.isLoading === nextProps.isLoading &&
  isEqual(prevProps.data, nextProps.data)
));
