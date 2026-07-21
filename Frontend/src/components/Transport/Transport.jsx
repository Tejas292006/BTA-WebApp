import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { snapshot_UNSTABLE, RecoilRoot } from 'recoil';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { transportDataState } from '../../store/transport/transportAtom';
import { Createtransport, Deletetransport, Updatetransport } from '../../apis/transport';

const Transport = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const [updateId, setUpdateId] = useState(null)
    const [transportData, settransportData] = useRecoilState(transportDataState)





    console.log(transportData, "transportDataState")




    // Data Format
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", sortable: true },
        { name: "VERIFIED", uid: "verified", sortable: true },
        { name: "ACTIONS", uid: "actions" },
    ];

    const statusOptions = [
        { name: "Disabled", uid: "true" },
        { name: "Active", uid: "false" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["name", "verified", "actions"];

    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);
    const [updated, setUpdated] = useState(false)

    // Create The width
    const createtransport = async (values) => {
        try {
            formik.resetForm()

            // values.ref = refcat;
            setIsLoading(true)
            const response = await Createtransport(values);
            console.log(values,'vvvvvvvvvvvvvvvvvvvvvv')
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/customers');
                console.log(response.transportDoc)
                settransportData([...transportData, response.transportDoc]);
                onOpenChange(false)
                setUpdateId(null); // Reset update ID when modal is closed

            } else {
                throw new Error(response.message);

            }
        } catch (error) {
            // dispatch(SetLoader(false));
            toast.error(error.message,);


        }
    }



    // Delete transport
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deletetransport(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                settransportData((prevData) => prevData.filter((transport) => transport._id !== id));

                navigate('/customers');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    const updateFormWithtransportData = (transportId, updatedtransportData) => {
        const transportDataexist = updatedtransportData.find((element) => element._id === transportId);
        console.log(transportDataexist, updatedtransportData, 'existssssssssssssssssssssss');

        formik.setValues({
            name: transportDataexist?.name,
        });
    };
    // ...

    // Use updateFormWithtransportData in the useEffect
    useEffect(() => {
        updateFormWithtransportData(updateId, transportData);
        setUpdated(false);
    }, [updated]);

    // ...

    // Call updateFormWithtransportData wherever needed
    const handleUpdate = (transportId) => {
        try {
            setUpdated(true)
            updateFormWithtransportData(transportId, transportData);

            setUpdateId(transportId)
            onOpen();

        } catch (error) {
            console.error("Error updating transport:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            // values.ref = refcat;
            setIsLoading(true)
            const response = await Updatetransport(updateId, values);
            setIsLoading(false)

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.transport);

                // Optimistically update UI

                settransportData((preValue) => {
                    const updatedtransports = preValue.map((transport) => {
                        return transport._id === updateId ? response.transport : transport
                    }
                    )
                    return updatedtransports;
                })
                formik.setValues({
                    name: response.transport?.name,
                    
                }
                )
                console.log(formik.values, 'ffffffffffffffffffffffffffffffff')
                // Close the modal and reset update ID
                onOpenChange(false);
                setUpdateId(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            console.error("Error updating transport:", error.message);
            toast.error(error.message);
        }
    };



    const formik = useFormik({
        initialValues: {
            name: '',
        
        },
        onSubmit: async values => {
            if (updateId) {
                setIsLoading(true)
                await handleUpdateSubmit(values);
                setIsLoading(false)
            } else {
                setIsLoading(true)
                await createtransport(values);
                setIsLoading(false)
            }
        },
    });
    const setUpdate = () => {
        setUpdateId(false)
        formik.resetForm(); 
        // setrefcat('')

    }
    return (
        <>
            <div className="flex flex-col gap-2">
                <Modal
                    isOpen={isOpen}
                    scrollBehavior={"inside"}
                    size={"xl"}
                    onOpenChange={(newState) => {
                        onOpenChange(newState);
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    {updateId ? "Update transport" : "Create transport"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="transport name.."
                                            />

                                           
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger" variant="light"
                                        onPress={onClose}
                                        onClick={setUpdate}
                                    >
                                        Close
                                    </Button>
                                    <Button color="primary"
                                        className="bg-foreground text-background font-font1"
                                        onClick={formik.handleSubmit}



                                    >
                                        {updateId ? "Update" : "Create "}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={transportData} onOpen={onOpen} section={'transport'} />
        </>
    )
}

export default Transport

