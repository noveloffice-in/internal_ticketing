import React from 'react';
import { FaPlus } from 'react-icons/fa';

const Button = ({ text, onClick, className }) => {
  return (
    <button onClick={onClick} className={`${className}`}>
      <FaPlus className='mr-2' />
      {text}
    </button>
  );
};

export default Button;