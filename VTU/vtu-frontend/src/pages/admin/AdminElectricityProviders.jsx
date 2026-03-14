import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const AdminElectricityProviders = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    providerCode: "",
    meterTypes: ["prepaid", "postpaid"],
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const data = await api("/api/admin/electricity-providers");
      setProviders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setFormError("");
    setFormLoading(true);
    try {
      await api("/api/admin/electricity-providers", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowForm(false);
      setForm({
        name: "",
        providerCode: "",
        meterTypes: ["prepaid", "postpaid"],
      });
      fetchProviders();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (provider) => {
    try {
      await api(`/api/admin/electricity-providers/${provider._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !provider.isActive }),
      });
      setProviders(
        providers.map((p) =>
          p._id === provider._id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin")}
            className="text-gray-500 mr-3 text-xl"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">Electricity Providers</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Provider"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-4 mb-4 space-y-3">
          <h2 className="font-semibold">New Provider</h2>
          {formError && (
            <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <input
            type="text"
            placeholder="Provider Name (e.g EKEDC)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-3 rounded-lg"
          />
          <input
            type="text"
            placeholder="Provider Code (e.g ikeja-electric)"
            value={form.providerCode}
            onChange={(e) => setForm({ ...form, providerCode: e.target.value })}
            className="w-full border p-3 rounded-lg"
          />
          <button
            onClick={handleCreate}
            disabled={formLoading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {formLoading ? "Creating..." : "Create Provider"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {providers.map((provider) => (
          <div
            key={provider._id}
            className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{provider.name}</p>
              <p className="text-xs text-gray-500">{provider.providerCode}</p>
              <p className="text-xs text-gray-400">
                {provider.meterTypes.join(", ")}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${provider.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {provider.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => handleToggle(provider)}
                className="text-xs text-blue-600 font-semibold"
              >
                {provider.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminElectricityProviders;
