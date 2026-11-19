export const DEPARTMENTS = ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateEmployee(body = {}) {
  const str = (v) => (typeof v === 'string' ? v.trim() : '');
  const data = {
    firstName: str(body.firstName),
    lastName: str(body.lastName),
    email: str(body.email).toLowerCase(),
    phone: str(body.phone),
    department: str(body.department),
    designation: str(body.designation),
    dateOfJoining: str(body.dateOfJoining),
  };
  const errors = {};

  if (!data.firstName) errors.firstName = 'First name is required';
  else if (data.firstName.length > 50) errors.firstName = 'Max 50 characters';
  if (!data.lastName) errors.lastName = 'Last name is required';
  else if (data.lastName.length > 50) errors.lastName = 'Max 50 characters';
  if (!data.email) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email';
  if (data.phone && !PHONE_RE.test(data.phone)) errors.phone = 'Enter a valid phone number';
  if (!DEPARTMENTS.includes(data.department)) errors.department = 'Select a department';
  if (!data.designation) errors.designation = 'Designation is required';
  if (!DATE_RE.test(data.dateOfJoining) || Number.isNaN(Date.parse(data.dateOfJoining))) {
    errors.dateOfJoining = 'Enter a valid date';
  }

  return { data, errors, valid: Object.keys(errors).length === 0 };
}
