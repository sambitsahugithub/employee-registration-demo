export default function EmployeeList({ employees, onDelete }) {
  if (!employees.length) return <p className="muted">No employees registered yet.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joined</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td className="mono">{e.employeeCode}</td>
              <td>{e.firstName} {e.lastName}</td>
              <td>{e.email}</td>
              <td>{e.department}</td>
              <td>{e.designation}</td>
              <td>{e.dateOfJoining}</td>
              <td>
                <button className="link danger" onClick={() => onDelete(e)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
