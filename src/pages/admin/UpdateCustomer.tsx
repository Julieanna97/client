import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateCustomer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    street_address: "",
    postal_code: "",
    city: "",
    country: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`https://ecommerce-api-new-two.vercel.app/customers/${id}`);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch customer", err);
        alert("Error loading customer data.");
        navigate("/admin/customers");
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch(`https://ecommerce-api-new-two.vercel.app/customers/${id}`, formData);
      alert("Customer updated!");
      navigate("/admin/customers");
    } catch (err) {
      console.error("Failed to update customer", err);
      alert("Error updating customer.");
    }
  };

  if (loading) return <p>Loading customer data...</p>;

  return (
    <div className="container">
      <h1>Update Customer</h1>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label>{key.replace("_", " ")}:</label>
            <input
              type={key === "password" ? "password" : "text"}
              name={key}
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateCustomer;
