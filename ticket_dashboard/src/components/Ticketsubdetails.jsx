import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiEdit } from "react-icons/ci";
import { useFrappePostCall, useFrappeAuth } from "frappe-react-sdk";
import { ToastContainer, toast } from "react-toastify";
import Cookies from 'js-cookie';

const TicketSubDetails = ({ ticketSubDetails }) => {
    const { ticketId } = useParams();
    const { currentUser } = useFrappeAuth();
    const fullName = Cookies.get('full_name');
    const [departmentList, setDepartmentList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [assigneeList, setAssigneeList] = useState([]);

    const { call: get_subticket_list_details } = useFrappePostCall("internal_ticketing.ticketing_api.get_subticket_list_details");

    useEffect(() => {
        if (ticketSubDetails[0] ) {
            get_subticket_list_details({department: ticketSubDetails[0].assigned_department})
                .then((response) => {
                    setDepartmentList(response.message.departments);
                    setStatusList(response.message.statuses);
                    setAssigneeList(response.message.assignees);
                })
                .catch((error) => {
                    console.error("Error fetching department list:", error);
                });
        }
    }, [ticketSubDetails]);

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
    
    const handleStatusChange = (previousStatus, status) => {
        setTicketStatus(status);
        update_ticket_status({ ticket_id: ticketId, status: status, current_user: currentUser, previous_status: previousStatus, full_name: fullName })
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

    const handleAssigneeChange = (assignee, previousUser) => {
        setTicketAssignee(assignee.full_name);
        if (previousUser === "Unassigned") {
            update_ticket_status({ ticket_id: ticketId, status: "Open Tickets", current_user: currentUser, previous_status: "Unassigned Tickets", full_name: fullName })
            .then((response) => {
                console.log("response", response);
                update_ticket_assignee({ ticket_id: ticketId, assignee: assignee.email })
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.error("Error updating assignee:", error);
                    });
            })
            .catch((error) => {
                console.error("Error updating status:", error);
            });
        }
        
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
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-base mr-2  text-white bg-[rgb(142,189,189)]">
                            {subdetails.owner_profile}
                        </div>
                        <div>
                            <p className="text-md text-gray-500 font-bold">{subdetails.owner_full_name}</p>
                            <p className="text-sm text-gray-500">{subdetails.owner_designation}</p>
                        </div>
                    </div>

                    <div className="text-gray-500 flex items-center w-full">
                        <strong className="mr-2 text-sm">Assigned To: </strong> {ticketAssignee || subdetails.assigned_to_full_name}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <CiEdit onClick={(e) => {
                                e.stopPropagation();
                                setShowAssignee(!showAssignee);
                                
                                // Add event listener to close when clicking outside
                                if (!showAssignee) {
                                    setTimeout(() => {
                                        document.addEventListener('click', function closeAssignee(e) {
                                            setShowAssignee(false);
                                            document.removeEventListener('click', closeAssignee);
                                        });
                                    }, 0);
                                }
                            }} className="text-black" />
                            {showAssignee && (
                            <div className="flex relative z-10">
                                <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                    {assigneeList.map((assignee, index) => (
                                        <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                            handleAssigneeChange(assignee, ticketAssignee || subdetails.assigned_to_full_name);
                                            setShowAssignee(false);
                                            toast.success("Assigned to updated successfully",
                                                {
                                                    position: "bottom-right",
                                                    autoClose: 1000,
                                                }
                                            );
                                        }}>
                                            {assignee.full_name}
                                            
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            )}
                        </span>
                        <ToastContainer />
                    </div>

                    <div className="text-gray-500 flex items-center w-full mt-3">
                        <strong className="mr-2 text-sm">Department: </strong> { ticketDepartment || subdetails.assigned_department}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <CiEdit onClick={(e) => {
                                e.stopPropagation();
                                setShowDepartment(!showDepartment);
                                
                                // Add event listener to close when clicking outside
                                if (!showDepartment) {
                                    setTimeout(() => {
                                        document.addEventListener('click', function closeDepartment(e) {
                                            setShowDepartment(false);
                                            document.removeEventListener('click', closeDepartment);
                                        });
                                    }, 0);
                                }
                            }} className="text-black" />
                            {showDepartment && (
                                <div className="flex relative z-10">
                                    <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                        {departmentList.map((department, index) => (
                                            <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                                handleDepartmentChange(department);
                                                setShowDepartment(false);
                                                toast.success("Department updated successfully",
                                                    {
                                                        position: "bottom-right",
                                                        autoClose: 1000,
                                                    }
                                                );
                                            }}>
                                                {department}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                        <ToastContainer />
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
                            setShowCalendar(!showCalendar);
                            if (!showCalendar) {
                                setTimeout(() => {
                                    document.addEventListener('click', function closeCalendar(e) {
                                        if (!e.target.closest('.react-datepicker') && e.target !== document.querySelector('.ml-2.cursor-pointer.text-black')) {
                                            setShowCalendar(false);
                                            document.removeEventListener('click', closeCalendar);
                                        }
                                    });
                                }, 0);
                            }
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
                                        toast.success("Due date updated successfully", {
                                            position: "bottom-right",
                                            autoClose: 1000,
                                        });
                                    }}
                                    dateFormat="dd-MM-yyyy"
                                    inline
                                    
                                />

                            </div>
                        )}
                        <ToastContainer />
                    </div>

                    <div className={`text-600 text-gray-500 flex items-center w-full mt-3 `}>
                        <strong className="mr-2 text-sm">Status: </strong> {ticketStatus || subdetails.ticket_status}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <CiEdit onClick={() => {
                                setShowStatus(!showStatus);
                                if (!showStatus) {
                                    setTimeout(() => {
                                        document.addEventListener('click', function closeStatusDropdown(e) {
                                            if (!e.target.closest('.status-dropdown') && e.target !== document.querySelector('.ml-2.cursor-pointer.text-black')) {
                                                setShowStatus(false);
                                                document.removeEventListener('click', closeStatusDropdown);
                                            }
                                        });
                                    }, 0);
                                }
                            }} className="text-black" />

                            {showStatus && (
                                <div className="flex relative z-10">
                                    <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                        {statusList.map((status, index) => (
                                            <li
                                                key={index}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    const previousStatus = subdetails.ticket_status;
                                                    handleStatusChange(previousStatus, status);
                                                    setShowStatus(false);
                                                    toast.success("Status updated successfully", {
                                                        position: "bottom-right",
                                                        autoClose: 1000,
                                                    });
                                                }}
                                            >
                                                {status}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                        <ToastContainer />
                    </div>

                    <div className="text-gray-500 flex items-center flex-wrap w-full mt-3">
                        <strong className="mr-2 text-sm">Priority: </strong> {ticketPriority || subdetails.priority}
                        <span className="ml-2 cursor-pointer text-blue-500">
                            <CiEdit onClick={() => {
                                setShowPriority(!showPriority);
                                if (!showPriority) {
                                    setTimeout(() => {
                                        document.addEventListener('click', function closePriorityDropdown(e) {
                                            if (!e.target.closest('.priority-dropdown') && e.target !== document.querySelector('.ml-2.cursor-pointer.text-blue-500')) {
                                                setShowPriority(false);
                                                document.removeEventListener('click', closePriorityDropdown);
                                            }
                                        });
                                    }, 0);
                                }
                            }} className="text-black" />
                            {showPriority && (
                                <div className="flex relative">
                                    <ul className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40">
                                        {['High', 'Medium', 'Low'].map((priority, index) => (
                                            <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => {
                                                handlePriorityChange(priority);
                                                setShowPriority(false);
                                                toast.success("Priority updated successfully", {
                                                    position: "bottom-right",
                                                    autoClose: 1000,
                                                });
                                            }}>
                                                {priority}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </span>
                        <ToastContainer />
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
