import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { GetCurrentUser } from "../api/authApi";
import { Spinner } from "@nextui-org/react";
import { userAtom } from '../store';
import { useRecoilState } from "recoil";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [isValidating, setIsValidating] = useState(!user);
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      const response = await GetCurrentUser();
      if (response && response.success && response.data) {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
      setIsValidating(false);
    } else {
      validateToken();
    }
  }, []);

  if (!user && isValidating) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm z-[9999999] h-screen w-screen flex justify-center items-center bg-slate-900/50">
        <Spinner size="lg" color="primary" label="Verifying authentication..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children || <Outlet />;
};

export default PrivateRoute;

