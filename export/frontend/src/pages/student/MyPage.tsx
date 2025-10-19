import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function MyPage() {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [m, r] = await Promise.all([
        api.get('/api/student/me/memberships'),
        api.get('/api/student/me/registrations'),
      ]);
      setMemberships(m.data);
      setRegistrations(r.data);
    })();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-nitwBlue mb-2">My Club Memberships</h2>
        <div className="space-y-3">
          {memberships.map((mem) => (
            <div key={mem.id} className="p-3 border rounded bg-white">
              <div className="font-medium">{mem.Club?.name}</div>
              <div className="text-sm">Status: {mem.status}</div>
            </div>
          ))}
          {memberships.length === 0 && <div className="text-sm text-gray-500">No memberships yet</div>}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-nitwBlue mb-2">My Event Registrations</h2>
        <div className="space-y-3">
          {registrations.map((reg) => (
            <div key={reg.id} className="p-3 border rounded bg-white">
              <div className="font-medium">{reg.Event?.title}</div>
              <div className="text-xs text-gray-600">Event ID: {reg.eventId}</div>
            </div>
          ))}
          {registrations.length === 0 && <div className="text-sm text-gray-500">No registrations yet</div>}
        </div>
      </div>
    </div>
  );
}
