import express from 'express';
import cors from 'cors';
import { validateEmployee, DEPARTMENTS } from './validate.js';

const toApi = (r) => ({
  id: r.id,
  employeeCode: r.employee_code,
  firstName: r.first_name,
  lastName: r.last_name,
  email: r.email,
  phone: r.phone,
  department: r.department,
  designation: r.designation,
  dateOfJoining: r.date_of_joining,
  createdAt: r.created_at,
});

export function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '10kb' }));

  const getById = db.prepare('SELECT * FROM employees WHERE id = ?');

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.get('/api/departments', (_req, res) => res.json(DEPARTMENTS));

  app.get('/api/employees', (_req, res) => {
    const rows = db.prepare('SELECT * FROM employees ORDER BY id DESC').all();
    res.json(rows.map(toApi));
  });

  app.get('/api/employees/:id', (req, res) => {
    const row = getById.get(Number(req.params.id));
    if (!row) return res.status(404).json({ message: 'Employee not found' });
    res.json(toApi(row));
  });

  app.post('/api/employees', (req, res) => {
    const { data, errors, valid } = validateEmployee(req.body);
    if (!valid) return res.status(400).json({ message: 'Validation failed', errors });

    const exists = db.prepare('SELECT 1 FROM employees WHERE email = ?').get(data.email);
    if (exists) {
      return res.status(409).json({
        message: 'An employee with this email already exists',
        errors: { email: 'Email already registered' },
      });
    }

    const { lastInsertRowid } = db.prepare(`
      INSERT INTO employees (first_name, last_name, email, phone, department, designation, date_of_joining)
      VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      data.firstName, data.lastName, data.email, data.phone || null,
      data.department, data.designation, data.dateOfJoining,
    );
    const id = Number(lastInsertRowid);
    db.prepare('UPDATE employees SET employee_code = ? WHERE id = ?')
      .run(`EMP${String(id).padStart(5, '0')}`, id);

    res.status(201).json(toApi(getById.get(id)));
  });

  app.delete('/api/employees/:id', (req, res) => {
    const { changes } = db.prepare('DELETE FROM employees WHERE id = ?').run(Number(req.params.id));
    if (!changes) return res.status(404).json({ message: 'Employee not found' });
    res.status(204).end();
  });

  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON body' });
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
