import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateCustomer = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("https://ecommerce-api-new-two.vercel.app/customers", formData);
      alert("Customer created!");
      navigate("/admin/customers");
    } catch (err) {
      console.error("Failed to create customer", err);
      alert("Error creating customer.");
    }
  };

  return (
    <div className="container">
      <h1>Create Customer</h1>
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
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateCustomer;
