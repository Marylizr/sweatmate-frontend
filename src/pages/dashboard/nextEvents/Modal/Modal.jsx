import React from 'react';
import  '../Modal/modal.css';



const Modal = ({children, isOpen, onClose }) => {

  return(
    <div className={`modal ${isOpen && "is-open"}`} >
      <div className="modalContainer">
        <button className="modalClose" onClick={onClose}>X</button>
        
        {children}
      
      </div>
    </div>
  );
};

export default Modal;