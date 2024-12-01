import React from 'react';
import  '../Modal/modal.css';



const Modal = ({children, isOpen, isClosed }) => {

  return(
    <div className={`modal ${isOpen && "is-open"}`} >
      <div className="modalContainer">
        <button className="modalClose" onClick={isClosed}>X</button>
        
        {children}
      
      </div>
    </div>
  );
};

export default Modal;