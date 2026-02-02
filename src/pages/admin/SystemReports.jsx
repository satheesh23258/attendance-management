import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material'
import {
  ArrowBack,
  Download,
  Assessment,
  TrendingUp,
  TrendingDown,
  People,
  Schedule,
  AttachMoney,
  Business
} from '@mui/icons-material'

const SystemReports = () => {
  const [reportType, setReportType] = useState('overview')
  const [timeRange, setTimeRange] = useState('month')
  const [openDialog, setOpenDialog] = useState(false)

  const handleBack = () => {
    window.history.back()
  }

  const handleExport = () => {
    alert('Export functionality would download reports as PDF/Excel files')
  }

  const systemData = {
    overview: {
      totalUsers: 156,
      activeUsers: 142,
      systemUptime: '99.9%',
      avgResponseTime: '1.2s',
      errorRate: '0.3%',
      storageUsed: '67%'
    },
    users: {
      totalEmployees: 156,
      activeEmployees: 142,
      newUsers: 12,
      userSatisfaction: 4.2,
      loginFrequency: 4.8,
      avgSessionTime: '2h 15m'
    },
    performance: {
      serverResponse: '1.2s',
      pageLoadTime: '2.1s',
      apiResponseTime: '0.8s',
      databaseQueryTime: '0.3s',
      cacheHitRate: '94%',
      systemLoad: '45%'
    },
    security: {
      totalLogins: 12450,
      failedLogins: 156,
      securityAlerts: 3,
      blockedIPs: 12,
      passwordResets: 45,
      twoFactorEnabled: '78%'
    },
    financial: {
      totalRevenue: 2450000,
      operationalCosts: 890000,
      profit: 1560000,
      profitMargin: '63.7%',
      costPerUser: 5670,
      revenueGrowth: '12.3%'
    }
  }

  const getReportData = () => {
    return systemData[reportType] || systemData.overview
  }

  const data = getReportData()

  const MetricCard = ({ title, value, subtitle, trend, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', color: trend > 0 ? 'success.main' : 'error.main' }}>
              {trend > 0 ? <TrendingUp /> : <TrendingDown />}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )

  const renderOverviewMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Users"
          value={data.totalUsers}
          subtitle={`Active: ${data.activeUsers}`}
          trend={2.1}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="System Uptime"
          value={data.systemUptime}
          subtitle="Last 30 days"
          trend={0.1}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Avg Response Time"
          value={data.avgResponseTime}
          subtitle="Page load average"
          trend={-5.2}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Error Rate"
          value={data.errorRate}
          subtitle="System errors"
          trend={-12.3}
          color="error"
        />
      </Grid>
    </Grid>
  )

  const renderUserMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Employees"
          value={data.totalEmployees}
          subtitle={`Active: ${data.activeEmployees}`}
          trend={2.1}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="New Users"
          value={data.newUsers}
          subtitle="This month"
          trend={15.3}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="User Satisfaction"
          value={data.userSatisfaction}
          subtitle="Out of 5.0"
          trend={1.2}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Login Frequency"
          value={data.loginFrequency}
          subtitle="Daily average"
          trend={0.8}
          color="info"
        />
      </Grid>
    </Grid>
  )

  const renderPerformanceMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Server Response"
          value={data.serverResponse}
          subtitle="Average response time"
          trend={-5.2}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Page Load Time"
          value={data.pageLoadTime}
          subtitle="Average load time"
          trend={-3.1}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Cache Hit Rate"
          value={data.cacheHitRate}
          subtitle="Cache efficiency"
          trend={2.3}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="System Load"
          value={data.systemLoad}
          subtitle="CPU usage"
          trend={1.5}
          color="info"
        />
      </Grid>
    </Grid>
  )

  const renderSecurityMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Logins"
          value={data.totalLogins.toLocaleString()}
          subtitle="This month"
          trend={8.7}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Failed Logins"
          value={data.failedLogins}
          subtitle="Security events"
          trend={-15.2}
          color="error"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Security Alerts"
          value={data.securityAlerts}
          subtitle="Active alerts"
          trend={-25.0}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="2FA Enabled"
          value={data.twoFactorEnabled}
          subtitle="Of total users"
          trend={5.3}
          color="success"
        />
      </Grid>
    </Grid>
  )

  const renderFinancialMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total Revenue"
          value={`$${(data.totalRevenue / 1000000).toFixed(2)}M`}
          subtitle="Monthly revenue"
          trend={12.3}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Operational Costs"
          value={`$${(data.operationalCosts / 1000000).toFixed(2)}M`}
          subtitle="Monthly expenses"
          trend={3.2}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Profit Margin"
          value={data.profitMargin}
          subtitle="Net profit ratio"
          trend={2.1}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Revenue Growth"
          value={data.revenueGrowth}
          subtitle="Year over year"
          trend={1.8}
          color="success"
        />
      </Grid>
    </Grid>
  )

  const renderMetrics = () => {
    switch (reportType) {
      case 'users': return renderUserMetrics()
      case 'performance': return renderPerformanceMetrics()
      case 'security': return renderSecurityMetrics()
      case 'financial': return renderFinancialMetrics()
      default: return renderOverviewMetrics()
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: '#d32f2f', 
        color: 'white', 
        p: 3, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4">
            System Reports
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="inherit"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        {/* Report Controls */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="Report Type"
                  >
                    <MenuItem value="overview">System Overview</MenuItem>
                    <MenuItem value="users">User Analytics</MenuItem>
                    <MenuItem value="performance">Performance Metrics</MenuItem>
                    <MenuItem value="security">Security Report</MenuItem>
                    <MenuItem value="financial">Financial Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Time Range</InputLabel>
                  <Select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    label="Time Range"
                  >
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="quarter">Last Quarter</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<Assessment />}
                  onClick={() => alert('Generate detailed report')}
                >
                  Generate Report
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  startIcon={<Download />}
                  onClick={handleExport}
                >
                  Download
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Metrics Display */}
        {renderMetrics()}

        {/* Additional Information */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Report Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This report provides comprehensive insights into system performance, user engagement, 
              security metrics, and financial data. Use the filters above to customize the report 
              timeframe and focus areas.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Key Insights:</strong>
              </Typography>
              <ul style={{ color: 'text.secondary', fontSize: '14px' }}>
                <li>System performance is within acceptable parameters</li>
                <li>User engagement shows positive growth trends</li>
                <li>Security measures are effectively protecting the system</li>
                <li>Financial metrics indicate healthy operational performance</li>
              </ul>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default SystemReports
