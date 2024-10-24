"use client"
import React, { useEffect } from 'react';
import { PageContainer } from '@toolpad/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from "@/lib/validationSchemas/addEditTaskSchema"
import { TextField, Button, MenuItem, FormControl, InputLabel, Select, RadioGroup, FormControlLabel, Radio, Box, Snackbar, Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { getValue, styled } from '@mui/system';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';


const FormContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

function TaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, success: true, message: '' });
  const [selectedTask, setSelectedTask] = React.useState([]);

  // Select task data (if it's exist) from the Redux store, converting status to lowercase and removing spaces
  const taskData = useSelector((state) => state?.todos?.data?.[status?.toLowerCase().replace(/\s+/g, '')]);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues, watch } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    setLoading(true);
    // try {
    //   console.log(data); // Simulate API call
    //   // Simulate successful submission
    //   setSnackbar({ open: true, success: true, message: 'Task added successfully!' });
    //   reset(); // Reset form
    // } catch (error) {
    //   setSnackbar({ open: true, success: false, message: 'Failed to add task' });
    // } finally {
    //   setLoading(false);
    // }
  };

  // Retrieve task data by status and id; alert and redirect if task not found.
  React.useEffect(()=> {
    // Exit early if the URL is in "add" mode (i.e., no ID present)
    if(!id) return;
  
    // Find the specific task with the matching id
    const task = taskData?.find(task => task?.id === parseInt(id));
  
    // Check if the selected task exists
    if (!task) {
      alert("This task doesn't exist!");
      router.push(".")
      return;
    }
  
    // If the selected task exists, set its values in the form state
    if (task) {
      setSelectedTask(task);
    }


  },[id, status]);

  useEffect(()=> {
    setValue('title', selectedTask?.title);
    setValue('description', selectedTask?.description);
    setValue('priorityTag', selectedTask?.priorityTag); 
    setValue('trackTag', selectedTask?.trackTag)
  },[selectedTask]);

  const trackTagValue = watch('trackTag', selectedTask?.trackTag || "");
  const priorityTagValue = watch('priorityTag', selectedTask?.priorityTag || "");

  return (
    <>
    <FormContainer>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} >
        <PageContainer title={id ? "Edit Task" : "Add Task"} />
        
        {/* Title Field */}
        <TextField
          label="Title"
          {...register('title')}
          error={!!errors.title}
          helperText={errors.title?.message}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Description Field */}
        <TextField
          label="Description"
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        {/* Status Dropdown */}
        <FormControl fullWidth error={!!errors.status} sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            {...register('status')}
            defaultValue={status || ""}
          >
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="Doing">Doing</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
            <MenuItem value="Extra">Extra</MenuItem>
          </Select>
          {errors.status && <p style={{ color: 'red', fontSize: '12px' }}>{errors.status.message}</p>}
        </FormControl>

        {/* Priority Tag Selection (Radio Group) */}
        <Box sx={{ justifyContent: "space-between", display: "flex", flexDirection: "row"}}>
        <Box sx={{  display: "flex", flexDirection: "column"}}>
        <InputLabel>Priority</InputLabel>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <RadioGroup
            {...register('priorityTag')}
            value={priorityTagValue}
            onChange={(e) => setValue('priorityTag', e.target.value)}
          >
            <FormControlLabel value="High" control={<Radio />} label="High" />
            <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
            <FormControlLabel value="Low" control={<Radio />} label="Low" />
          </RadioGroup>
          {errors.priorityTag && <p style={{ color: 'red', fontSize: '12px' }}>{errors.priorityTag.message}</p>}
        </FormControl>
        </Box>

        {/* Track Tag Selection (Radio Group) */}
        <Box sx={{  display: "flex", flexDirection: "column"}}>
        <InputLabel >Track</InputLabel>
        <FormControl component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup
          value={trackTagValue} 
          onChange={(e) => setValue('trackTag', e.target.value)} 
        >
          <FormControlLabel value="On Track" control={<Radio />} label="On Track" />
          <FormControlLabel value="Off Track" control={<Radio />} label="Off Track" />
          <FormControlLabel value="At Risk" control={<Radio />} label="At Risk" />
        </RadioGroup>
          {errors.trackTag && <p style={{ color: 'red', fontSize: '12px' }}>{errors.trackTag.message}</p>}
        </FormControl>
        </Box>
        </Box>

        {/* Submit Button */}
        <LoadingButton type="submit" variant="outlined" color="primary" fullWidth loading={loading} loadingPosition="end">
          {id ? 'Save' : 'Add'}
        </LoadingButton>
      </Box>
    </FormContainer>

    {/* Snackbar for feedback */}
    <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
      <Alert severity={snackbar.success ? 'success' : 'error'} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
);
}

export default TaskPage;
