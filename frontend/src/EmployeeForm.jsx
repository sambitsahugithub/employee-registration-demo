import { useState } from 'react';
import { api } from './api.js';

const today = () => new Date().toISOString().slice(0, 10);

const empty = () => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  dateOfJoining: today(),
});

function validate(f) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = 'First name is required';
  if (!f.lastName.trim()) e.lastName = 'Last name is required';
  if (!f.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email';
  if (f.phone && !/^\+?[0-9 ()-]{7,20}$/.test(f.phone.trim())) e.phone = 'Enter a valid phone number';
  if (!f.department) e.department = 'Select a department';
  if (!f.designation.trim()) e.designation = 'Designation is required';
  if (!f.dateOfJoining) e.dateOfJoining = 'Date of joining is required';
  return e;
}

export default function EmployeeForm({ departments, onCreated }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text }
  const [submitting, setSubmitting] = useState(false);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const clientErrors = validate(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setSubmitting(true);
    try {
      const emp = await api.createEmployee(form);
      onCreated(emp);
      setForm(empty());
      setStatus({ type: 'success', text: `Registered ${emp.firstName} ${emp.lastName} as ${emp.employeeCode}` });
    } catch (err) {
      setErrors(err.errors || {});
      setStatus({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, props = {}) => (
    <label className={`field ${errors[name] ? 'invalid' : ''}`}>
      <span>{label}</span>
      <input name={name} value={form[name]} onChange={update} {...props} />
      {errors[name] && <small className="err">{errors[name]}</small>}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate>
      {status && <div className={`alert ${status.type}`}>{status.text}</div>}
      <div className="grid">
        {field('firstName', 'First name *', { autoComplete: 'given-name' })}
        {field('lastName', 'Last name *', { autoComplete: 'family-name' })}
        {field('email', 'Email *', { type: 'email', autoComplete: 'email' })}
        {field('phone', 'Phone', { type: 'tel', placeholder: '+91 98765 43210' })}
        <label className={`field ${errors.department ? 'invalid' : ''}`}>
          <span>Department *</span>
          <select name="department" value={form.department} onChange={update}>
            <option value="">Select…</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.department && <small className="err">{errors.department}</small>}
        </label>
        {field('designation', 'Designation *', { placeholder: 'e.g. Software Engineer' })}
        {field('dateOfJoining', 'Date of joining *', { type: 'date' })}
      </div>
      <div className="actions">
        <button type="button" className="secondary" onClick={() => { setForm(empty()); setErrors({}); setStatus(null); }}>
          Reset
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Registering…' : 'Register employee'}
        </button>
      </div>
    </form>
  );
}
