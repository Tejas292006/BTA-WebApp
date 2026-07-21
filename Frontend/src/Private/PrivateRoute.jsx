import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { GetCurrentUser } from '../apis/user';
import toast from 'react-hot-toast';
import { Spinner } from '@nextui-org/react';
import { userAtom } from '../store/user/userAtom';
import { useRecoilState } from 'recoil';

const PrivateRoute = ({ children }) => {

    const [user, setUser] = useRecoilState(userAtom);

    const navigate = useNavigate();

    const validateToken = async () => {
        try {
            const response = await GetCurrentUser();
            // console.log(response);
            if (response.success) {
                setUser(response.data); // Set the user in the Recoil atom
            } else {
                if (response.message === "jwt expired") {
                    // Remove the token from localStorage
                    localStorage.removeItem("token");
                    // Redirect to login
                    navigate("/login");
                } else {
                    // Handle other errors
                    localStorage.removeItem("token");
                    navigate("/login");
                    console.log(response.message);
                }
            }
        } catch (error) {
            // Remove the token from localStorage
            localStorage.removeItem("token");
            navigate("/login");
            console.log(error.message);
        }
    }



    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
        } else {
            toast.error("You are unauthorised to use this Website , Login to proceed");
            navigate("/login")
        }

    }, []);

    return (
        <>
            {user ? (
                <div className=''>
                    {children}
                </div>
            ) : (
                <div className="fixed backdrop-blur-sm z-[9999999] h-screen w-screen flex justify-center items-center">
                    <Spinner size='md' color="current" />
                </div>
            )
            }
        </>
    )
}


export default PrivateRoute;
