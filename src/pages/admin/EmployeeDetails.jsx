import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material'
import { ArrowBack, CheckCircle, ExitToApp, Timeline } from '@mui/icons-material'
import DashboardLayout from '../../components/DashboardLayout'
import { attendanceAPI, employeeAPI } from '../../services/api'
import toast from 'react-hot-toast'

const EmployeeDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [empRes, attRes] = await Promise.all([
          employeeAPI.getById(id).catch(e => {
            console.warn(e);
            return employeeAPI.getAll().then(res => ({
              data: (res.data.data || res.data).find(e => e._id === id || e.id === id)
            }))
          }),
          attendanceAPI.getEmployeeAttendanceHistory(id)
        ])
        
        setEmployee(empRes.data)
        setAttendance(attRes.data || [])
      } catch (err) {
        toast.error('Failed to load employee details')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  return (
    <DashboardLayout title="Employee Details">
      <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        <Box sx={{
          background: '#00c853',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          mb: 3,
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <IconButton color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Employee Profile & Attendance History
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
          ) : !employee ? (
            <Typography variant="h6" align="center">Employee not found.</Typography>
          ) : (
            <Grid container spacing={4}>
              {/* Employee Info */}
              <Grid item xs={12} md={4}>
                <Card sx={{ textAlign: 'center', py: 4, borderRadius: 3 }}>
                  <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#00c853', fontSize: 32 }}>
                    {employee.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">{employee.name}</Typography>
                  <Typography color="text.secondary" gutterBottom>{employee.employeeId} - {employee.department}</Typography>
                  <Chip 
                    label={employee.status || 'Active'} 
                    color={employee.status?.toLowerCase() === 'active' ? 'success' : 'default'} 
                    sx={{ mt: 1 }} 
                  />
                  <Divider sx={{ my: 3 }} />
                  <Box textAlign="left" px={4}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1" gutterBottom>{employee.email}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Phone</Typography>
                    <Typography variant="body1" gutterBottom>{employee.phone || 'N/A'}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Join Date</Typography>
                    <Typography variant="body1">{employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'N/A'}</Typography>
                  </Box>
                </Card>
              </Grid>

              {/* Attendance Table */}
              <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <Timeline color="primary" />
                      <Typography variant="h6" fontWeight="bold">Detailed Attendance & Sessions</Typography>
                    </Box>
                    
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
                      <Table>
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Sessions (Check In/Out Timeline)</TableCell>
                            <TableCell>First In</TableCell>
                            <TableCell>Last Out</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {attendance.map((record) => (
                            <TableRow key={record.id || record._id} hover>
                              <TableCell fontWeigth="medium">
                                {record.date}
                              </TableCell>
                              <TableCell>
                                {record.history && record.history.length > 0 ? (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {record.history.map((h, i) => (
                                      <Chip 
                                        key={i} 
                                        icon={h.action === 'check-in' ? <CheckCircle fontSize="small" /> : <ExitToApp fontSize="small" />} 
                                        label={h.time} 
                                        size="small" 
                                        color={h.action === 'check-in' ? 'success' : 'error'} 
                                        variant="outlined"
                                      />
                                    ))}
                                  </Box>
                                ) : (
                                  <Typography variant="caption" color="text.secondary">Legacy Record</Typography>
                                )}
                              </TableCell>
                              <TableCell>{record.checkIn || '-'}</TableCell>
                              <TableCell>{record.checkOut || '-'}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={record.status.toUpperCase()} 
                                  color={record.status === 'present' ? 'success' : record.status === 'late' ? 'warning' : 'error'} 
                                  size="small"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                          {attendance.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                No attendance records found for this employee.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default EmployeeDetails
