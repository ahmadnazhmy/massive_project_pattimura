import React, { useState, useEffect } from 'react';
import DeleteButton from './DeleteButton';
import Searchbar from './Searchbar';
import axios from 'axios';

const TablePengguna = () => {
  const [search, setSearch] = useState('');
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3002/users');

        if (response.status === 404) {
          console.log('Users not found');
          setDataUser([]);
          return;
        }

        setDataUser(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (query) => {
    setSearch(query);
  };

  const handleDeleteUser = (iduser) => {
    axios.delete(`http://localhost:3002/user/${iduser}`)
      .then(response => {
        alert(response.data.message);
        // Update dataUser state after successful deletion
        setDataUser(dataUser.filter(user => user.id !== iduser));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      });
  };

  // Filter data based on search query
  const filteredData = dataUser.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <Searchbar onSearch={handleSearchChange} />
      <h2>Data Pengguna</h2>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>Username</th>
              <th>Email</th>
              <th>No. Telp</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.telp}</td>
                <td className="td-button">
                  <DeleteButton onClick={() => handleDeleteUser(item.iduser)} column="user" id={item.iduser} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablePengguna;
