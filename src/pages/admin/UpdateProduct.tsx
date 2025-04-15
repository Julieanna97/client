import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://ecommerce-api-new-two.vercel.app/products/${id}`);
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch product", err);
        alert("Error loading product data.");
        navigate("/admin/products");
      }
    };

    fetchProduct();
  }, [id, navigate]);

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
      await axios.patch(`https://ecommerce-api-new-two.vercel.app/products/${id}`, formData);
      alert("Product updated!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Failed to update product", err);
      alert("Error updating product.");
    }
  };

  if (loading) return <p>Loading product data...</p>;

  return (
    <div className="container">
      <h1>Update Product</h1>
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
          />
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
          Update Product
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
