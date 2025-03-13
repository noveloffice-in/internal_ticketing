import { createContext, useContext, useState } from "react";

const TicketContext = createContext();

const ticketsData = [
  { id: 1, title: "Server Down", assignee: "Sakshya P", due: "Today", status: "Open" },
  { id: 2, title: "Payment Failure", assignee: "Rohan K", due: "Tomorrow", status: "Working" },
  { id: 3, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Solved" },
  { id: 4, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Sent" },
  { id: 5, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Unassigned" },
  { id: 6, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Open" },
  { id: 7, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Unassigned" },
  { id: 8, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Closed" },
  { id: 9, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Working" },
  { id: 10, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Open" },
  { id: 11, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Overdue" },
  { id: 12, title: "UI Bug", assignee: "Aditi V", due: "Next Week", status: "Overdue" }
];

const ticketCategories = [
  { status: "Open Tickets", count: 3 },
  { status: "Working Tickets", count: 2 },
  { status: "Solved Tickets", count: 1 },
  { status: "Sent Tickets", count: 1 },
  { status: "Unassigned Tickets", count: 2 },
  { status: "Overdue Tickets", count: 2 },
];

export const TicketProvider = ({ children }) => {
  const [tickets] = useState(ticketsData);
  const [categories] = useState(ticketCategories);
  

  return (
    <TicketContext.Provider value={{ tickets, ticketCategories: categories }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => useContext(TicketContext);
