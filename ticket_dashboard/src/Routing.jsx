import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const Layout = lazy(() => import("./layouts/Layout"));
const RequireAuth = lazy(() => import("./components/RequireAuth"));
const Home = lazy(() => import("./pages/Home"));
const TicketDetails = lazy(() => import("./pages/Ticketdetails"));
const Login = lazy(() => import("./pages/Login"));
const SentTicket = lazy(() => import("./pages/SentTicket"));
const InvolvedParties = lazy(() => import("./pages/InvolvedParties"));
const TicketHistory = lazy(() => import("./pages/TicketHistory"));
const Routing = () => {
    return (
        <Router basename='/ticket_dashboard'>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <Routes>
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/dashboard" element={
                        <RequireAuth>
                            <Layout />
                        </RequireAuth>
                    }>
                        <Route index element={<Home />} />
                        <Route path="/dashboard/tickets/:ticketId" element={<TicketDetails />} />
                        <Route path="/dashboard/sent_tickets" element={<SentTicket />} />
                        <Route path="/dashboard/ticket_history" element={<TicketHistory />} />
                        <Route path="/dashboard/view_tickets" element={<Home />} />
                        <Route path="/dashboard/involved_parties" element={<InvolvedParties />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
};

export default Routing;
