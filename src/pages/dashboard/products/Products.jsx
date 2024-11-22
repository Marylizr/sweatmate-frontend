import React from 'react';
import styles from './products.module.css';
import product from '../../../assets/product.svg'

const Products = () => {
  return (
    <div className={styles.container}>
      <div>
        <img src={product} alt='product-icon'/>
        <h2>e-products</h2>
      </div>
    </div>
  )
}

export default Products;