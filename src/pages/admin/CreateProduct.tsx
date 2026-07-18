import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "Press On Nails",
    image: "",
    external_url: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Demo create product payload:", formData);
      alert("Demo admin is read-only, so this product was not saved.");
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
            placeholder="Duck Nails - Nail Candi"
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short product description..."
          ></textarea>
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
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
            min="0"
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
            placeholder="Press On Nails"
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
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {formData.image && (
          <div>
            <p>Image preview:</p>
            <img
              src={formData.image}
              alt="Product preview"
              style={{
                width: "160px",
                height: "160px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/no-image.png";
              }}
            />
          </div>
        )}

        <div>
          <label>External Product URL:</label>
          <input
            type="text"
            name="external_url"
            value={formData.external_url}
            onChange={handleChange}
            placeholder="https://nailcandimd.com/products/..."
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