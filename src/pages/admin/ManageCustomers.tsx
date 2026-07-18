import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../lib/api";
import "../../Admin.css";

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

  const showReadOnlyMessage = () => {
    alert("Demo admin is read-only so the live portfolio database stays safe.");
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <p className="loading-state">Loading customers...</p>;

  return (
    <div className="admin-panel">
      <section className="admin-hero">
        <p className="eyebrow">Admin / customers</p>
        <h1>Customer records</h1>
        <p>
          Customer data is created from the checkout flow. Keep only fake demo
          records in the live database before sharing this publicly.
        </p>

        <button type="button" className="disabled-demo-button" onClick={showReadOnlyMessage}>
          + Create Customer disabled in demo
        </button>
      </section>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Country</th>
                <th>Demo actions</th>
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
                    <button
                      type="button"
                      className="disabled-demo-button"
                      onClick={showReadOnlyMessage}
                    >
                      Edit disabled
                    </button>
                    <button
                      type="button"
                      className="disabled-demo-button"
                      onClick={showReadOnlyMessage}
                    >
                      Delete disabled
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCustomers;
