import { Montserrat } from "next/font/google";
import React from "react";
import Link from "next/link";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function DashboardPage() {
  return (
    <main className={montserrat.className}>
      <div className="flex justify-center h-screen bg-gray-100 items-center flex-col gap-8">
        <span className="font-bold text-4xl">Welcome to Energy Management System!</span>
        <div className="grid grid-cols-4 gap-8">
          <Link className="flex items-center hover:font-semibold hover:text-xl flex-col gap-4 bg-gray-200 hover:bg-gray-300 p-6 rounded-lg" href="/devices">
            <i className="fas fa-desktop text-2xl"></i>
            <span className="text-lg">Devices</span>
          </Link>
          <Link className="flex items-center hover:font-semibold hover:text-xl flex-col gap-4 bg-gray-200 hover:bg-gray-300 p-6 rounded-lg" href="/tasks">
            <i className="fas fa-tasks text-2xl"></i>
            <span className="text-lg">Tasks</span>
          </Link>
          <Link className="flex items-center hover:font-semibold hover:text-xl flex-col gap-4 bg-gray-200 hover:bg-gray-300 p-6 rounded-lg" href="/reports">
            <i className="fas fa-file-alt text-2xl"></i>
            <span className="text-lg">Reports</span>
          </Link>
          <Link className="flex items-center hover:font-semibold hover:text-xl flex-col gap-4 bg-gray-200 hover:bg-gray-300 p-6 rounded-lg" href="/analysis">
            <i className="fas fa-chart-bar text-2xl"></i>
            <span className="text-lg">Analysis</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
