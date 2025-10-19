import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function LeaderDashboardPage() {
  const { token } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/api/leader/me/clubs', { headers: { Authorization: `Bearer ${token}` } });
      setClubs(data);
    })();
  }, [token]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-nitwBlue">Leader Dashboard</h1>
      <div className="space-y-3">
        {clubs.map((c) => (
          <div key={c.id} className="p-3 border rounded bg-white">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-600">{c.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
