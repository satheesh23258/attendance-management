import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Passport', 'PAN', 'Aadhar', 'Contract', 'NDA', 'Other'],
    required: true
  },
  fileUrl: { type: String, required: true },
  expiryDate: { type: Date },
  status: { type: String, enum: ['active', 'expired', 'pending'], default: 'active' }
}, { timestamps: true });

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Laptop', 'Mobile', 'Monitor', 'Other'], required: true },
  serialNumber: { type: String, unique: true },
  assignedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['assigned', 'returned', 'damaged'], default: 'assigned' }
}, { timestamps: true });


const payrollSchema = new mongoose.Schema({
  month: { type: String, required: true }, // YYYY-MM
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  payslipUrl: String
}, { timestamps: true });

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'hr', 'employee', 'associate'],
      default: 'employee',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['IT', 'Human Resources', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'Customer Support', 'Management', 'Recruitment', 'Training & Development', 'Compensation & Benefits', 'Engineering'],
    },
    position: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    joinDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
    },
    // Enhanced Features Data
    documents: [documentSchema],
    assets: [assetSchema],
    payroll: [payrollSchema],
    isRemote: { type: Boolean, default: false },
    officeLocation: {
        lat: { type: Number, default: 11.27218 },
        lng: { type: Number, default: 77.604 },

        radius: { type: Number, default: 1000 } // meters
    },
    biometricTemplate: { type: String, default: '' }, // For FaceID/Fingerprint hash
    isBiometricEnabled: { type: Boolean, default: false },
    branchName: { type: String, default: '' },
    branchLocation: { type: String, default: '' },
    hybridPermissions: {
      hasAccess: { type: Boolean, default: false },
      permissions: { type: Object, default: {} }
    }
  },
  { timestamps: true }
);

// Auto-generate Employee ID if not provided
employeeSchema.pre('validate', function(next) {
  if (!this.employeeId || (typeof this.employeeId === 'string' && this.employeeId.trim() === '')) {
    this.employeeId = `EMP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  }
  next();
});

employeeSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
