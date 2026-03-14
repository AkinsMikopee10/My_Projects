import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/api";

const AdminCablePlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    provider: "DSTV",
    planCode: "",
    planName: "",
    price: "",
    costPrice: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await api("/api/admin/cable-plans");
      setPlans(data);
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
      await api("/api/admin/cable-plans", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          costPrice: Number(form.costPrice),
        }),
      });
      setShowForm(false);
      setForm({
        provider: "DSTV",
        planCode: "",
        planName: "",
        price: "",
        costPrice: "",
      });
      fetchPlans();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (plan) => {
    try {
      await api(`/api/admin/cable-plans/${plan._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !plan.isActive }),
      });
      setPlans(
        plans.map((p) =>
          p._id === plan._id ? { ...p, isActive: !p.isActive } : p,
        ),
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await api(`/api/admin/cable-plans/${id}`, { method: "DELETE" });
      setPlans(plans.filter((p) => p._id !== id));
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
          <h1 className="text-xl font-bold">Cable Plans</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          {showForm ? "Cancel" : "+ Add Plan"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-4 mb-4 space-y-3">
          <h2 className="font-semibold">New Cable Plan</h2>
          {formError && (
            <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <select
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
            className="w-full border p-3 rounded-lg"
          >
            {["DSTV", "GOTV", "STARTIMES"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {[
            { key: "planCode", placeholder: "Plan Code" },
            { key: "planName", placeholder: "Plan Name" },
            { key: "price", placeholder: "Selling Price (₦)", type: "number" },
            { key: "costPrice", placeholder: "Cost Price (₦)", type: "number" },
          ].map((field) => (
            <input
              key={field.key}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={(e) =>
                setForm({ ...form, [field.key]: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />
          ))}
          <button
            onClick={handleCreate}
            disabled={formLoading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {formLoading ? "Creating..." : "Create Plan"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{plan.planName}</p>
              <p className="text-xs text-gray-500">{plan.provider}</p>
              <p className="text-xs text-gray-400">
                Sell: ₦{plan.price.toLocaleString()} | Cost: ₦
                {plan.costPrice.toLocaleString()} | Profit: ₦
                {(plan.price - plan.costPrice).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${plan.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {plan.isActive ? "Active" : "Inactive"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(plan)}
                  className="text-xs text-blue-600 font-semibold"
                >
                  {plan.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="text-xs text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCablePlans;
