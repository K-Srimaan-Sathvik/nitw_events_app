import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function BrowsePage() {
  const { token } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [c, e] = await Promise.all([
        api.get('/api/public/clubs'),
        api.get('/api/public/events'),
      ]);
      setClubs(c.data);
      setEvents(e.data);
    })();
  }, []);

  async function joinClub(id: number) {
    if (!token) return alert('Login required');
    try {
      await api.post(`/api/student/clubs/${id}/join`);
      alert('Applied to club');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Failed to apply');
    }
  }

  async function registerEvent(id: number) {
    if (!token) return alert('Login required');
    try {
      await api.post(`/api/student/events/${id}/register`);
      alert('Registered for event');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Failed to register');
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold text-nitwBlue mb-2">Clubs</h2>
        <div className="space-y-3">
          {clubs.map((club) => (
            <div key={club.id} className="p-3 border rounded bg-white">
              <div className="font-medium">{club.name}</div>
              <div className="text-sm text-gray-600">{club.description}</div>
              {club.leader && <div className="text-xs text-gray-500">Leader: {club.leader.name}</div>}
              <div className="mt-2">
                <button onClick={() => joinClub(club.id)} className="text-sm px-3 py-1 rounded bg-nitwBlue text-white hover:bg-nitwGold">Join Club</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-nitwBlue mb-2">Upcoming Events</h2>
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="p-3 border rounded bg-white">
              <div className="font-medium">{ev.title}</div>
              <div className="text-sm text-gray-600">{ev.description}</div>
              <div className="text-xs text-gray-500">{new Date(ev.date).toLocaleString()} @ {ev.location}</div>
              <div className="text-xs">Club: {ev.Club?.name}</div>
              <div className="mt-2">
                <button onClick={() => registerEvent(ev.id)} className="text-sm px-3 py-1 rounded bg-nitwBlue text-white hover:bg-nitwGold">Register</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
