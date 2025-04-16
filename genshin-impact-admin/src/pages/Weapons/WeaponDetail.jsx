// WeaponDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEdit, FiArrowLeft } from "react-icons/fi";
import Layout from "../../components/Layout";
import weaponService from "../../services/weaponService";

// Import komponen
import WeaponBasicInfo from "./components/WeaponBasicInfo";
import WeaponStats from "./components/WeaponStats";
import WeaponPassives from "./components/WeaponPassives";
import WeaponRefinements from "./components/WeaponRefinements";

const WeaponDetail = () => {
  const { id } = useParams();
  const [weapon, setWeapon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchWeapon = async () => {
      try {
        setLoading(true);
        const data = await weaponService.getWeaponById(id);
        setWeapon(data);
      } catch (error) {
        console.error("Error fetching weapon:", error);
        toast.error("Failed to load weapon details");
      } finally {
        setLoading(false);
      }
    };

    fetchWeapon();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Weapon Details">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!weapon) {
    return (
      <Layout title="Weapon Not Found">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Weapon not found
          </h1>
          <Link to="/weapons" className="btn btn-primary">
            <FiArrowLeft className="mr-2" /> Back to Weapons
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${weapon.name} | Weapon Details`}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <div className="flex items-center">
            <Link
              to="/weapons"
              className="mr-3 text-gray-500 hover:text-primary"
            >
              <FiArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">{weapon.name}</h1>
          </div>
          <p className="text-gray-600">
            {weapon.weaponType?.weaponTypeName} • {weapon.rarity?.rarityValue}{" "}
            Star
          </p>
        </div>

        <Link
          to={`/weapons/edit/${weapon.id}`}
          className="btn btn-outline mt-3 md:mt-0"
        >
          <FiEdit className="mr-2" /> Edit Weapon
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 font-medium ${
              activeTab === "info"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-medium ${
              activeTab === "stats"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab("passives")}
            className={`px-4 py-2 font-medium ${
              activeTab === "passives"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Passives
          </button>
          <button
            onClick={() => setActiveTab("refinements")}
            className={`px-4 py-2 font-medium ${
              activeTab === "refinements"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Refinements
          </button>
        </div>
      </div>

      <div className="card">
        {activeTab === "info" && <WeaponBasicInfo weapon={weapon} />}
        {activeTab === "stats" && (
          <WeaponStats weaponId={weapon.id} weaponStats={weapon.weapon_stats} />
        )}
        {activeTab === "passives" && (
          <WeaponPassives passives={weapon.passives} />
        )}
        {activeTab === "refinements" && (
          <WeaponRefinements refinements={weapon.refinements} />
        )}
      </div>
    </Layout>
  );
};

export default WeaponDetail;
