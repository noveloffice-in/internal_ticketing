import React from 'react';
import { FaPlus } from 'react-icons/fa';

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className='bg-[rgb(24,161,161)] text-white rounded-xl flex items-center px-10  text-xl py-3'>
      <FaPlus className='mr-3' />
      {text}
    </button>
  );
};

export default Button;