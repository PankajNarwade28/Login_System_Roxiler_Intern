import { useEffect, useState } from 'react';
import axios from 'axios';
import './userLists.css';

const UserLists = () => {
  const [users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ASC' });

  const fetchUsers = async () => {
    try {
      // Backend handles sorting via query params 
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users?sortBy=${sortConfig.key}&order=${sortConfig.direction}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortConfig]); // Refetch when sorting changes 

  const toggleSort = (key) => {
    let direction = 'ASC';
    if (sortConfig.key === key && sortConfig.direction === 'ASC') {
      direction = 'DESC';
    }
    setSortConfig({ key, direction });
  };

 return (
  <div className="user-container">
    <h2>Registered Users</h2>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort('name')}>
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'ASC' ? '🔼' : '🔽')}
            </th>
            <th onClick={() => toggleSort('email')}>
              Email {sortConfig.key === 'email' && (sortConfig.direction === 'ASC' ? '🔼' : '🔽')}
            </th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                {user.address}
              </td>
              <td>
                <span className={`role-badge ${user.role.replace(/\s+/g, '-').toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default UserLists;