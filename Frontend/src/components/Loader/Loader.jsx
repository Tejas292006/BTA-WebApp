import React from 'react'
import { CircularProgress, Spinner } from "@nextui-org/react";

const Loader = () => {
    return (
        <div className="fixed backdrop-blur-sm z-[9999999] h-screen w-screen flex justify-center items-center">
            <Spinner size='md' color="current" />
        </div>
    )
}

export default Loader
