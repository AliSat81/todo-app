import * as yup from 'yup';

// Yup validation schema
const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string(), // Optional
    status: yup.string()
      .oneOf(['To Do', 'Doing', 'Done', 'Extra'], 'Invalid status')
      .required('Status is required'),
    priorityTag: yup.string()
      .oneOf(['Medium', 'High', 'Low'], 'Invalid priority')
      .nullable(), // Optional
    trackTag: yup.string()
      .oneOf(['On Track', 'Off Track', 'At Risk'], 'Invalid track')
      .nullable(), // Optional
  });


  export default schema;