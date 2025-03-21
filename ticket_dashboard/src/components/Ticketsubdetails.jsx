import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiEdit } from "react-icons/ci";
import { useFrappePostCall, useFrappeAuth } from "frappe-react-sdk";

const TicketSubDetails = ({ ticketSubDetails }) => {
    const { ticketId } = useParams();
    const { currentUser } = useFrappeAuth();
    const [departmentList, setDepartmentList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [assigneeList, setAssigneeList] = useState([]);

    const { call: get_subticket_list_details } = useFrappePostCall("internal_ticketing.ticketing_api.get_subticket_list_details");

    useEffect(() => {
        get_subticket_list_details({department: ticketSubDetails[0].assigned_department})
            .then((response) => {
                setDepartmentList(response.message.departments);
                setStatusList(response.message.statuses);
                setAssigneeList(response.message.assignees);
            })
            .catch((error) => {
                console.error("Error fetching department list:", error);
            });
    }, []);

    const [dueDate, setDueDate] = useState(ticketSubDetails.due_date);
    const [showCalendar, setShowCalendar] = useState(false);

    const [showStatus, setShowStatus] = useState(false);
    const [ticketStatus, setTicketStatus] = useState(ticketSubDetails.ticket_status);

    const [showPriority, setShowPriority] = useState(false);
    const [ticketPriority, setTicketPriority] = useState(ticketSubDetails.priority);

    const [showAssignee, setShowAssignee] = useState(false);
    const [ticketAssignee, setTicketAssignee] = useState(ticketSubDetails.assigned_to);

    const [showDepartment, setShowDepartment] = useState(false);
    const [ticketDepartment, setTicketDepartment] = useState(ticketSubDetails.assigned_department);

    const { call: update_ticket_status } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_status");
    const { call: update_ticket_priority } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_priority");
    const { call: update_ticket_due_date } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_due_date");
    const { call: update_ticket_department } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_department");
    const { call: update_ticket_assignee } = useFrappePostCall("internal_ticketing.ticketing_api.update_ticket_assignee");
    
    const handleStatusChange = (status, currentUser) => {
        setTicketStatus(status);

        update_ticket_status({ ticket_id: ticketId, status: status, current_user: currentUser })
            .then((response) => {
            })
            .catch((error) => {
                console.error("Error updating status:", error);
            });
    }

    const handlePriorityChange = (priority) => {
        setTicketPriority(priority);
        update_ticket_priority({ ticket_id: ticketId, priority: priority })
            .then((response) => {
            })
            .catch((error) => {
                console.error("Error updating priority:", error);
            });
    }

    const handleAssigneeChange = (assignee) => {
        setTicketAssignee(assignee.full_name);
        update_ticket_assignee({ ticket_id: ticketId, assignee: assignee.email })
            .then((response) => {
            })
            .catch((error) => {
                console.error("Error updating assignee:", error);
            });
    }

    const handleCalendarClick = (date) => {
        setShowCalendar(!showCalendar);
        setDueDate(date);
        
    };

    const handleDepartmentChange = (department) => {
        setTicketDepartment(department);
        update_ticket_department({ ticket_id: ticketId, department: department })
            .then((response) => {
            })
            .catch((error) => {
                console.error("Error updating department:", error);
            });
    }

    const handleDateChange = (date) => {
        const [day, month, year] = date.due_date.split('/');
        const formatted_date = `${year}-${month}-${day}`;
        const dateData = {
            ticket_id: ticketId,
            due_date: formatted_date
        }
        update_ticket_due_date({ ticket_id: date.ticket_id, due_date: formatted_date })
            .then((response) => {
            })
            .catch((error) => {
                console.error("Error updating date:", error);
            });

    }

    return (
        <div className="flex flex-col items-start p-4 border rounded-2xl shadow-md bg-white w-full">
            {ticketSubDetails.map((subdetails, index) => (

                <div key={index} className=" w-full">

                    <div className="flex items-center mb-4 flex-wrap w-full">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-base mr-2  text-white bg-[rgb(138,89,226,0.28)]">
                            {subdetails.profile}
                        </div>
                        <div>
                            <p className="text-md text-gray-500 font-bold">{subdetails.full_name}</p>
                            <p className="text-sm text-gray-500">{subdetails.designation}</p>
                        </div>
                    </div>

                    <div className="text-gray-500 flex items-center w-full">
                        <strong className="mr-2 text-sm">Assigned To: </strong> {ticketAssignee || subdetails.full_name}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <CiEdit onClick={() => setShowAssignee(!showAssignee)} className="text-black" />
                            {showAssignee && (
                            <div className="flex relative z-10">
                                <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                    {assigneeList.map((assignee, index) => (
                                        <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                            handleAssigneeChange(assignee);
                                            setShowAssignee(false);
                                        }}>
                                            {assignee.full_name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            )}
                        </span>
                    </div>

                    <div className="text-gray-500 flex items-center w-full mt-3">
                        <strong className="mr-2 text-sm">Department: </strong> { ticketDepartment || subdetails.assigned_department}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <CiEdit onClick={() => setShowDepartment(!showDepartment)} className="text-black" />
                            {showDepartment && (
                                <div className="flex relative z-10">
                                    <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                        {departmentList.map((department, index) => (
                                            <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                                handleDepartmentChange(department);
                                                setShowDepartment(false);
                                            }}>
                                                {department}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                    </div>

                    <div className="text-gray-500 flex items-center flex-wrap w-full mt-3 relative">
                        <strong className="mr-2 text-sm">Due Date: </strong> 
                        {dueDate ? (
                            <span>{dueDate.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}</span>
                        ) : subdetails.due_date ? (
                            <span>{new Date(subdetails.due_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}</span>
                        ) : (
                            <span>No Due Date</span>
                        )}
                        <CiEdit onClick={() => {
                            setShowCalendar(!showCalendar)
                        }} className="ml-2 cursor-pointer text-black" />
                        
                        {showCalendar && (
                            <div className="absolute top-full left-0 z-10 mt-1">
                                <DatePicker
                                    selected={dueDate}
                                    onChange={(date) => {
                                        handleCalendarClick(date);
                                        const dueDateData = {
                                            ticket_id: ticketId,
                                            due_date: date.toLocaleDateString('en-GB', {
                                                month: 'numeric',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })
                                        }
                                        handleDateChange(dueDateData);
                                    }}
                                    dateFormat="dd-MM-yyyy"
                                    inline
                                />
                            </div>
                        )}
                    </div>

                    <div className={`text-600 text-gray-500 flex items-center w-full mt-3 `}>
                        <strong className="mr-2 text-sm">Status: </strong> {ticketStatus || subdetails.ticket_status}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <CiEdit onClick={() => setShowStatus(!showStatus)} className="text-black" />

                            {showStatus && (
                                <div className="flex relative z-10">
                                    <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                        {statusList.map((status, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    handleStatusChange(status, currentUser);
                                                    setShowStatus(false);

                                                }}
                                            >
                                                {status}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                    </div>

                    <div className="text-gray-500 flex items-center flex-wrap w-full mt-3">
                        <strong className="mr-2 text-sm">Priority: </strong> {ticketPriority || subdetails.priority}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <CiEdit onClick={() => setShowPriority(!showPriority)} className="text-black" />
                            {showPriority && (
                                <div className="flex relative">
                                    <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                        {['High', 'Medium', 'Low'].map((priority, index) => (
                                            <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                                handlePriorityChange(priority);
                                                setShowPriority(false);
                                            }}>
                                                {priority}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                    </div>

                    <div className="text-gray-500 flex items-center text-xs mt-4 w-full">
                        <strong className="mr-2 text-sm">Ticket Creation: </strong>
                        {(() => {
                            const date = new Date(subdetails.creation);
                            const formattedDate = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });
                            const time = subdetails.creation.split(' ')[1].split('.')[0];
                            return `${formattedDate} ${time}`;
                        })()}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default TicketSubDetails;
