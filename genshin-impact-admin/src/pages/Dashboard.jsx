import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiTool,
  FiMap,
  FiDatabase,
  FiActivity,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    characters: 0,
    weapons: 0,
    regions: 0,
    users: 0,
    loading: true,
    error: null,
  });

  // Dummy data for recent activities
  const [recentActivities] = useState([
    {
      id: 1,
      type: "character",
      action: "created",
      name: "Zhongli",
      user: "Admin",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "weapon",
      action: "updated",
      name: "Staff of Homa",
      user: "Admin",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "region",
      action: "updated",
      name: "Liyue",
      user: "Admin",
      time: "8 hours ago",
    },
    {
      id: 4,
      type: "character",
      action: "deleted",
      name: "Deleted Character",
      user: "Admin",
      time: "1 day ago",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app you would have an API endpoint for dashboard stats
        // For now, let's simulate fetching data with timeouts

        // Get character count
        const characterResponse = await api.get("/characters?limit=1");
        const characterCount = characterResponse.data.pagination.totalItems;

        // Get weapon count
        const weaponResponse = await api.get("/weapons?limit=1");
        const weaponCount = weaponResponse.data.pagination.totalItems;

        // Get region count
        const regionResponse = await api.get("/regions");
        const regionCount = regionResponse.data.length;

        // Get user count (admin only)
        const userResponse = await api.get("/user/all");
        const userCount = userResponse.data.length;

        setStats({
          characters: characterCount,
          weapons: weaponCount,
          regions: regionCount,
          users: userCount,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard stats",
        }));
      }
    };

    fetchStats();
  }, []);

  // Stat card component
  const StatCard = ({ title, value, icon, color, link, loading, change }) => (
    <div className="card flex">
      <div className="flex-grow">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <div className="flex items-baseline mt-1">
          <p className="text-2xl font-semibold">
            {loading ? (
              <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              value
            )}
          </p>
          {change && (
            <span
              className={`ml-2 text-sm ${
                change > 0 ? "text-success" : "text-error"
              }`}
            >
              {change > 0 ? (
                <FiArrowUp className="inline" />
              ) : (
                <FiArrowDown className="inline" />
              )}
              {Math.abs(change)}%
            </span>
          )}
        </div>
        <Link
          to={link}
          className="text-primary text-sm hover:underline mt-2 inline-block"
        >
          View all
        </Link>
      </div>
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-lg ${color}`}
      >
        {icon}
      </div>
    </div>
  );

  // Activity item component
  const ActivityItem = ({ type, action, name, time }) => {
    let icon;
    let actionColor;

    switch (type) {
      case "character":
        icon = <FiUsers className="text-primary" />;
        break;
      case "weapon":
        icon = <FiTool className="text-secondary" />;
        break;
      case "region":
        icon = <FiMap className="text-success" />;
        break;
      default:
        icon = <FiDatabase className="text-warning" />;
    }

    switch (action) {
      case "created":
        actionColor = "text-success";
        break;
      case "updated":
        actionColor = "text-primary";
        break;
      case "deleted":
        actionColor = "text-error";
        break;
      default:
        actionColor = "text-gray-600";
    }

    return (
      <div className="flex items-center py-3 border-b border-gray-100 last:border-0">
        <div className="mr-4">{icon}</div>
        <div className="flex-grow">
          <p className="text-sm">
            <span className={actionColor}>{action}</span> {type}{" "}
            <span className="font-medium">{name}</span>
          </p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Dashboard">
      {stats.error && (
        <div className="bg-error-light text-error p-4 rounded mb-6">
          {stats.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Characters"
          value={stats.characters}
          icon={<FiUsers className="text-white" size={20} />}
          color="bg-primary"
          link="/characters"
          loading={stats.loading}
          change={12}
        />

        <StatCard
          title="Total Weapons"
          value={stats.weapons}
          icon={<FiTool className="text-white" size={20} />}
          color="bg-secondary"
          link="/weapons"
          loading={stats.loading}
          change={5}
        />

        <StatCard
          title="Total Regions"
          value={stats.regions}
          icon={<FiMap className="text-white" size={20} />}
          color="bg-success"
          link="/regions"
          loading={stats.loading}
          change={0}
        />

        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<FiUsers className="text-white" size={20} />}
          color="bg-warning"
          link="/users"
          loading={stats.loading}
          change={8}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recent Activities</h2>
            <FiActivity className="text-gray-400" />
          </div>

          <div>
            {recentActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                action={activity.action}
                name={activity.name}
                time={activity.time}
              />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Quick Access</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/characters/create"
              className="card hover:shadow-md transition-shadow flex items-center p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center mr-3">
                <FiUsers className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-medium">Add Character</h3>
                <p className="text-sm text-gray-500">Create new character</p>
              </div>
            </Link>

            <Link
              to="/weapons/create"
              className="card hover:shadow-md transition-shadow flex items-center p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary-light flex items-center justify-center mr-3">
                <FiTool className="text-secondary" size={20} />
              </div>
              <div>
                <h3 className="font-medium">Add Weapon</h3>
                <p className="text-sm text-gray-500">Create new weapon</p>
              </div>
            </Link>

            <Link
              to="/regions/create"
              className="card hover:shadow-md transition-shadow flex items-center p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-success bg-opacity-20 flex items-center justify-center mr-3">
                <FiMap className="text-success" size={20} />
              </div>
              <div>
                <h3 className="font-medium">Add Region</h3>
                <p className="text-sm text-gray-500">Create new region</p>
              </div>
            </Link>

            <Link
              to="/users"
              className="card hover:shadow-md transition-shadow flex items-center p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-warning bg-opacity-20 flex items-center justify-center mr-3">
                <FiUsers className="text-warning" size={20} />
              </div>
              <div>
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm text-gray-500">View and edit users</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
