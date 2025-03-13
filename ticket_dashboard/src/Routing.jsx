import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const Layout = lazy(() => import("./layouts/Layout"));
const RequireAuth = lazy(() => import("./components/RequireAuth"));
const Home = lazy(() => import("./pages/Home"));
const TicketDetails = lazy(() => import("./pages/Ticketdetails"));
const Login = lazy(() => import("./pages/Login"));

const Routing = () => {

    return (
        <Router>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                <Routes>
                    <Route path="/login" element={<Login />}  /> 
                    <Route path="/" element={ <RequireAuth> <Layout /></RequireAuth>}>
                        <Route index element={<Home />} />
                        <Route path="tickets/:ticketId" element={<TicketDetails />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
};

export default Routing;
