import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import DashboardLayout from '../../components/DashboardLayout';

const WeekWiseReport = () => (
    <DashboardLayout title="Week-wise Report">
        <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
                Weekly Attendance Aggregations
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
                (This view is under construction)
            </Typography>
        </Card>
    </DashboardLayout>
);

export default WeekWiseReport;
