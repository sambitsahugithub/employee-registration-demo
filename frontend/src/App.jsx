import { useEffect, useState } from 'react';
import { api } from './api.js';
import EmployeeForm from './EmployeeForm.jsx';
import EmployeeList from './EmployeeList.jsx';

export default function App() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    Promise.all([api.departments(), api.listEmployees()])
      .then(([d, e]) => {
        setDepartments(d);
        setEmployees(e);
      })
      .catch(() => setLoadError('Could not reach the API. Is the backend running on port 5000?'));
  }, []);

  const handleCreated = (emp) => setEmployees((list) => [emp, ...list]);

  const handleDelete = async (emp) => {
    if (!window.confirm(`Remove ${emp.firstName} ${emp.lastName}?`)) return;
    try {
      await api.deleteEmployee(emp.id);
      setEmployees((list) => list.filter((e) => e.id !== emp.id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Employee Registration</h1>
        <p className="muted">Register new employees and view everyone registered so far.</p>
      </header>

      {loadError && <div className="alert error">{loadError}</div>}

      <main className="layout">
        <section className="card">
          <h2>New employee</h2>
          <EmployeeForm departments={departments} onCreated={handleCreated} />
        </section>
        <section className="card">
          <h2>
            Registered employees <span className="badge">{employees.length}</span>
          </h2>
          <EmployeeList employees={employees} onDelete={handleDelete} />
        </section>
      </main>
    </div>
  );
}
