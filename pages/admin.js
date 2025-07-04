import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, nickname');

    if (!error) {
      setUsers(data);
    } else {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Super Admin Panel</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '2rem' }}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Role</th>
            <th>Nickname</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.role}</td>
              <td>{u.nickname || '—'}</td>
              <td>
                {/* Placeholder for future edit/approve buttons */}
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
