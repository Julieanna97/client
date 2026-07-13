import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../lib/api";

interface Customer {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

const ManageCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/customers/${id}`);

      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (err) {
      console.error("Failed to delete customer", err);
      alert("Error deleting customer.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <p>Loading customers...</p>;

  return (
    <div className="container">
      <h1>Manage Customers</h1>

      <Link to="/admin/customers/create" className="link-button">
        + Create Customer
      </Link>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  {customer.firstname} {customer.lastname}
                </td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.city}</td>
                <td>{customer.country}</td>
                <td className="actions">
                  <Link
                    to={`/admin/customers/update/${customer.id}`}
                    className="link-button"
                  >
                    Edit
                  </Link>

                  <button onClick={() => deleteCustomer(customer.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageCustomers;