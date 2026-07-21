import './Header.css'
import React, { useRef, useState } from 'react'
import { userAtom } from '../../store/user/userAtom';
import { useRecoilState } from 'recoil';
import { useFormik } from 'formik'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, Input } from "@nextui-org/react";
import { updateUser, UploadProfileImage } from '../../apis/user';
import toast from 'react-hot-toast';

const Header = ({ toggleSidebar }) => {
    const [user, setUser] = useRecoilState(userAtom);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
            values = await Object.assign(values, { avatar: file })

            await updateUser(values, user._id).then(() => {
                toast.success('user updated succesfully')
                window.location.reload();
            }).catch((error) => {
                toast.error(error)
            })


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
                setImg(url);

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

    const [img, setImg] = useState(user?.avatar);


    return (
        <>
            <section className="dashboard">
                <div className="top">
                    <svg onClick={toggleSidebar} className="sidebar-toggle" viewBox="0 0 32  32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000">
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                            <title>collapse</title>
                            <desc>Created with Sketch Beta.</desc>
                            <defs> </defs>
                            <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" sketch:type="MSPage">
                                <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-360.000000, -1191.000000)" fill="#000000">
                                    <path d="M387.887,1203.04 L381.326,1203.04 L392.014,1192.4 L390.614,1191.01 L379.938,1201.64 L379.969,1195.16 C379.969,1194.61 379.526,1194.17 378.979,1194.17 C378.433,1194.17 377.989,1194.61 377.989,1195.16 L377.989,1204.03 C377.989,1204.32 378.111,1204.56 378.302,1204.72 C378.481,1204.9 378.73,1205.01 379.008,1205.01 L387.887,1205.01 C388.434,1205.01 388.876,1204.57 388.876,1204.03 C388.876,1203.48 388.434,1203.04 387.887,1203.04 L387.887,1203.04 Z M372.992,1208.99 L364.113,1208.99 C363.566,1208.99 363.124,1209.43 363.124,1209.97 C363.124,1210.52 363.566,1210.96 364.113,1210.96 L370.674,1210.96 L359.986,1221.6 L361.386,1222.99 L372.063,1212.36 L372.031,1218.84 C372.031,1219.39 372.474,1219.83 373.021,1219.83 C373.567,1219.83 374.011,1219.39 374.011,1218.84 L374.011,1209.97 C374.011,1209.68 373.889,1209.44 373.697,1209.28 C373.519,1209.1 373.27,1208.99 372.992,1208.99 L372.992,1208.99 Z" id="collapse" sketch:type="MSShapeGroup"> </path>
                                </g>
                            </g>
                        </g>
                    </svg>
                    <div className="search-box">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path opacity="0.1" d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" fill="#000" /> <path d="M15 15L21 21" stroke="#000" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /> <path d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#000" strokeWidth={2} /> </g></svg>
                        <input type="text" placeholder="Search here..." />
                    </div>
                    <img onClick={onOpen} className="cursor-pointer" src={user?.avatar ? user?.avatar : "https://i.pinimg.com/736x/ba/89/13/ba89133ce6ceae7d58168ab96b68e3e4.jpg"} alt />
                </div>
            </section>

            <Modal
                isOpen={isOpen}
                placement={"bottom"}
                size={'5xl'}
                onOpenChange={onOpenChange}
                className="bg-[#000] text-[#fff] font-font1"

            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 font-font2">Profile</ModalHeader>
                            <ModalBody>
                                <div className="max-w-fit flex flex-col gap-8 items-start">
                                    <Input
                                        {...formik.getFieldProps('username')}
                                        type="email"
                                        label="Name"
                                        defaultValue={user?.username}
                                        className="max-w-xs font-sans font-black "
                                        classNames={{
                                            label: "max-w-xs font-font1 text-[#000] mb-1 font-[600]",
                                            input: [
                                                "font-sans font-semibold"
                                            ]
                                        }}
                                    />

                                    <Input
                                        {...formik.getFieldProps('email')}
                                        type="email"
                                        label="Email"
                                        disabled
                                        value={user?.email}
                                        description="you can't change email! contact admin."
                                        classNames={{
                                            label: "max-w-xs font-font1 text-[#000] mb-1 font-[600]",
                                            input: [
                                                "font-sans font-semibold"
                                            ],
                                            description: [
                                                "font-font1 font-[#fff] font-[400] "
                                            ]
                                        }}
                                    />
                                    <Input
                                        {...formik.getFieldProps('password')}
                                        type="password"
                                        label="New Password"
                                        description="We'll never share your password with anyone else."
                                        classNames={{
                                            label: "max-w-xs font-sans text-[#000] mb-1 font-[600]",
                                            input: [
                                                "font-sans font-semibold"
                                            ],
                                            description: [
                                                "font-font1 font-[#fff] font-[400] "
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
                                            className="mt-2 font-font1 font-bold bg-[#fff]"
                                        >
                                            Select New Profile
                                        </Button>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="warning" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button className='bg-[#d8f275]' onPress={onClose}>
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


