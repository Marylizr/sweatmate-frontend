import React, {useEffect, useState } from 'react'
import customFetch from '../../api';
import styles from '../messages/messages.module.css';
import CardMessages from '../../components/card/cardMessages';


const Messages = ({isInFav='false'}) => {
 const [filteredData, setFilteredData] = useState([])
  const [data, setData] = useState([]);
 

  useEffect(() => {
    if (data.length) {
      setFilteredData(data);
    }
  }, [data, setFilteredData]);


  useEffect(() => {
    customFetch("GET", "contact")
      .then((json) => {
      setData(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setFilteredData]);

  const addToMessages = (item) => {       
   setFilteredData([...filteredData, item]);
}

console.log(filteredData)
  return (
    <div className={styles.container}>
      <div className={styles.small_header}> 
        <h2>inBox</h2>
      </div>
      <div className={styles.wrap}>
      {
        filteredData && filteredData.length > 0 && filteredData.map( item => 
          <CardMessages addToMessages={addToMessages} item={item} id={item._id} key={item._id}
           />)
      }
      </div>
    </div> 
  )
}

export default Messages;