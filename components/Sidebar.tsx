import Link from "next/link";

export default function Sidebar() {
  return (
    <section className="h-screen bg-gray-900 text-gray-300 flex flex-col justify-between w-2/12">
      <div>
        <div className="p-6">
          <h1 className="text-white text-2xl font-bold">Energy Management System</h1>
        </div>
        <nav className="mt-6">
          <ul>
            <li className="px-8 py-4">
              <Link className="flex items-center space-x-2 hover:text-white hover:font-semibold hover:text-xl" href="/">
                <i className="fas fa-th-large"></i>
                <span className="text-lg">Overview</span>
              </Link>
            </li>
            <li className="px-8 py-4">
              <Link className="flex items-center space-x-2 hover:text-white hover:font-semibold hover:text-xl" href="/devices">
                <i className="fas fa-desktop"></i>
                <span className="text-lg">Devices</span>
              </Link>
            </li>
            <li className="px-8 py-4">
              <Link className="flex items-center space-x-2 hover:text-white hover:font-semibold hover:text-xl" href="/tasks">
                <i className="fas fa-tasks"></i>
                <span className="text-lg">Tasks</span>
              </Link>
            </li>
            <li className="px-8 py-4">
              <Link className="flex items-center space-x-2 hover:text-white hover:font-semibold hover:text-xl" href="/reports">
                <i className="fas fa-file-alt"></i>
                <span className="text-lg">Reports</span>
              </Link>
            </li>
            <li className="px-8 py-4">
              <Link className="flex items-center space-x-2 hover:text-white hover:font-semibold hover:text-xl" href="/analysis">
                <i className="fas fa-chart-bar"></i>
                <span className="text-lg">Analysis</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mb-6">
        <ul>
          <li className="px-8 py-4">
            <Link className="flex items-center space-x-2 hover:text-white hover:font-semibold hover:text-xl" href="/register">
              <i className="fas fa-user-plus"></i>
              <span className="text-lg">Register User</span>
            </Link>
          </li>
          <li className="px-8 py-4">
            <Link className="flex items-center space-x-2 hover:text-white hover:font-semibold hover:text-xl" href="/logout">
              <i className="fas fa-sign-out-alt"></i>
              <span className="text-lg">Log out</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};