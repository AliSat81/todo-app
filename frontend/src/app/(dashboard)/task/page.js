"use client"
import React from 'react';
import { PageContainer } from '@toolpad/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schema from "@/lib/validationSchemas/addEditTaskSchema";
import { 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Box, 
  Snackbar, 
  Alert,
  Button
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, deleteTask, updateTask } from '@/app/store/slices/todoSlice';
import { STATUSES } from '@/lib/constant';
import ConfirmationModal from '@/components/Modal';
import { deleteProps, statusFormatter } from '@/lib/helper';

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];
const TRACK_OPTIONS = ['On Track', 'Off Track', 'At Risk'];

const FormContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  maxWidth: '800px',
  margin: '0 auto',
});

const TagsContainer = styled(Box)(({ theme }) => ({
  justifyContent: "space-between", 
  display: "flex", 
  flexDirection: "row",
  gap: theme.spacing(4),
  marginBottom: theme.spacing(2),
}));

const TagSection = styled(Box)(({ theme }) => ({
  display: "flex", 
  flexDirection: "column",
  flex: 1,
}));

const FormField = React.forwardRef(({ component: Component, ...props }, ref) => {
  return <Component {...props} ref={ref} />;
});

FormField.displayName = 'FormField';

const CustomRadioGroup = React.memo(({ label, options, value, onChange, error, disabled }) => (
  <TagSection>
    <InputLabel>{label}</InputLabel>
    <FormControl component="fieldset" sx={{ mb: 2 }}>
      <RadioGroup value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel 
            key={option} 
            value={option} 
            control={<Radio />} 
            label={option}
            disabled={disabled}
          />
        ))}
      </RadioGroup>
      {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
    </FormControl>
  </TagSection>
));

CustomRadioGroup.displayName = 'CustomRadioGroup';

function TaskPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const id = searchParams.get('id');
  const status = searchParams.get('status');
  const mode = searchParams.get('mode');
  const isViewMode = mode === 'view';

  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [modal, setModal] = React.useState({
    open: false,
    title: "Delete Task",
    caption: "Are you sure you want to delete this task?",
    onConfirm: () => {
      setModal({...modal, open: false});
      handleDeleteTask();
    },
    onCancel: () => {setModal({...modal,open: false})}
  });
  const [snackbar, setSnackbar] = React.useState({ 
    open: false, 
    success: true, 
    message: '' 
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue, getValues, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: status || '',
    }
  });

  const taskData = useSelector((state) => 
    state?.todo?.data[statusFormatter(status)]
  );

  const selectedTask = React.useMemo(() => 
    id ? taskData?.find(task => task?.id === id) : null,
    [id, taskData]
  );

  const trackTagValue = watch('trackTag', selectedTask?.trackTag || "");
  const priorityTagValue = watch('priorityTag', selectedTask?.priorityTag || "");

  const handleSnackbar = React.useCallback((success, message) => {
    setSnackbar({ open: true, success, message });
  }, []);

  const handleFormSubmit = async (data) => {
    if (isViewMode) return;
    
    deleteProps(data, ['id', 'createdAt', 'updatedAt']);
    setIsLoading(true);
    const body = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
    );

    try {
      if (!id) {
        await dispatch(createTask({body})).unwrap();
        handleSnackbar(true, 'Task added successfully!');
      } else {
        await dispatch(updateTask({taskId: id, body, previousStatus: status})).unwrap();
        handleSnackbar(true, 'Task updated successfully!');
      }
      
      setTimeout(() => router.push("."), 500);
    } catch (error) {
      console.error(error);
      handleSnackbar(false, `Failed to ${id ? 'update' : 'add'} task.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (isViewMode) return;
    
    setIsDeleting(true);
    try {
      await dispatch(deleteTask({taskId: id, status})).unwrap();
      handleSnackbar(true, 'Task deleted successfully!');
      setTimeout(() => router.push("."), 500);
    } catch (error) {
      console.error(error);
      handleSnackbar(false, 'Failed to delete task!');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBack = () => {
    router.push(".");
  };

  React.useEffect(() => {
    if (!id) return;
    
    Object.entries(selectedTask || {}).forEach(([key, value]) => {
      setValue(key, value);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedTask]);

  return (
    <>
      <FormContainer>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ width: '100%' }}>
          <PageContainer title={isViewMode ? "View Task" : (id ? "Edit Task" : "Add Task")} />
          
          <FormField
            component={TextField}
            label="Title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
            sx={{ mb: 2 }}
            disabled={isViewMode}
          />

          <FormField
            component={TextField}
            label="Description"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            disabled={isViewMode}
          />

          <FormControl fullWidth error={!!errors.status} sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select {...register('status')} defaultValue={status || ""} disabled={isViewMode}>
              {STATUSES.map((statusOption) => (
                <MenuItem key={statusOption} value={statusOption}>
                  {statusOption}
                </MenuItem>
              ))}
            </Select>
            {errors.status && 
              <p style={{ color: 'red', fontSize: '12px' }}>{errors.status.message}</p>
            }
          </FormControl>

          <TagsContainer>
            <CustomRadioGroup
              label="Priority"
              options={PRIORITY_OPTIONS}
              value={priorityTagValue}
              onChange={(e) => setValue('priorityTag', e.target.value)}
              error={errors.priorityTag?.message}
              disabled={isViewMode}
            />

            <CustomRadioGroup
              label="Track"
              options={TRACK_OPTIONS}
              value={trackTagValue}
              onChange={(e) => setValue('trackTag', e.target.value)}
              error={errors.trackTag?.message}
              disabled={isViewMode}
            />
          </TagsContainer>

          {isViewMode ? (
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              onClick={handleBack}
            >
              Back
            </Button>
          ) : (
            <>
              <LoadingButton 
                type="submit" 
                variant="outlined" 
                color="primary" 
                fullWidth 
                loading={isLoading} 
                loadingPosition="end"
              >
                {id ? 'Save' : 'Add'}
              </LoadingButton>

              {id && (
                <LoadingButton 
                  variant="outlined" 
                  color="error" 
                  fullWidth 
                  loading={isDeleting} 
                  loadingPosition="end" 
                  onClick={()=> setModal({...modal, open: true})} 
                  sx={{ mt: 2 }}
                >
                  Delete Task
                </LoadingButton>
              )}
            </>
          )}
        </Box>
      </FormContainer>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          severity={snackbar.success ? 'success' : 'error'} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ConfirmationModal 
        title={modal?.title}
        caption={modal?.caption}
        open={modal?.open}
        onConfirm={modal?.onConfirm}
        onCancel={modal?.onCancel}
      />
    </>
  );
}

export default React.memo(TaskPage);