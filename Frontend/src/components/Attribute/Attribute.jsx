import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { snapshot_UNSTABLE, RecoilRoot } from 'recoil';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { Createattribute, Deleteattribute, Updateattribute } from '../../apis/attribute';
import { attributeDataState } from '../../store/attribute/attributeAtom';

const Attribute = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const [updateId, setUpdateId] = useState(null)
    const [attributeData, setattributeData] = useRecoilState(attributeDataState)





    console.log(attributeData, "attributeDataState")




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
    const createattribute = async (values) => {
        try {
            formik.resetForm()

            // values.ref = refcat;
            setIsLoading(true)
            const response = await Createattribute(values);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.attributeDoc)
                setattributeData([...attributeData, response.attributeDoc]);
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



    // Delete attribute
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deleteattribute(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setattributeData((prevData) => prevData.filter((attribute) => attribute._id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    const handleUpdate = (attributeId) => {
        try {
            const attributeDataexist = attributeData.find((element) => element._id === attributeId);
            console.log(attributeDataexist, 'existssssssssssssssssssssss');

            formik.setValues({
                name: attributeDataexist?.name,
            });
            setUpdateId(attributeId)
            onOpen();

        } catch (error) {
            console.error("Error updating attribute:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            // values.ref = refcat;
            setIsLoading(true)
            const response = await Updateattribute(updateId, values);
            setIsLoading(false)

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.attribute);

                // Optimistically update UI

                setattributeData((preValue) => {
                    const updatedattributes = preValue.map((attribute) => {
                        return attribute._id === updateId ? response.attribute : attribute
                    }
                    )
                    return updatedattributes;
                })
                formik.setValues({
                    name: response.attribute?.name,

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

            console.error("Error updating attribute:", error.message);
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
                await createattribute(values);
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
                                    {updateId ? "Update attribute" : "Create attribute"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="attribute name.."
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={attributeData} onOpen={onOpen} section={'attribute'} />
        </>
    )
}

export default Attribute

