import React, { useEffect, useState } from 'react'
import DataTableModel from './DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { snapshot_UNSTABLE, RecoilRoot } from 'recoil';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil"
import { globalLoaderAtom } from '../store';
import { unitDataState } from '../store';
import { CreateUnit, Deleteunit, Updateunit } from '../api';
import apiClient from '../api/client';

const Unit = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const [updateId, setUpdateId] = useState(null)
    const [unitData, setunitData] = useRecoilState(unitDataState)





    console.log(unitData, "unitDataState")




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
    const createunit = async (values) => {
        try {
            formik.resetForm()

            // values.ref = refcat;
            setIsLoading(true)
            const response = await CreateUnit(values);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.unitDoc)
                setunitData([...unitData, response.unitDoc]);
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



    // Delete unit
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deleteunit(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setunitData((prevData) => prevData.filter((unit) => unit.id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    const updateFormWithunitData = (unitId, updatedunitData) => {
        const unitDataexist = updatedunitData.find((element) => element.id === unitId);
        console.log(unitDataexist, updatedunitData, 'existssssssssssssssssssssss');

        formik.setValues({
            name: unitDataexist?.name,
        });
    };
    // ...

    // Use updateFormWithunitData in the useEffect
    useEffect(() => {
        updateFormWithunitData(updateId, unitData);
        setUpdated(false);
    }, [updated]);

    // ...

    // Call updateFormWithunitData wherever needed
    const handleUpdate = (unitId) => {
        try {
            setUpdated(true)
            updateFormWithunitData(unitId, unitData);

            setUpdateId(unitId)
            onOpen();

        } catch (error) {
            console.error("Error updating unit:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            // values.ref = refcat;
            setIsLoading(true)
            const response = await Updateunit(updateId, values);
            setIsLoading(false)

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.unit);

                // Optimistically update UI

                setunitData((preValue) => {
                    const updatedunits = preValue.map((unit) => {
                        return unit.id === updateId ? response.unit : unit
                    }
                    )
                    return updatedunits;
                })
                formik.setValues({
                    name: response.unit?.name,
                    
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

            console.error("Error updating unit:", error.message);
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
                await createunit(values);
                setIsLoading(false)
            }
        },
    });

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

    const setUpdate = () => {
        setUpdateId(false);
        formik.resetForm(); 
    };

    const handleOpenForCreate = () => {
        setUpdateId(null);
        formik.resetForm();
        onOpen();
    };

    const refreshData = async () => {
        try {
            const res = await apiClient.get('/api/unit/get-all-unit');
            if (res.data && res.data.units) {
                setunitData(res.data.units);
            }
        } catch (error) {
            console.error("Error refreshing units:", error);
        }
    };

    return (
        <>
            <div className="flex flex-col gap-2">
                <Modal
                    isOpen={isOpen}
                    scrollBehavior={"inside"}
                    size={"xl"}
                    className="dark:bg-[#1e1d2e]"
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
                                    {updateId ? "Update unit" : "Create unit"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-gray-50 dark:bg-[#1f1e30] border border-gray-200 dark:border-[#2b2a3f]">
                                        <div className="flex flex-col gap-3 p-6">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Unit Name</label>
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                placeholder="e.g. Meter, Kg, Piece"
                                            />
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter className="border-t border-gray-100 dark:border-[#2b2a3f]">
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
                                        className="bg-[#d8f275] text-[#1f1e30] font-font1 font-semibold hover:bg-[#c5e05c] transition"
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={unitData} onOpen={handleOpenForCreate} section={'unit'} onRefresh={refreshData} />
        </>
    )
}

export default Unit

