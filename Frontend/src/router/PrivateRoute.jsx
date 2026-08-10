import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetCurrentUser } from "../api/authApi";
import toast from "react-hot-toast";
import { Spinner } from "@nextui-org/react";
import { userAtom } from '../store';
import { useRecoilState } from "recoil";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  const validateToken = async () => {
    try {
      const response = await GetCurrentUser();
      if (response && response.success && response.data) {
        setUser(response.data);
      } else {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    } else if (!user) {
      validateToken();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm z-[9999999] h-screen w-screen flex justify-center items-center bg-slate-900/50">
        <Spinner size="lg" color="primary" label="Verifying authentication..." />
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
