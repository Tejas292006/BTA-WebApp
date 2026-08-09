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
      if (response.success) {
        setUser(response.data);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
        if (response.message !== "jwt expired") {
          console.log(response.message);
        }
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (user) return;
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      toast.error("You are unauthorised to use this Website, Login to proceed");
      navigate("/login");
    }
  }, []);

  return (
    <>
      {user ? (
        <div>{children}</div>
      ) : (
        <div className="fixed backdrop-blur-sm z-[9999999] h-screen w-screen flex justify-center items-center">
          <Spinner size="md" color="current" />
        </div>
      )}
    </>
  );
};

export default PrivateRoute;
