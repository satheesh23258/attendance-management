import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import DashboardLayout from '../../components/DashboardLayout';

const ConsolidatedReport = () => (
    <DashboardLayout title="Consolidated Report">
        <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
                Consolidated Monthly Aggregations
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
                (This view is under construction)
            </Typography>
        </Card>
    </DashboardLayout>
);

export default ConsolidatedReport;
