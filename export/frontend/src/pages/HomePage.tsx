import BrowsePage from './student/BrowsePage';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-nitwBlue">Welcome to NITW Clubs & Events</h1>
      <p className="text-gray-700">Browse clubs, explore upcoming events, and manage memberships.</p>
      <BrowsePage />
    </div>
  );
}
