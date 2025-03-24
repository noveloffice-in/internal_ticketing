import React from 'react';
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from 'react';
import { useFrappePostCall } from 'frappe-react-sdk';

const CreateTicketModal = ({ onClick, isOpen, isSubticket, parentTicketId }) => {
    const [departments, setDepartments] = useState([]);
    const [departmentWithTeams, setDepartmentWithTeams] = useState([]);
    const [teams, setTeams] = useState([]);
    const [assignedToOptions, setAssignedToOptions] = useState([]);
    const [location, setLocation] = useState([]);
    const [departmentsWithLocation, setDepartmentsWithLocation] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    
    const [formData, setFormData] = useState({
        assigned_department: '',
        parentTicket: parentTicketId || '',
        location: '',
        team: '',
        subject: '',
        message: '',
        status: 'Unassigned Tickets',
        priority: 'Medium',
        assignedTo: 'unassigned@noveloffice.in',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const { call: getAllDataforCreateTicket } = useFrappePostCall("internal_ticketing.ticketing_api.get_all_data_for_create_ticket");

    useEffect(() => {
        getAllDataforCreateTicket({ department_name: selectedDepartment }).then((data) => {
            console.log("Data:", data);
            setDepartments(data.message.departments);
            setDepartmentWithTeams(data.message.departments_with_teams);
            setLocation(data.message.locations);
            setDepartmentsWithLocation(data.message.departments_with_location);
            setTeams(data.message.teams);
            setAssignedToOptions(data.message.assigned_to);
        });
    }, []);

    useEffect(() => {
        if (isSubticket && parentTicketId) {
            setFormData(prevState => ({
                ...prevState,
                parentTicket: parentTicketId
            }));
        }
    }, [isSubticket, parentTicketId]);

    const { call: createTicket } = useFrappePostCall("internal_ticketing.ticketing_api.create_ticket");

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
        console.log(name, value);
        if (name === 'assignedTo') {
            const email = assignedToOptions[value].email;
            setFormData(prevState => ({
                ...prevState,
                [name]: email
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        createTicket({ form_data: formData }).then((data) => {
            console.log("Ticket created:", data);
            onClick();
        }).catch((error) => {
            console.error("Error creating ticket:", error);
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[1300] overflow-y-auto">
            <div className='bg-white rounded-xl mx-4 sm:mx-8 md:mx-16 lg:mx-40 p-4 sm:p-6 md:p-8 lg:p-10 my-4 sm:my-8 md:my-16 lg:my-20 max-w-4xl md:max-w-5xl lg:max-w-6xl w-auto md:w-auto lg:w-auto relative'>
                <button className='absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8' onClick={onClick}>
                    <IoClose size={24} className="sm:text-xl md:text-2xl lg:text-3xl" />
                </button>
                <h2 className='text-xl sm:text-2xl text-center font-bold mb-4 sm:mb-6'>Create a new Ticket</h2>
                <form onSubmit={handleSubmit} className="overflow-y-auto">
                    <div className="flex flex-col md:flex-row md:flex-wrap">
                        {isSubticket && (
                            <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="parentTicket">
                                    Parent Ticket
                                </label>
                                <input type="text" id="parentTicket" name="parentTicket" value={parentTicketId} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} onInput={(e) => e.target.setCustomValidity('')} readOnly />
                            </div>
                        )}

                        <div className="w-full md:w-1/2 md:pl-0 md:pl-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="to">
                                To
                            </label>
                            <select id="assigned_department" name="assigned_department" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="" onChange={(e) => { setSelectedDepartment(e.target.value); handleChange(e); }} required onInvalid={(e) => e.target.setCustomValidity('Please select a department')} onInput={(e) => e.target.setCustomValidity('')}>
                                <option value="" disabled></option>
                                {departments.map((department, index) => (
                                    <option key={index} value={department}>{department}</option>
                                ))}
                            </select>
                        </div>

                        {departmentsWithLocation.includes(selectedDepartment) && (
                            <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4">
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
                            <>
                                <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team">
                                        Team
                                    </label>
                                    <select id="team" name="team" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="" onChange={handleChange}>
                                        <option value="" disabled></option>
                                        {teams[selectedDepartment].map((team, index) => (
                                            <option key={index} value={team}>{team}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full md:w-1/2 pl-0 md:pl-2 mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignedTo">
                                        Assigned To
                                    </label>
                                    <select id="assignedTo" name="assignedTo" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="" onChange={(e) => {handleChange(e)}}>
                                        <option value="" disabled></option>
                                        {Object.keys(assignedToOptions).map((option, index) => (
                                            assignedToOptions[option].department === selectedDepartment && (
                                                <option key={index} value={option}>{option}</option>
                                            )
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                                Subject
                            </label>
                            <input type="text" id="subject" name="subject" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleChange} required onInvalid={(e) => e.target.setCustomValidity('Please enter a subject')} onInput={(e) => e.target.setCustomValidity('')} />
                        </div>

                        <div className="w-full md:w-1/2 pl-0 md:pl-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="due-date">
                                Due Date
                            </label>
                            <input type="date" id="due-date" name="dueDate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={formData.dueDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
                        </div>

                        <div className="w-full md:w-1/2 pr-0 md:pr-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                Status
                            </label>
                            <select id="status" name="status" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" disabled>
                                <option value="unassigned">Unassigned</option>
                            </select>
                        </div>
                        
                        <div className="w-full md:w-1/2 pl-0 md:pl-2 mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                                Priority
                            </label>
                            <select id="priority" name="priority" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue="Medium" onChange={handleChange}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="w-full mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                Message
                            </label>
                            <textarea id="message" name="message" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows="4" onChange={handleChange} required onInvalid={(e) => e.target.setCustomValidity('Please enter a message')} onInput={(e) => e.target.setCustomValidity('')}></textarea>
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 transition-colors duration-300">
                            Create Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketModal;
