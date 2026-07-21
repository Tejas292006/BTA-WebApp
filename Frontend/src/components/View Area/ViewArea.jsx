import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const ViewArea = ({ isOpen, onOpen, onOpenChange, onClose, data, section }) => {



    return (
        <div>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                scrollBehavior={"inside"}
                size={"3xl"}

            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-1">Viewing {section?.toUpperCase()} / <span className='text-base opacity-80'>{data?.name || data?.productName}</span> </ModalHeader>
                            <ModalBody className='max-w-full flex flex-wrap'>
                                {/* <p>{JSON.stringify(data)}</p> */}
                                <div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                        {data && Object.entries(data).map(([key, value], index) => {
                                            if (key === "experienced" || key === "verified" || key === "__v") {
                                                return null;
                                            }


                                            const isValueArray = Array.isArray(value);

                                            const renderValues = (value) => {
                                                if (section === "product") {

                                                    if (typeof value === "object" && key.toLowerCase() === "suppliername") {
                                                        return (
                                                            <div>
                                                                {value?.name || "Did not get any value"}
                                                            </div>
                                                        )
                                                    }

                                                    else if (typeof value === "object" && key.toLowerCase() === "priceperunit") {
                                                        return (
                                                            <div>
                                                                {value?.magnitude || "Did not get any value"} per {value.unit?.name || ""}
                                                            </div>
                                                        )
                                                    }

                                                    else if (typeof value === "object" && key.toLowerCase() === "category") {
                                                        return (
                                                            <div>
                                                                {value?.name || "Did not get any value"}
                                                            </div>
                                                        )
                                                    }

                                                    else if (isValueArray) {
                                                        if (typeof value === "object" && key.toLowerCase() === "productattributes") {
                                                            return (
                                                                <div>
                                                                    {value.map((item, index) => (
                                                                        <div key={index} className='grid grid-cols-2 border-2 gap-2 mb-2 p-2'>
                                                                            <span className='border-r-2'>{item.attrType?.toUpperCase() || ""}</span>
                                                                            <span>{item.attrValue || "No value"}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            );
                                                        }


                                                        return (
                                                            <div>
                                                                {value.map((item, index) => {
                                                                    if (item.src) {

                                                                        return (
                                                                            <div key={index} className='flex overflow-auto gap-4'>
                                                                                <img src={item.src} alt="" />
                                                                            </div>
                                                                        )
                                                                    }
                                                                })}
                                                            </div>
                                                        )
                                                    }

                                                    else {
                                                        return JSON.stringify(value)
                                                    }
                                                }

                                                else if (section == "supplier") {
                                                    if (value.startsWith('http') || value.startsWith('https')) {
                                                        return (
                                                            <>
                                                                <img className='w-[4rem] h-[4rem] rounded-full' src={value} alt="" srcset="" />
                                                            </>
                                                        )
                                                    }
                                                    else return value;
                                                }
                                                else if (section === "attributeValue") {
                                                    if (Array.isArray(value)) {
                                                        // Handle array of objects (e.g., attribute values)
                                                        return (
                                                            <div>
                                                                <div className='grid grid-cols-2 mb-4 gap-2 p-2 border-2'>
                                                                    <span className='border-r-2'>Category</span>
                                                                    <span>Value</span>
                                                                </div>
                                                                {value.map((item, index) => (
                                                                    <div key={index} className='grid grid-cols-2 gap-2 p-2 border-2 mb-4'>
                                                                        <span className='border-r-2'>{item.category?.name || item.category}</span>
                                                                        <span>{item.attributeValue || "No value"}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    } 

                                                    else if (typeof value === "object") {
                                                        return(
                                                            <>
                                                                {value?.name?.toUpperCase() || "No Value"}
                                                            </>
                                                        )
                                                    }
                                                    else{
                                                        return value;
                                                    }
                                                }


                                                else {
                                                    return JSON.stringify(value)
                                                }
                                            }


                                            return (
                                                <div key={index} className='flex flex-col rounded-xl  pb-4 bg-[#1f1e30] text-white min-h-[10rem]'>
                                                    <div className=' font-semibold p-4 pb-2 bg-[#d8f275] rounded-t-xl text-black'>{key?.toUpperCase() || key}</div>
                                                    <div className='text-[0.9rem] mt-6 opacity-90 px-4 break-words'>{value === "" || !value ? "No value" : renderValues(value)}</div>
                                                </div>
                                            );
                                        })}

                                        {/* {data && Object.keys(data).map((item) => {
                                            if (item === "experienced" || item === "verified") {
                                                return;
                                            }
                                            return (
                                                <div className='flex flex-col'>
                                                    <div className='border-b-2 border-black '>{item}</div>
                                                    <div className=' '>{data[item]}</div>
                                                </div>
                                            )
                                        })}

                                        {data && Object.values(data).map((item) => {
                                            if (item === "experienced" || item === "verified") {
                                                return;
                                            }
                                            return (

                                                <>
                                                    <div>{item}</div>
                                                </>
                                            )
                                        })} */}

                                    </div>
                                </div>
                            </ModalBody>
                            {/* <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter> */}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ViewArea
