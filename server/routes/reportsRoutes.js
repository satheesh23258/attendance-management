import express from 'express';
import { auth, requireRole } from '../middleware/auth.js';
import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import Payroll from '../models/Payroll.js';
import { parse } from 'json2csv';

const router = express.Router();

// 📊 Export Attendance Report (CSV)
router.get('/attendance', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    let query = {};
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    if (department && department !== 'All') {
      query.department = department;
    }

    const data = await Attendance.find(query).sort({ date: -1 });
    const fields = ['employeeName', 'employeeId', 'date', 'checkIn', 'checkOut', 'status', 'workingHours'];
    const csv = parse(data, { fields });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📊 Export Employees (CSV)
router.get('/employees', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 });
    const fields = ['name', 'email', 'employeeId', 'department', 'position', 'status', 'joinDate'];
    const csv = parse(employees, { fields });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=employee_list.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📊 Export Payroll (CSV)
router.get('/payroll', auth, requireRole('admin', 'hr'), async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const data = await Payroll.find(query).sort({ employeeName: 1 });
    const fields = ['employeeName', 'month', 'year', 'baseSalary', 'expenses', 'netSalary', 'status'];
    const csv = parse(data, { fields });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=payroll_report.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
