import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, TextField, Button, Grid, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { Search as SearchIcon, Refresh as RefreshIcon, Print, Download } from '@mui/icons-material';
import DashboardLayout from '../../components/DashboardLayout';
import { attendanceAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DailyAttendance = () => {
    // Default to current month
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d.toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await attendanceAPI.getMyHistory({ start: fromDate, end: toDate });
            setAttendanceData(res.data || []);
        } catch (error) {
            toast.error('Failed to load attendance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = () => {
        fetchData();
    };

    const handleReset = () => {
        const dStr = new Date().toISOString().split('T')[0];
        const dStartStr = new Date(new Date().setDate(1)).toISOString().split('T')[0];
        setFromDate(dStartStr);
        setToDate(dStr);
        setTimeout(fetchData, 0); // Need to wait for statedate update
    };

    const getCellsForStatus = (record) => {
        const status = record?.status?.toLowerCase() || 'absent';
        const hours = 10;
        let cells = [];

        if (status === 'present') {
            for(let i=0; i<8; i++) cells.push('P'); // 8 hours present
            for(let i=8; i<10; i++) cells.push(''); // extra 2 hours empty
        } else if (status === 'leave') {
            for(let i=0; i<8; i++) cells.push('L');
            for(let i=8; i<10; i++) cells.push('');
        } else if (status === 'half-day') {
            for(let i=0; i<4; i++) cells.push('P');
            for(let i=4; i<10; i++) cells.push('');
        } else if (status === 'holiday' || status === 'weekend') {
            return <TableCell colSpan={10} align="center" sx={{ color: 'error.main', fontSize: '0.85rem' }}>{record.notes || 'Holiday / Weekend'}</TableCell>;
        } else {
            // Absent
            for(let i=0; i<8; i++) cells.push('A');
            for(let i=8; i<10; i++) cells.push('');
        }

        return cells.map((c, i) => (
            <TableCell key={i} align="center" sx={{ fontWeight: 'bold', color: c === 'P' ? 'success.main' : c === 'L' ? 'primary.main' : c === 'A' ? 'error.main' : 'inherit' }}>
                {c || '-'}
            </TableCell>
        ));
    };

    // Generate consecutive dates between from and to, and merge with fetched data
    const getRenderRows = () => {
        const rows = [];
        let curr = new Date(fromDate);
        const end = new Date(toDate);

        while (curr <= end) {
            const dateStr = curr.toISOString().split('T')[0];
            const foundRecord = attendanceData.find(d => d.date?.startsWith(dateStr));
            let finalRecord = foundRecord;
            
            if (!foundRecord) {
                const day = curr.getDay();
                if (day === 0 || day === 6) {
                    finalRecord = { date: dateStr, status: 'weekend', notes: 'Weekend' };
                } else {
                    finalRecord = { date: dateStr, status: 'absent' }; // default
                }
            }

            rows.push(finalRecord);
            curr.setDate(curr.getDate() + 1);
        }
        return rows;
    };

    const renderRows = getRenderRows();

    return (
        <DashboardLayout title="Daily Attendance Report">
            <Card sx={{ mb: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField 
                                fullWidth 
                                type="date" 
                                label="From Date" 
                                InputLabelProps={{ shrink: true }}
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField 
                                fullWidth 
                                type="date" 
                                label="To Date" 
                                InputLabelProps={{ shrink: true }}
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} md={4} display="flex" gap={1}>
                            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleReset} size="small" color="inherit">
                                Reset
                            </Button>
                            <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} size="small" color="primary">
                                Search
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    USING ATTENDANCE RULE FROM {fromDate} TO {toDate}
                </Typography>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" size="small" startIcon={<Print />}>Print</Button>
                    <Button variant="outlined" size="small" startIcon={<Download />}>Export</Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #eee' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: 600, py: 2 }}>DATES</TableCell>
                            {[1,2,3,4,5,6,7,8,9,10].map(h => (
                                <TableCell key={h} align="center" sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#666' }}>
                                    HOUR {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={11} align="center" sx={{ py: 5 }}>Loading...</TableCell></TableRow>
                        ) : renderRows.length === 0 ? (
                            <TableRow><TableCell colSpan={11} align="center" sx={{ py: 5 }}>No Data Found</TableCell></TableRow>
                        ) : renderRows.map((row, idx) => {
                            // Format dd-mm-yyyy matching picture
                            const dParts = row.date.split('-');
                            const formattedDate = `${dParts[2]}-${dParts[1]}-${dParts[0]}`;
                            return (
                                <TableRow key={idx} hover>
                                    <TableCell align="center" sx={{ fontWeight: 600, borderRight: '1px solid #eee' }}>
                                        {formattedDate}
                                    </TableCell>
                                    {getCellsForStatus(row)}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </DashboardLayout>
    );
};

export default DailyAttendance;
