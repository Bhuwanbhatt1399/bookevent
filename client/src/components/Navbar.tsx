import  { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

 const Navbar = () => {
  

  // Correctly getting user and logout from context
   const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthContext not found");
  }

  const { user, logout } = context;

  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    logout();          // logout from context
    navigate("/login"); // redirect to login
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">

          {/* Logo */}
          <Link  to="/"  className="text-white text-2xl font-bold flex items-center gap-2" >
          
            <FaTicketAlt />
            Eventora
          </Link>

          {/* Menu */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">

            {/* Events */}
            <Link to="/" className="text-gray-200 hover:text-white transition cursor-pointer"
            >
              Events
            </Link>

            {/* If user logged in */}
            {user ? (
              <>
                {/* Dashboard */}
                <Link to={user.role === "admin" ? "/admin" : "/dashboard"} className="text-gray-200 hover:text-white transition"
                >
                  Dashboard
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}  className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </>

            ) : (
              <>
                {/* Login */}
                <Link to="/login" className="text-gray-200 hover:text-white transition"
                >
                  Login
                </Link>

                {/* Register */}
                <Link to="/register"  className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
