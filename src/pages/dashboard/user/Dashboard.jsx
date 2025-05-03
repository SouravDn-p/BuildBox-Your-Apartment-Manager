import { Link, Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">User Dashboard</h1>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard/profile"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/announcements"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded"
              >
                Announcements
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
