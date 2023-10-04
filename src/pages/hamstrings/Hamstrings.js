import React, {useContext } from 'react'
import { UserContext } from '../../components/userContext/userContext';
import Card from '../../components/card/Card';
import NavBar from '../../components/navBar/navBar';
import styles from '../hamstrings/hamstrings.module.css';
import { Link } from 'react-router-dom';
import arrow_left from '../../utils/arrow_left.svg';


const Hamstrings = ({ onClick}) => {

  const { workout  } = useContext(UserContext);

  
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.small_header}> 
        <Link to='/allworkouts'> <img src={arrow_left} alt='' /></Link>
        <h2>Welcome to Hamstrings workout</h2>
      </div>
      <div className={styles.wrap}>
      {
        workout && workout.length > 0 && workout.filter(item => item.type === 'hamstrings' || item.type === 'hamstring').map( item => 
          <Card  item={item} id={item._id} key={item._id}
          onClick={() => {onClick()}} />)
      }
      </div>
    </div> 
  )
}

export default Hamstrings;