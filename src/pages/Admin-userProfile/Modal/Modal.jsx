import React from 'react';
import  './modal.css';



const Modal = ({children, isOpen, closeModal }) => {

  return(
    <div className={`modal ${isOpen && "is-open"}`} >
      <div className="modalContainer">
        <button className="modalClose" onClick={closeModal}>X</button>
        
        {children}
      
      </div>
    </div>
  );
};

export default Modal;