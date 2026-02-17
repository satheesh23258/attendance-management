import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Paper,
  Tab,
  Tabs
} from '@mui/material'
import {
  Notifications,
  Security,
  Palette,
  Language,
  Save,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'

const Settings = () => {
  const [tabValue, setTabValue] = useState(0)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    serviceUpdates: true,
    attendanceReminders: true,
    locationAlerts: false,
    weeklyReports: true,
    systemUpdates: true,
    marketingEmails: false
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
    loginAlerts: true,
    passwordExpiry: true
  })

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    compactMode: false
  })

  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    primaryEmail: 'user@company.com',
    backupEmail: 'user.personal@email.com',
    emailFrequency: 'daily'
  })

  const handleNotificationChange = (setting) => (event) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }))
  }

  const handleSecurityChange = (setting) => (event) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }))
  }

  const handleAppearanceChange = (setting) => (event) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: event.target.value
    }))
  }

  const handlePasswordChange = (field) => (event) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleEmailChange = (field) => (event) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleSaveSettings = (section) => {
    // Simulate saving settings
    setSaveMessage(`${section} settings saved successfully!`)
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const handleChangePassword = () => {
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSaveMessage('New passwords do not match!')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setSaveMessage('Password must be at least 6 characters long!')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    // Simulate password change
    setSaveMessage('Password changed successfully!')
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Notifications" icon={<Notifications />} />
          <Tab label="Security" icon={<Security />} />
          <Tab label="Appearance" icon={<Palette />} />
          <Tab label="Email" icon={<Email />} />
        </Tabs>
      </Paper>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose how you want to receive notifications and updates.
            </Typography>

            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange('emailNotifications')}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive push notifications in your browser"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onChange={handleNotificationChange('pushNotifications')}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <Divider />

              <ListItem>
                <ListItemText
                  primary="Service Updates"
                  secondary="Notifications about service assignments and updates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.serviceUpdates}
                    onChange={handleNotificationChange('serviceUpdates')}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Attendance Reminders"
                  secondary="Daily reminders to check in and check out"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.attendanceReminders}
                    onChange={handleNotificationChange('attendanceReminders')}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Location Alerts"
                  secondary="Alerts when your location is tracked"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.locationAlerts}
                    onChange={handleNotificationChange('locationAlerts')}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Weekly Reports"
                  secondary="Receive weekly summary reports"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onChange={handleNotificationChange('weeklyReports')}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="System Updates"
                  secondary="Notifications about system maintenance and updates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onChange={handleNotificationChange('systemUpdates')}
                  />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Marketing Emails"
                  secondary="Receive promotional and marketing emails"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onChange={handleNotificationChange('marketingEmails')}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Box mt={3}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSaveSettings('Notification')}
              >
                Save Notification Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Security Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security to your account"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onChange={handleSecurityChange('twoFactorAuth')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Session Timeout"
                      secondary="Automatically log out after inactivity"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={securitySettings.sessionTimeout}
                        onChange={handleSecurityChange('sessionTimeout')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Login Alerts"
                      secondary="Get notified when someone logs into your account"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={securitySettings.loginAlerts}
                        onChange={handleSecurityChange('loginAlerts')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Password Expiry"
                      secondary="Require password changes every 90 days"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={securitySettings.passwordExpiry}
                        onChange={handleSecurityChange('passwordExpiry')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={() => handleSaveSettings('Security')}
                  >
                    Save Security Settings
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>

                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange('currentPassword')}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        size="small"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange('newPassword')}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        size="small"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange('confirmPassword')}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    ),
                  }}
                />

                <Box mt={3}>
                  <Button
                    variant="contained"
                    startIcon={<Lock />}
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Appearance Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Appearance Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Theme</InputLabel>
                  <Select
                    value={appearanceSettings.theme}
                    onChange={handleAppearanceChange('theme')}
                    label="Theme"
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="auto">Auto</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={appearanceSettings.language}
                    onChange={handleAppearanceChange('language')}
                    label="Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={appearanceSettings.dateFormat}
                    onChange={handleAppearanceChange('dateFormat')}
                    label="Date Format"
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Time Format</InputLabel>
                  <Select
                    value={appearanceSettings.timeFormat}
                    onChange={handleAppearanceChange('timeFormat')}
                    label="Time Format"
                  >
                    <MenuItem value="12h">12-hour</MenuItem>
                    <MenuItem value="24h">24-hour</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={appearanceSettings.compactMode}
                      onChange={handleAppearanceChange('compactMode')}
                    />
                  }
                  label="Compact Mode"
                />
              </Grid>
            </Grid>

            <Box mt={3}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSaveSettings('Appearance')}
              >
                Save Appearance Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Email Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Email Settings
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Primary Email"
                  type="email"
                  value={emailSettings.primaryEmail}
                  onChange={handleEmailChange('primaryEmail')}
                  margin="normal"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Backup Email"
                  type="email"
                  value={emailSettings.backupEmail}
                  onChange={handleEmailChange('backupEmail')}
                  margin="normal"
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Email Frequency</InputLabel>
                  <Select
                    value={emailSettings.emailFrequency}
                    onChange={handleEmailChange('emailFrequency')}
                    label="Email Frequency"
                  >
                    <MenuItem value="immediate">Immediate</MenuItem>
                    <MenuItem value="daily">Daily Digest</MenuItem>
                    <MenuItem value="weekly">Weekly Digest</MenuItem>
                    <MenuItem value="never">Never</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box mt={3}>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => handleSaveSettings('Email')}
              >
                Save Email Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  )
}

export default Settings
