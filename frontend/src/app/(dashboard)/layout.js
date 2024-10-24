import * as React from 'react';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Container } from '@mui/material';

export default function DashboardPagesLayout(props) {
  return (
    <DashboardLayout>
      <Container sx={{ padding: '24px' }}>{props.children}</Container>
    </DashboardLayout>
  );
}
