import React from 'react';
import Container from '../components/Container';
import Searchbar from '../components/Searchbar';
import CategoryCard from '../components/CategoryCard';

const Kategori = () => {
  return (
    <div>
      <Container>
        <Searchbar />
        <h2>Kategori</h2>
        <h3>Parah</h3>
        <div className='container-list'>
          <CategoryCard kategori='Parah' />
        </div>
        <h3>Sedang</h3>
        <div className='container-list'>
          <CategoryCard kategori='Sedang' />
        </div>
      </Container>
    </div>
  );
};

export default Kategori;

