import { CheckCircleOutline, Circle, CircleOutlined, Edit } from '@mui/icons-material';
import { Box, CardActions, CardContent, CardHeader, Chip, IconButton, Stack, Typography } from '@mui/material';
import { Card as MUICard } from '@mui/material';
import Link from 'next/link';
import React from 'react';

function Card({ data, isDragging }) {
  return (
    <MUICard 
      variant="outlined"
      sx={{ 
        mt: 1,
        maxWidth: 275,
        borderColor: "#gray",
        borderWidth: 2,
        minHeight: 150,
        borderRadius: 2.5,
        boxShadow: isDragging ? 8 : 0,
        transition: 'box-shadow 0.2s ease',
        cursor: "grab",
        cursor: "-webkit-grab"
      }}
    >
      <CardHeader 
        sx= {{cursor: "pointer"}}
        title={
            <Box display="flex" flexDirection="row">
            <IconButton aria-label="done" sx={{ p: 0, m: 0, mr: 0.2 }} size='small' >
              {data?.status === "Done" ? <Circle sx={{ fontSize: 16 }}/> : <CircleOutlined sx={{ fontSize: 16 }}/>}
            </IconButton>
            
            <Typography 
                variant="body1" 
                sx={{ 
                    fontWeight: 800,
                    color: 'text.primary',
                    maxWidth: 200,
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap', 
                    textDecoration: data?.status === "Done" && "line-through",
                    textDecorationColor: 'gray'
                }} 
                noWrap
            >
                {data?.title}
            </Typography>

            </Box>
        }
        action={
            <Link href={{ pathname: '/task', query: { id: data?.id, status: data?.status } }}>
                <IconButton aria-label="edit">
                    <Edit/>
                </IconButton>
            </Link>
          }

        subheader={<Typography variant="caption">{data?.updatedAt}</Typography>}
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography
        variant="body2"
        sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            lineHeight: '1.5em',
            maxHeight: '4.5em',
            textOverflow: 'ellipsis',
            color: 'text.secondary',
            wordBreak: 'break-word',
        }}
        >
            {data?.description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {!!data?.priorityTag && (
            <Chip
            label={<Typography sx={{ fontSize: 12, fontWeight: 800 }}>{data?.priorityTag}</Typography>}
            color={
                data?.priorityTag === 'High' ? 'error' :
                data?.priorityTag === 'Medium' ? 'warning' :
                'success'  // For 'Low' priority
            }
            variant="contained"
            />
        )}

        {!!data?.trackTag && (
            <Chip
            label={<Typography sx={{ fontSize: 12, fontWeight: 800 }}>{data?.trackTag}</Typography>}
            color={
                data?.trackTag === 'On Track' ? 'success' :
                data?.trackTag === 'Off Track' ? 'warning' :
                'error'  // For 'At Risk'
            }
            variant="contained"
            />
        )}
        </Stack>

      </CardContent>
    </MUICard>
  );
}

export default Card;
