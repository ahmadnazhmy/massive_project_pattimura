import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopupCategoryCard from './PopupCategoryCard';

const MAX_WORDS = 5;

const truncateDescription = (description) => {
  const words = description.split(' ');
  if (words.length > MAX_WORDS) {
    return words.slice(0, MAX_WORDS).join(' ') + '...';
  }
  return description;
};

const CategoryCard = ({ kategori }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/reports');
        setCategoryData(response.data.data);
      } catch (error) {
        setError(error.message || 'Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  // const getCategoryLabel = (item) => {
  //   if (kategori === 'numberOfPotholes terbanyak') {
  //     return 'Kategori Berat';
  //   } else {
  //     return 'Top Three';
  //   }
  // };  

  const filterCategoryData = () => {
    return categoryData.filter(item => item.category === kategori);
  };

  return (
    <div className='card-container'>
      {filterCategoryData().map((item, index) => {
        const truncatedDescription = truncateDescription(item.description);

        return (
          <div key={index} className={`card ${item.status}`} onClick={() => handleCardClick(item)}>
            <img src={`http://localhost:3002/uploads/${req.file.filename}`} alt="Report" />
            <div className='card-desc'>
              <br /><b>{item.location}</b>
              <p>{truncatedDescription}</p>
              <b>Jumlah Lubang: {item.numberOfPotholes}</b>
            </div>
            <div className='card-sender'>
              <img src={item.profile_photo} alt='Profile' />
              <div className='card-sender-1'>
                <b>{item.nama_pengguna}</b>
                <br />{new Date(item.laporan_date).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })}
              </div>
            </div>
            {/* <div className='card-category'>
              <p>{getCategoryLabel(item)}</p>
            </div> */}
          </div>
        );
      })}
      {selectedItem && <PopupCategoryCard item={selectedItem} onClose={closePopup} />}
      {error && <p>{error}</p>}
    </div>
  );
};

export default CategoryCard;
