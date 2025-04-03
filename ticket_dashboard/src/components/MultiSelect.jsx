import React, { useState, useEffect } from "react";
import { MultiSelect as PrimeMultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
const MultiSelect = ({ label, onChange, options = [], name, departments }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const handleChange = (e) => {
        setSelectedItems(e.value);
        if (onChange) {
            onChange(e.value, name);
        }
    };

    const customStyle = {
        width: '100%',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '5px',
        margin: '5px'
    };

    // Transform departments array into the format expected by PrimeMultiSelect
    const formattedDepartments = departments ? departments.map(dept => ({
        name: dept,
        value: dept
    })) : [];

    return (
        <div className="mb-4  pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>
            <PrimeMultiSelect
                value={selectedItems}
                onChange={handleChange}
                options={formattedDepartments}
                optionLabel="name"
                filter
                placeholder={`Select ${label || "Items"}`}
                maxSelectedLabels={3}
                style={customStyle}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    );
};

export default MultiSelect;
