import React, { useState, useEffect } from 'react';
import Searchbar from './Searchbar';
import axios from 'axios';
import PopupCategoryCard from './PopupCategoryCard'; // Pastikan import PopupCategoryCard sudah benar

const TableLaporan = () => {
  const [search, setSearch] = useState('');
  const [laporanData, setLaporanData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // State untuk menyimpan data laporan yang dipilih
  const [topThreePotholes, setTopThreePotholes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []); // Memanggil fetchData saat komponen dimount

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/reports');
      const sortedData = response.data.data.sort((a, b) => new Date(b.laporan_date) - new Date(a.laporan_date));
      setLaporanData(sortedData);
      calculateTopThreePotholes(sortedData); // Hitung tiga teratas setelah mendapatkan data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateTopThreePotholes = (data) => {
    // Urutkan data berdasarkan jumlah lubang dari yang terbanyak ke yang terendah
    const sortedData = data.slice().sort((a, b) => b.numberOfPotholes - a.numberOfPotholes);

    // Ambil tiga teratas
    const topThree = sortedData.slice(0, 3);

    // Simpan dalam state
    setTopThreePotholes(topThree);
  };

  const handleSearchChange = (query) => {
    setSearch(query);
  };

  const getCategoryLabel = (item) => {
    // Periksa apakah item termasuk dalam tiga teratas
    const isInTopThree = topThreePotholes.some(data => data.idlaporan === item.idlaporan);
    
    // Tentukan kategori berdasarkan kondisi
    if (isInTopThree || item.numberOfPotholes >= 5) {
      return 'Berat';
    } else {
      return 'Sedang';
    }
  };

  const filteredData = laporanData.filter((item) =>
    (item.nama_pengguna && item.nama_pengguna.toLowerCase().includes(search.toLowerCase())) ||
    (item.laporan_date && item.laporan_date.toLowerCase().includes(search.toLowerCase())) ||
    (item.location && item.location.toLowerCase().includes(search.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
    (item.status && item.status.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRowClick = (item) => {
    setSelectedItem(item); // Menyimpan data laporan yang dipilih ke dalam state
  };

  return (
    <>
      <Searchbar onSearch={handleSearchChange} />
      <h2>Data Laporan</h2>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Nama Pengguna</th>
              <th>Tanggal Laporan</th>
              <th>Lokasi</th>
              <th>Deskripsi</th>
              <th>Status</th>
              <th>Kategori</th>
              <th>Jumlah Lubang</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item)}>
                <td>
                  <b>{item.nama_pengguna}</b> <br />
                  <span>{item.email_pengguna}</span>
                </td>
                <td>{new Date(item.laporan_date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}</td>
                <td>{item.location}</td>
                <td>{item.description}</td>
                <td>{item.status}</td>
                <td><b>{getCategoryLabel(item)}</b></td>
                <td>{item.numberOfPotholes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedItem && <PopupCategoryCard item={selectedItem} onClose={() => setSelectedItem(null)} />} {/* Menampilkan popup jika ada data yang terpilih */}
    </>
  );
};

export default TableLaporan;
