import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminPage() {
  const { token } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [clubsRes, usersRes] = await Promise.all([
        api.get('/api/public/clubs'),
        api.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setClubs(clubsRes.data);
      setUsers(usersRes.data);
    })();
  }, [token]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-nitwBlue">Admin</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-medium">Clubs</h2>
          <ul className="list-disc pl-5">
            {clubs.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-medium">Users</h2>
          <ul className="list-disc pl-5">
            {users.map((u) => (
              <li key={u.id}>{u.name} - {u.role}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
