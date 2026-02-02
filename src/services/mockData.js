// Mock data for development when backend is not available

export const mockUsers = [
  {
    id: 1,
    name: 'John Admin',
    email: 'admin@company.com',
    role: 'admin',
    department: 'IT',
    phone: '+1234567890',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isActive: true,
    joinDate: '2022-01-15',
    employeeId: 'EMP001'
  },
  {
    id: 2,
    name: 'Sarah HR',
    email: 'hr@company.com',
    role: 'hr',
    department: 'Human Resources',
    phone: '+1234567891',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isActive: true,
    joinDate: '2022-02-20',
    employeeId: 'EMP002'
  },
  {
    id: 3,
    name: 'Mike Employee',
    email: 'mike@company.com',
    role: 'employee',
    department: 'Sales',
    phone: '+1234567892',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isActive: true,
    joinDate: '2022-03-10',
    employeeId: 'EMP003'
  },
  {
    id: 4,
    name: 'Jane Developer',
    email: 'jane@company.com',
    role: 'employee',
    department: 'IT',
    phone: '+1234567893',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isActive: true,
    joinDate: '2022-04-05',
    employeeId: 'EMP004'
  }
]

export const mockAttendance = [
  {
    id: 1,
    employeeId: 3,
    employeeName: 'Mike Employee',
    date: '2024-01-25',
    checkIn: '09:00:00',
    checkOut: '18:00:00',
    status: 'present',
    workingHours: 9,
    overtime: 0,
    location: { lat: 40.7128, lng: -74.0060, address: 'Office Main Building' }
  },
  {
    id: 2,
    employeeId: 4,
    employeeName: 'Jane Developer',
    date: '2024-01-25',
    checkIn: '08:45:00',
    checkOut: '17:30:00',
    status: 'present',
    workingHours: 8.75,
    overtime: 0,
    location: { lat: 40.7128, lng: -74.0060, address: 'Office Main Building' }
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: 'Mike Employee',
    date: '2024-01-24',
    checkIn: '09:15:00',
    checkOut: '18:30:00',
    status: 'present',
    workingHours: 9.25,
    overtime: 0.25,
    location: { lat: 40.7128, lng: -74.0060, address: 'Office Main Building' }
  }
]

export const mockServices = [
  {
    id: 1,
    title: 'Fix Network Issue',
    description: 'Resolve network connectivity problems in floor 3',
    priority: 'high',
    status: 'pending',
    assignedTo: 4,
    assignedToName: 'Jane Developer',
    createdBy: 1,
    createdByName: 'John Admin',
    createdAt: '2024-01-25T08:00:00Z',
    dueDate: '2024-01-26T18:00:00Z',
    category: 'IT Support',
    location: { lat: 40.7128, lng: -74.0060, address: 'Floor 3, Office Building' }
  },
  {
    id: 2,
    title: 'Install New Software',
    description: 'Install accounting software on finance department computers',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 3,
    assignedToName: 'Mike Employee',
    createdBy: 2,
    createdByName: 'Sarah HR',
    createdAt: '2024-01-24T10:00:00Z',
    dueDate: '2024-01-27T18:00:00Z',
    category: 'IT Support',
    location: { lat: 40.7128, lng: -74.0060, address: 'Finance Department' }
  },
  {
    id: 3,
    title: 'Office Maintenance',
    description: 'Repair air conditioning system in conference room',
    priority: 'low',
    status: 'completed',
    assignedTo: 3,
    assignedToName: 'Mike Employee',
    createdBy: 1,
    createdByName: 'John Admin',
    createdAt: '2024-01-23T09:00:00Z',
    dueDate: '2024-01-25T18:00:00Z',
    completedAt: '2024-01-24T16:30:00Z',
    category: 'Facilities',
    location: { lat: 40.7128, lng: -74.0060, address: 'Conference Room A' }
  }
]

export const mockLocations = [
  {
    id: 1,
    employeeId: 3,
    employeeName: 'Mike Employee',
    latitude: 40.7128,
    longitude: -74.0060,
    address: 'Office Main Building',
    timestamp: '2024-01-25T09:00:00Z',
    isActive: true
  },
  {
    id: 2,
    employeeId: 4,
    employeeName: 'Jane Developer',
    latitude: 40.7260,
    longitude: -73.9897,
    address: 'Client Site - Manhattan Office',
    timestamp: '2024-01-25T10:30:00Z',
    isActive: true
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: 'Mike Employee',
    latitude: 40.7589,
    longitude: -73.9851,
    address: 'Field Location - Times Square',
    timestamp: '2024-01-25T14:15:00Z',
    isActive: false
  }
]

export const mockNotifications = [
  {
    id: 1,
    title: 'New Service Assigned',
    message: 'You have been assigned a new service: Fix Network Issue',
    type: 'service',
    isRead: false,
    createdAt: '2024-01-25T08:00:00Z',
    actionUrl: '/services/1'
  },
  {
    id: 2,
    title: 'Attendance Reminder',
    message: 'Don\'t forget to check in today',
    type: 'attendance',
    isRead: false,
    createdAt: '2024-01-25T08:30:00Z',
    actionUrl: '/attendance'
  },
  {
    id: 3,
    title: 'Service Completed',
    message: 'Service "Office Maintenance" has been marked as completed',
    type: 'service',
    isRead: true,
    createdAt: '2024-01-24T16:30:00Z',
    actionUrl: '/services/3'
  }
]

export const mockReports = {
  attendanceStats: {
    totalEmployees: 4,
    presentToday: 3,
    absentToday: 1,
    averageWorkingHours: 8.5,
    monthlyData: [
      { month: 'Jan', present: 85, absent: 15 },
      { month: 'Feb', present: 88, absent: 12 },
      { month: 'Mar', present: 92, absent: 8 },
      { month: 'Apr', present: 87, absent: 13 },
      { month: 'May', present: 90, absent: 10 },
      { month: 'Jun', present: 86, absent: 14 }
    ]
  },
  serviceStats: {
    totalServices: 156,
    pendingServices: 12,
    inProgressServices: 8,
    completedServices: 136,
    monthlyData: [
      { month: 'Jan', high: 15, medium: 25, low: 20 },
      { month: 'Feb', high: 12, medium: 30, low: 18 },
      { month: 'Mar', high: 18, medium: 22, low: 25 },
      { month: 'Apr', high: 10, medium: 28, low: 22 },
      { month: 'May', high: 14, medium: 24, low: 26 },
      { month: 'Jun', high: 16, medium: 26, low: 23 }
    ]
  },
  performanceStats: {
    topPerformers: [
      { name: 'Jane Developer', score: 95, completedTasks: 45 },
      { name: 'Mike Employee', score: 88, completedTasks: 38 },
      { name: 'Sarah HR', score: 82, completedTasks: 32 }
    ],
    departmentPerformance: [
      { department: 'IT', score: 92 },
      { department: 'Sales', score: 85 },
      { department: 'HR', score: 88 },
      { department: 'Finance', score: 79 }
    ]
  }
}
