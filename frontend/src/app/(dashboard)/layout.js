"use client"
import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos } from '../store/slices/todoSlice';

export default function DashboardPagesLayout(props) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    try {
      dispatch(fetchTodos()).unwrap();
    } catch (e) {
      console.log("Error fetching data at dashboard layout", e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <DashboardLayout>
      <Container sx={{ padding: '24px' }}>{props.children}</Container>
    </DashboardLayout>
  );
}
