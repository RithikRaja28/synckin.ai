import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx"; // Import both AuthProvider and AuthContext
import Login from "./components/Authentication/Login.jsx";
import Signup from "./components/Authentication/SignUp.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import ProfileDashboard from "./components/Profile/ProfileDashboard.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";

// Create a PrivateRoute component to handle authentication
const PrivateRoute = ({ component: Component }) => {
  const { auth } = useContext(AuthContext); // Use AuthContext here to check authentication
  console.log(auth);
  return auth.isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/dashboard/*"
          element={<PrivateRoute component={Dashboard} />} // Pass Dashboard as a reference
        />
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
