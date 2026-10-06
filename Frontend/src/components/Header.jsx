import './Header.css'
import React, { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UilAngleLeft } from '@iconscout/react-unicons'
import { userAtom } from '../store';
import { useRecoilState } from 'recoil';
import { useFormik } from 'formik'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, Input } from "@nextui-org/react";
import { updateUser, UploadProfileImage } from '../api';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiUser } from 'react-icons/fi'

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useRecoilState(userAtom);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: user?.username,
            email: user?.email,
            password: '',
        },

        // validate: updateValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            if (!values.password) {
                delete values.password;
            }

            values = await Object.assign(values, { avatar: file })

            const response = await updateUser(values, user.id)

            if (response?.success) {
                toast.success(response.message || 'user updated sucessfully')
                window.location.reload();
            } else {
                toast.error(typeof response === 'string' ? response : response?.message || 'Update failed. Please try again.')
            }
        },

    })

    //   function handleFileInputChange(event) {
    //     const selectedFile = event.target.files[0];
    //     uploadImage(selectedFile);
    //    }

    const uploadImage = async (event) => {
        const selectedFile = event.target.files[0];
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append("profile_image", selectedFile);
            const response = await UploadProfileImage(formData);
            if (response.success) {
                toast.success('image uplaoded successfully')
                const url = response.url;
                setFile(url);

            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };



    const fileInputRef = useRef(null);

    const handleSelectPhoto = () => {
        fileInputRef.current.click();
    };
    const [file, setFile] = useState(user?.avatar);


    return (
        <>
            <section className="dashboard">
                <div className="top">
                    <div className="flex items-center gap-3">
                        <svg onClick={toggleSidebar} className="sidebar-toggle cursor-pointer" viewBox="0 0 32  32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000">
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                                <title>collapse</title>
                                <desc>Created with Sketch Beta.</desc>
                                <defs> </defs>
                                <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" sketch:type="MSPage">
                                    <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-360.000000, -1191.000000)" fill="#000000">
                                        <path d="M387.887,1203.04 L381.326,1203.04 L392.014,1192.4 L390.614,1191.01 L379.938,1201.64 L379.969,1195.16 C379.969,1194.61 379.526,1194.17 378.979,1194.17 C378.433,1194.17 377.989,1194.61 377.989,1195.16 L377.989,1204.03 C377.989,1204.32 378.111,1204.56 378.302,1204.72 C378.481,1204.9 378.73,1205.01 379.008,1205.01 L387.887,1205.01 C388.434,1205.01 388.876,1204.57 388.876,1204.03 C388.876,1203.48 388.434,1203.04 387.887,1203.04 L387.887,1203.04 Z M372.992,1208.99 L364.113,1208.99 C363.566,1208.99 363.124,1209.43 363.124,1209.97 C363.124,1210.52 363.566,1210.96 L364.113,1210.96 L370.674,1210.96 L359.986,1221.6 L361.386,1222.99 L372.063,1212.36 L372.031,1218.84 C372.031,1219.39 372.474,1219.83 373.021,1219.83 C373.567,1219.83 374.011,1219.39 374.011,1218.84 L374.011,1209.97 C374.011,1209.68 373.889,1209.44 373.697,1209.28 C373.519,1209.1 373.27,1208.99 372.992,1208.99 L372.992,1208.99 Z" id="collapse" sketch:type="MSShapeGroup"> </path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        {location.pathname !== '/' && (
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all shadow-sm border border-gray-200 cursor-pointer dark:text-white dark:bg-[#1e1d2e] dark:hover:bg-[#232233] dark:border-[#2b2a3f]"
                                title="Go Back"
                            >
                                <UilAngleLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <span className="font-font1 font-semibold">Back</span>
                            </button>
                        )}
                    </div>
                    <button onClick={onOpen} className="profile-trigger" title="Profile">
                        {user?.avatar ? (
                            <img src={user?.avatar} alt="Profile" />
                        ) : (
                            <FiUser size={20} />
                        )}
                    </button>
                </div>
            </section>

            <Modal
                isOpen={isOpen}
                placement={"bottom"}
                size={'5xl'}
                onOpenChange={onOpenChange}
                className="bg-white text-black dark:bg-[#1e1d2e] dark:text-white font-font1"

            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 font-font2">Profile</ModalHeader>
                            <ModalBody>
                                <div className="max-w-fit flex flex-col gap-8 items-start">
                                    <Input
                                        {...formik.getFieldProps('username')}
                                        type="text"
                                        label="Name"
                                        className="max-w-xs font-sans font-black "
                                        classNames={{
                                            label: "max-w-xs font-font1 text-gray-700 dark:text-gray-300 mb-1 font-[600]",
                                            input: [
                                                "font-sans font-semibold text-gray-800 dark:text-white"
                                            ]
                                        }}
                                    />

                                    <Input
                                        {...formik.getFieldProps('email')}
                                        type="email"
                                        label="Email (Login ID)"
                                        description="Use this email to log in."
                                        classNames={{
                                            label: "max-w-xs font-font1 text-gray-700 dark:text-gray-300 mb-1 font-[600]",
                                            input: [
                                                "font-sans font-semibold text-gray-800 dark:text-white"
                                            ],
                                            description: [
                                                "font-font1 text-gray-500 dark:text-gray-400 font-[400] "
                                            ]
                                        }}
                                    />
                                    <Input
                                        {...formik.getFieldProps('password')}
                                        type={showPassword ? "text" : "password"}
                                        label="New Password"
                                        description="Enter a new password to change the one you use to log in. Leave blank to keep the current password."
                                        endContent={
                                            <button
                                                type="button"
                                                className="cursor-pointer text-gray-600 dark:text-gray-300"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                tabIndex={-1}
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        }
                                        classNames={{
                                            label: "max-w-xs font-sans text-gray-700 dark:text-gray-300 mb-1 font-[600]",
                                            input: [
                                                "font-sans font-semibold text-gray-800 dark:text-white"
                                            ],
                                            description: [
                                                "font-font1 text-gray-500 dark:text-gray-400 font-[400] "
                                            ]
                                        }}
                                    />
                                    {/* Photo File Input */}
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={uploadImage}
                                    />
                                    <div className="flex gap-2 justify-center items-center">
                                        {/* Current Profile Photo */}
                                        <div>
                                            <img src={user?.avatar} className="w-20 h-20 mx-auto rounded-full shadow" alt="Current Profile" />
                                        </div>
                                        <Button type="button"
                                            variant='flat'
                                            onClick={handleSelectPhoto}
                                            className="mt-2 font-font1 font-bold bg-white dark:bg-[#232233] text-gray-800 dark:text-white"
                                        >
                                            Select New Profile
                                        </Button>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="warning"
                                    variant="light"
                                    data-modal-close="true"
                                    className="close-modal-trigger font-font1"
                                    onPointerDown={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    onPress={onClose}
                                    onClick={onClose}
                                >
                                    Close
                                </Button>
                                <Button className='bg-[#d8f275] text-[#1f1e30]' onPress={formik.handleSubmit}>
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </>
    )
}

export default Header


