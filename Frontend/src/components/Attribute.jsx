import React, { useEffect, useState } from 'react'
import DataTableModel from './DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { snapshot_UNSTABLE, RecoilRoot } from 'recoil';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil"
import { globalLoaderAtom } from '../store';
import { Createattribute, Deleteattribute, Updateattribute } from '../api';
import { attributeDataState } from '../store';
import apiClient from '../api/client';

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

    const INITIAL_VISIBLE_COLUMNS = ["id", "name", "verified", "actions"];

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
                setattributeData((prevData) => prevData.filter((attribute) => attribute.id !== id));

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
            const attributeDataexist = attributeData.find((element) => element.id === attributeId);
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
                        return attribute.id === updateId ? response.attribute : attribute
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

    const handleCloseModal = () => {
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
        onOpenChange(false);
        setUpdateId(null);
        formik.resetForm();
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleGlobalCloseCapture = (e) => {
            const closeBtn = e.target.closest(
                'button[aria-label="Close"], [data-slot="close-button"], [data-modal-close="true"], .close-modal-trigger'
            );
            if (closeBtn) {
                e.stopPropagation();
                e.preventDefault();
                if (document.activeElement && typeof document.activeElement.blur === 'function') {
                    document.activeElement.blur();
                }
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                handleCloseModal();
            }
        };

        document.addEventListener('pointerdown', handleGlobalCloseCapture, true);
        return () => {
            document.removeEventListener('pointerdown', handleGlobalCloseCapture, true);
        };
    }, [isOpen]);

    const refreshData = async () => {
        try {
            const res = await apiClient.get('/api/attribute/get-all-attribute');
            if (res.data && res.data.attributes) {
                setattributeData(res.data.attributes);
            }
        } catch (error) {
            console.error("Error refreshing attributes:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                <Modal
                    isOpen={isOpen}
                    scrollBehavior={"inside"}
                    size={"xl"}
                    className="dark:bg-[#121214]"
                    onOpenChange={(newState) => {
                        onOpenChange(newState);
                        if (!newState) {
                            handleCloseModal();
                        }
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    {updateId ? "Update attribute" : "Create attribute"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-gray-50 dark:bg-[#161619] border border-gray-200 dark:border-[#222226]">
                                        <div className="flex flex-col gap-3 p-6">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Attribute Name</label>
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-white dark:bg-[#18181b] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#2a2a30] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                placeholder="e.g. Cotton, Silk, Polyester"
                                            />
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter className="border-t border-gray-100 dark:border-[#222226]">
                                    <Button
                                        color="danger" variant="light"
                                        data-modal-close="true"
                                        className="close-modal-trigger font-font1"
                                        onPointerDown={(e) => {
                                            e.stopPropagation();
                                            handleCloseModal();
                                        }}
                                        onPress={handleCloseModal}
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        className="bg-[#d8f275] text-black font-font1 font-semibold hover:bg-[#c5e05c] transition"
                                        onPress={formik.handleSubmit}
                                    >
                                        {updateId ? "Update" : "Save"}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={attributeData} onOpen={onOpen} section={'attribute'} onRefresh={refreshData} />
        </>
    )
}

export default Attribute

