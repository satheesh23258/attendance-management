import React, { useState } from 'react'

const MyProfileSimple = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike@company.com',
    phone: '+1 (555) 345-6789',
    address: '123 Main St, New York, NY 10001',
    employeeId: 'EMP003',
    department: 'Engineering',
    position: 'Software Engineer',
    joinDate: '2023-06-10',
    manager: 'Jane Smith'
  })

  const [tempData, setTempData] = useState(profileData)

  const handleBack = () => {
    window.history.back()
  }

  const handleEdit = () => {
    setTempData(profileData)
    setIsEditing(true)
  }

  const handleSave = () => {
    setProfileData(tempData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempData(profileData)
    setIsEditing(false)
  }

  const handleChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getYearsOfService = () => {
    const joinDate = new Date(profileData.joinDate)
    const currentDate = new Date()
    const years = Math.floor((currentDate - joinDate) / (365.25 * 24 * 60 * 60 * 1000))
    return years
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#1976d2', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: 0, fontSize: '28px' }}>
            My Profile
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                style={{
                  background: 'none',
                  border: '1px solid white',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                style={{
                  background: 'white',
                  border: 'none',
                  color: '#1976d2',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </>
          ) : (
            <button 
              onClick={handleEdit}
              style={{
                background: 'none',
              border: '1px solid white',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        {/* Profile Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#1976d2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '40px',
            color: 'white'
          }}>
            {profileData.firstName[0]}{profileData.lastName[0]}
          </div>
          <h2 style={{ margin: '0 0 10px 0' }}>
            {profileData.firstName} {profileData.lastName}
          </h2>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>
            {profileData.position}
          </p>
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            borderRadius: '16px',
            display: 'inline-block'
          }}>
            {profileData.department}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#1976d2', fontWeight: 'bold' }}>
              {getYearsOfService()}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Years at Company</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#4caf50', fontWeight: 'bold' }}>
              {profileData.employeeId}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Employee ID</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#ff9800', fontWeight: 'bold' }}>
              Full-time
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Employment Type</div>
          </div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            flex: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '24px', color: '#9c27b0', fontWeight: 'bold' }}>
              NY Office
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>Work Location</div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.firstName}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.lastName}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={tempData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.email}
                </div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={tempData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.phone}
                </div>
              )}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              ) : (
                <div style={{ padding: '8px 0', fontSize: '16px' }}>
                  {profileData.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1976d2' }}>Work Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Employee ID
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.employeeId}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Department
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.department}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Position
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.position}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Manager
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.manager}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Join Date
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                {profileData.joinDate}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                Work Location
              </label>
              <div style={{ padding: '8px 0', fontSize: '16px' }}>
                New York Office
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfileSimple
