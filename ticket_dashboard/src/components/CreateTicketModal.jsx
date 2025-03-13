import React from 'react';
import { IoClose } from "react-icons/io5";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const departments = [
    'Software',
    'Pre-Sales',
    'Marketing',
    'Customer Support',
    'Human Resources',
    'Finance',
    'Legal',
    'Administration',
    'BDM',
    'Electrical',
    'Facility',
    'IT',
    'Maintenance',
    'Security',
    'Other'
]

const departmentsWithLocation = [
    'Electrical',
    'Facility',
    'IT',
    'Maintenance',
    'Security',
    'Other'
];

const location = [
    'NOM',
    'NTP',
    'NOW',
    'NOQ',
    'NBP'
]

const departmentWithTeams = [
    'BDM'
]

const bdmTeams = [
    'Team 1',
    'Team 2',
    'Team 3',
]



const CreateTicketModal = ({ onClick, isOpen, isSubticket }) => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [formData, setFormData] = useState({
        to: '',
        parentTicket: '',
        location: '',
        team: '',
        subject: '',
        message: '',
        status: 'unassigned',
        priority: 'medium',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    console.log(selectedDepartment)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Prevent background scroll
        } else {
            document.body.style.overflow = "auto"; // Restore scroll
        }

        return () => {
            document.body.style.overflow = "auto"; // Cleanup on unmount
        };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        
        setShowAlert(true);
        onClick();
    };

    return (
        <div className="fixed inset-0 justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[1300] overflow-y-auto">
            <div className='bg-white rounded-xl ml-40 mr-40 p-10 mt-40 mb-40'>
                <button className='absolute top-40 right-40 m-4' onClick={onClick}>
                    <IoClose size={30} />
                </button>
                <h2 className='text-2xl text-center font-bold'>Create a new Ticket</h2>
                <form onSubmit={handleSubmit}>
                    {isSubticket && (
                        <div className="mb-4 flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parentTicket">
                                    Parent Ticket
                                </label>
                                <input type="text" id="parentTicket" name="parentTicket" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" readOnly />
                                {console.log("Parent Ticket input rendered")}
                            </div>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="to">
                            To
                        </label>
                        <select id="to" name="to" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="" onChange={(e) => { setSelectedDepartment(e.target.value); handleChange(e); }}>
                            <option value="" disabled></option>
                            {departments.map((department, index) => (
                                <option key={index} value={department.replace(/\s+/g, '-')}>{department}</option>
                            ))}
                        </select>
                    </div>

                    {departmentsWithLocation.includes(selectedDepartment) && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                                Location
                            </label>
                            <select id="location" name="location" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="" onChange={handleChange}>
                                <option value="" disabled></option>
                                {location.map((loc, index) => (
                                    <option key={index} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {departmentWithTeams.includes(selectedDepartment) && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team">
                                Team
                            </label>
                            <select id="team" name="team" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="" onChange={handleChange}>
                                <option value="" disabled></option>
                                {bdmTeams.map((team, index) => (
                                    <option key={index} value={team}>{team}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                            Subject
                        </label>
                        <input type="text" id="subject" name="subject" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea id="message" name="message" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4" onChange={handleChange}></textarea>
                    </div>

                    <div className="mb-4 flex flex-wrap">
                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                Status
                            </label>
                            <select id="status" name="status" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled>
                                <option value="unassigned">Unassigned</option>
                            </select>
                        </div>
                        <div className="w-1/2 pl-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                                Priority
                            </label>
                            <select id="priority" name="priority" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="medium" onChange={handleChange}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4 flex flex-wrap">
                        <div className="w-1/2 pr-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due-date">
                                Due Date
                            </label>
                            <input type="date" id="due-date" name="dueDate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={formData.dueDate} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white rounded-xl px-4 py-2" >
                            Create Ticket
                        </button>
                    </div>
                </form>
                {showAlert && (
                    <div className="fixed top-0 left-0 right-0 flex justify-center items-center p-4 bg-green-500 text-white font-bold text-center z-[1400] shadow-md">
                        <span className="font-medium">Success alert!</span> Ticket created successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTicketModal;
