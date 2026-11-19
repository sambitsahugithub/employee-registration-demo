import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb } from '../src/db.js';
import { createApp } from '../src/app.js';

let server;
let base;
const valid = {
  firstName: 'Asha',
  lastName: 'Rao',
  email: 'Asha.Rao@example.com',
  phone: '+91 98765 43210',
  department: 'Engineering',
  designation: 'Software Engineer',
  dateOfJoining: '2026-11-01',
};
const post = (body) =>
  fetch(`${base}/api/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

before(async () => {
  server = createApp(openDb(':memory:')).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

test('registers a valid employee', async () => {
  const res = await post(valid);
  assert.equal(res.status, 201);
  const emp = await res.json();
  assert.equal(emp.employeeCode, 'EMP00001');
  assert.equal(emp.email, 'asha.rao@example.com');
});

test('rejects duplicate email (case-insensitive)', async () => {
  const res = await post({ ...valid, email: 'ASHA.RAO@example.com' });
  assert.equal(res.status, 409);
});

test('returns field errors for invalid input', async () => {
  const res = await post({ firstName: '', email: 'bad', department: 'X', dateOfJoining: 'nope' });
  assert.equal(res.status, 400);
  const { errors } = await res.json();
  for (const f of ['firstName', 'lastName', 'email', 'department', 'designation', 'dateOfJoining']) {
    assert.ok(errors[f], `expected error for ${f}`);
  }
});

test('lists and deletes employees', async () => {
  let list = await (await fetch(`${base}/api/employees`)).json();
  assert.equal(list.length, 1);
  const del = await fetch(`${base}/api/employees/${list[0].id}`, { method: 'DELETE' });
  assert.equal(del.status, 204);
  list = await (await fetch(`${base}/api/employees`)).json();
  assert.equal(list.length, 0);
});
