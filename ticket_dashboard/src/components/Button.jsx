import React from 'react';
import { FaPlus } from 'react-icons/fa';

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className='bg-blue-500 text-white rounded-xl flex items-center px-10 m-2.5 text-xl'>
      <FaPlus className='mr-3' />
      {text}
    </button>
  );
};

export default Button;