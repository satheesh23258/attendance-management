import React, { useState, useEffect } from 'react'
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Alert,
    FormControlLabel,
    Checkbox,
    FormGroup
} from '@mui/material'
import { CheckCircle, Cancel, Edit, ArrowBack } from '@mui/icons-material'
import { employeeAPI, hybridPermissionAPI } from '../../services/api'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

const ManagePermissions = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [hybridRole, setHybridRole] = useState('hr') // Default to granting HR access
    const [customPermissions, setCustomPermissions] = useState({
        canAccessHR: false,
        canAccessEmployee: false,
        canViewReports: false,
        canManageAttendance: false,
        canManageLeaves: false
    })
    const [hybridPermissionsMap, setHybridPermissionsMap] = useState({})
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchEmployees()
        fetchHybridPermissions()
    }, [])

    const fetchEmployees = async () => {
        try {
            setLoading(true)
            const { data } = await employeeAPI.getAll()
            setEmployees(data.data || data)
        } catch (error) {
            toast.error('Failed to load employees')
        } finally {
            setLoading(false)
        }
    }

    const fetchHybridPermissions = async () => {
        try {
            const { data } = await hybridPermissionAPI.getAll()
            const map = {}
            data.forEach(p => {
                if (p.status === 'active') {
                    // Extract ID whether populated or not
                    const empId = p.employeeId?.id || p.employeeId?._id || p.employeeId
                    if (empId) {
                        map[empId.toString()] = p._id || p.id
                    }
                }
            })
            setHybridPermissionsMap(map)
        } catch (error) {
            console.error("Error fetching permissions:", error)
        }
    }

    const handleGrantPermission = async () => {
        try {
            const isAttendanceOnly = hybridRole === 'attendance';
            const isCustom = hybridRole === 'custom';
            
            const permissionsPayload = isCustom ? customPermissions : {
                canAccessHR: !isAttendanceOnly,
                canAccessEmployee: true,
                canViewReports: !isAttendanceOnly,
                canManageAttendance: true,
                canManageLeaves: !isAttendanceOnly
            };

            const notesPayload = isCustom 
                ? 'Granted Custom Hybrid Access'
                : (isAttendanceOnly ? 'Granted Attendance-Only Access' : 'Granted Full HR Hybrid Access');

            // API call to grant permission 
            await hybridPermissionAPI.grant({
                employeeId: selectedEmployee.id || selectedEmployee._id,
                permissions: permissionsPayload,
                notes: notesPayload
            })

            toast.success(`${isAttendanceOnly ? 'Attendance access' : 'Hybrid permission'} granted to ${selectedEmployee.name}`)
            setOpenDialog(false)
            fetchEmployees() // Refresh
            fetchHybridPermissions()
        } catch (error) {
            console.error("Error granting permission:", error)
            toast.error('Failed to grant permission')
        }
    }

    const handleRevokePermission = async (employee) => {
        const empId = employee.id || employee._id
        const permissionId = hybridPermissionsMap[empId]
        
        if (!permissionId) {
            toast.error('Could not find active permission ID for this employee')
            return
        }

        if (!window.confirm(`Are you sure you want to revoke hybrid access for ${employee.name}?`)) {
            return
        }

        try {
            await hybridPermissionAPI.revoke(permissionId)
            toast.success(`Access revoked for ${employee.name}`)
            fetchEmployees()
            fetchHybridPermissions()
        } catch (error) {
            console.error("Error revoking permission:", error)
            toast.error('Failed to revoke access')
        }
    }

    const openGrantDialog = (employee) => {
        setSelectedEmployee(employee)
        setHybridRole('hr')
        setCustomPermissions({
            canAccessHR: false,
            canAccessEmployee: true,
            canViewReports: false,
            canManageAttendance: false,
            canManageLeaves: false
        })
        setOpenDialog(true)
    }

    return (
        <DashboardLayout title="">
            <Box sx={{ p: 0 }}>
                <Box sx={{
                    background: '#00c853',
                    color: 'white',
                    p: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    borderRadius: '0 0 16px 16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                            color="inherit"
                            onClick={() => navigate(-1)}
                            sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                        >
                            <ArrowBack />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                Hybrid Permissions
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Manage dual Role-HR access for employees
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                
                <Box sx={{ p: 3 }}>

            <Alert severity="info" sx={{ mb: 3 }}>
                Grant &quot;Hybrid&quot; access to employees, allowing them to switch between Employee and HR views.
            </Alert>

            <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Current Role</TableCell>
                            <TableCell>Hybrid Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp) => (
                            <TableRow key={emp.id || emp._id}>
                                <TableCell>{emp.name}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.role}</TableCell>
                                <TableCell>
                                    {emp.hybridPermissions?.hasAccess ? (
                                        <Chip label="Hybrid" color="success" size="small" />
                                    ) : (
                                        <Chip label="Standard" color="default" size="small" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => openGrantDialog(emp)}
                                            disabled={emp.role === 'admin'}
                                            color="primary"
                                        >
                                            {emp.hybridPermissions?.hasAccess ? 'Update' : 'Manage Access'}
                                        </Button>
                                        {emp.hybridPermissions?.hasAccess && (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                onClick={() => handleRevokePermission(emp)}
                                            >
                                                Revoke
                                            </Button>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    {hybridRole === 'attendance' ? 'Grant Attendance Access' : hybridRole === 'custom' ? 'Custom Permissions Setup' : 'Grant Hybrid Access'}
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        {hybridRole === 'attendance' 
                            ? `Allow ${selectedEmployee?.name} to mark attendance and manage records?`
                            : hybridRole === 'custom' 
                                ? `Checking the allowed permissions for ${selectedEmployee?.name}:` 
                                : `Allow ${selectedEmployee?.name} to access HR functionalities?`}
                    </Typography>
                    <FormControl fullWidth sx={{ mb: hybridRole === 'custom' ? 2 : 0 }}>
                        <InputLabel>Permission Type</InputLabel>
                        <Select
                            value={hybridRole}
                            onChange={(e) => setHybridRole(e.target.value)}
                            label="Permission Type"
                        >
                            <MenuItem value="hr">HR (Human Resources)</MenuItem>
                            <MenuItem value="attendance">Attendance Access</MenuItem>
                            <MenuItem value="custom">Custom Configured Access</MenuItem>
                        </Select>
                    </FormControl>
                    
                    {hybridRole === 'custom' && (
                        <Card variant="outlined" sx={{ p: 2, bgcolor: '#fbfbfb' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Select Permissions:</Typography>
                            <FormGroup>
                                <FormControlLabel 
                                    control={<Checkbox checked={customPermissions.canAccessHR} onChange={(e) => setCustomPermissions({...customPermissions, canAccessHR: e.target.checked})} />} 
                                    label="Access Core HR Dashboard" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={customPermissions.canAccessEmployee} onChange={(e) => setCustomPermissions({...customPermissions, canAccessEmployee: e.target.checked})} />} 
                                    label="Access Employee Profiles" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={customPermissions.canViewReports} onChange={(e) => setCustomPermissions({...customPermissions, canViewReports: e.target.checked})} />} 
                                    label="View Analytical Reports" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={customPermissions.canManageAttendance} onChange={(e) => setCustomPermissions({...customPermissions, canManageAttendance: e.target.checked})} />} 
                                    label="Manage Attendance/Shifts" 
                                />
                                <FormControlLabel 
                                    control={<Checkbox checked={customPermissions.canManageLeaves} onChange={(e) => setCustomPermissions({...customPermissions, canManageLeaves: e.target.checked})} />} 
                                    label="Manage Leaves/Approvals" 
                                />
                            </FormGroup>
                        </Card>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleGrantPermission} variant="contained" color="primary">
                        Grant Access
                    </Button>
                </DialogActions>
            </Dialog>
            </Box>
            </Box>
        </DashboardLayout>
    )
}

export default ManagePermissions
