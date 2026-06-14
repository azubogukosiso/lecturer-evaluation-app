import { useState } from "react";
import LecturerNameSearchComponent from "./AdminDashboardComponentTabs/LecturerNameSearchComponent";
import LecturerDepartmentSearchComponent from "./AdminDashboardComponentTabs/LecturerDepartmentSearchComponent";
import { useAuthContext } from "../hooks/useAuthContext";

type AdminDashboardComponentProps = {
  adminEmail?: string;
};

type TabId = "one" | "two" | "three";

const TABS: { id: TabId; label: string }[] = [
  { id: "one", label: "Lecturer Name Search" },
  { id: "two", label: "Department Search" },
];

const AdminDashboardComponent = ({
  adminEmail,
}: AdminDashboardComponentProps) => {
  const [active, setActiveTab] = useState<TabId>("one");
  const { logout } = useAuthContext();

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl">
            Welcome to your dashboard 😊{" "}
            <span className="text-sm px-2 py-1 ml-1 text-white bg-gray-400 rounded-lg">
              {adminEmail}
            </span>
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[150px]">
          <div className="bg-gray-100 p-4 rounded flex flex-col justify-between">
            <h1 className="text-5xl">1.4k</h1>
            <p>Total number of Lecturers</p>
          </div>

          <div className="bg-gray-100 p-4 rounded flex flex-col justify-between">
            <h1 className="text-5xl">13</h1>
            <p>Total number of lecturers with ratings</p>
          </div>

          <div className="bg-gray-100 p-4 rounded flex flex-col justify-between">
            <h1 className="text-5xl">1.1k</h1>
            <p>Total number of lecturers without ratings</p>
          </div>
        </div>

        <div className="flex items-end gap-0.5 mt-5">
          {TABS.map((tab) => {
            const isActive = tab.id === active;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "relative px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 rounded-t-lg border border-b-0 select-none outline-none w-1/2",
                  isActive
                    ? "bg-white text-stone-900 border-stone-300 z-10 -mb-px pb-3.5 shadow-sm"
                    : "bg-stone-200 text-stone-400 border-stone-300 hover:bg-stone-50 hover:text-stone-600 cursor-pointer",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="bg-white border border-stone-300 rounded-b-xl shadow-sm min-h-[100px]">
          {active === "one" && <LecturerNameSearchComponent />}
          {active === "two" && <LecturerDepartmentSearchComponent />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardComponent;
