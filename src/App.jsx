import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from "./components/Signin.jsx";
import Home from "./components/Home.jsx";

import ViewCustomer from "./components/ViewCustomer.jsx";
import StaffManagement from "./components/StaffManagement.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/Signin' element={<SignIn />} />
                <Route path='/Staff' element={<StaffManagement />} />
                <Route path='/Customer/:id' element={<ViewCustomer/>}/>
                <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
            </Routes>
        </Router>
    );
}

export default App;
