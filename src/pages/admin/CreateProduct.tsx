import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("https://ecommerce-api-new-two.vercel.app/products", formData);
      alert("Product created!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to create product", err);
      alert("Error creating product.");
    }
  };

  return (
    <div className="container">
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            required
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            required
            value={formData.stock}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            required
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="primary-button">
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
