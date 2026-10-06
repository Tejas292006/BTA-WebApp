import React, { useEffect, useState } from 'react'
import DataTableModel from './DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createsupplier, Deletesupplier, Updatesupplier } from '../api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

import { useRecoilState, useRecoilValue } from "recoil"
import { suppliersDataState } from '../store'
import { globalLoaderAtom } from '../store';

const Suppliers = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const [updateId, setUpdateId] = useState(null)
    const [updated, setUpdated] = useState(false)

    const [supplierData, setsupplierData] = useRecoilState(suppliersDataState)
    // console.log(suppliersData || [])

    // Data Format
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", sortable: true },
        { name: "BRAND", uid: "brand", sortable: true },
        { name: "EXPERIENCED", uid: "experienced", sortable: true },
        { name: "ADDRESS", uid: "address", sortable: true },
        { name: "VERIFIED", uid: "verified", sortable: true },
        { name: "ACTIONS", uid: "actions" },
    ];

    const statusOptions = [
        { name: "Disabled", uid: "true" },
        { name: "Active", uid: "false" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["name", "brand", "verified", "experienced", "actions"];

    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);

    // Create The Supplier
    const creatsupplier = async (values) => {
        try {
            formik.resetForm();
            setIsLoading(true)
            console.log(values, 'vvvvvvvv')

            const response = await Createsupplier(values);
            setIsLoading(false)
            // dispatch(SetLoader(false));
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.supplierDoc)
                setsupplierData([...supplierData, response.supplierDoc]);
                onOpenChange(false)
                setUpdateId(null); // Reset update ID when modal is closed
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            // dispatch(SetLoader(false));
            setIsLoading(false)
            console.log(error.message);
            toast.error(error.message);
        }
    }



    // Delete Supplier
    const deleteItem = async (id) => {
        try {
            setIsLoading(true)
            const response = await Deletesupplier(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setsupplierData((prevData) => prevData.filter((supplier) => supplier.id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)
            toast.error(error.message)
        }
    }

    const updateFormWithsupplierData = (supplierId, updatedsupplierData) => {
        const supplierDataexist = updatedsupplierData.find((element) => element.id === supplierId);
        console.log(supplierDataexist, updatedsupplierData, 'existssssssssssssssssssssss');

        formik.setValues({
            name: supplierDataexist?.name,
            brand: supplierDataexist?.brand,
            address: supplierDataexist?.address,
            experienced: supplierDataexist?.experienced,

        });
    };
    // ...

    // Use updateFormWithsupplierData in the useEffect
    useEffect(() => {
        updateFormWithsupplierData(updateId, supplierData);
        setUpdated(false);
    }, [updated]);



    // Call updateFormWithsupplierData wherever needed
    const handleUpdate = (supplierId) => {
        try {
            setUpdated(true)
            updateFormWithsupplierData(supplierId, supplierData);

            setUpdateId(supplierId)
            onOpen();

        } catch (error) {
            console.error("Error updating supplier:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {

            setIsLoading(true);
            const response = await Updatesupplier(updateId, values);
            setIsLoading(false);

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.supplier);

                // Optimistically update UI
                const updatedsuppliers = supplierData.map((supplier) =>
                    supplier.id === updateId ? response.supplier : supplier
                );

                setsupplierData(updatedsuppliers);
                formik.resetForm();

                // Close the modal and reset update ID
                onOpenChange(false);
                setUpdateId(null);

            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            handleUpdateError(error);
        }
    };

    const handleUpdateError = (error) => {
        setIsLoading(false);
        console.error("Error updating supplier:", error.message);
        toast.error(error.message);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            brand: '',
            address: '',
            experienced: false,
        },
        onSubmit: async values => {
            if (updateId) {
                setIsLoading(true)
                await handleUpdateSubmit(values);
                setIsLoading(false)

            } else {
                setIsLoading(true)
                await creatsupplier(values);
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
            const res = await apiClient.get('/api/supplier/get-all-supplier');
            if (res.data && res.data.suppliers) {
                setsupplierData(res.data.suppliers);
            }
        } catch (error) {
            console.error("Error refreshing suppliers:", error);
        }
    };


    console.log(formik.values, "values")
    // console.log("supplier data outside: ", suppliersData)

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
                                    {updateId ? "Update Supplier" : "Create Supplier"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-gray-50 dark:bg-[#1f1e30] border border-gray-200 dark:border-[#2b2a3f]">
                                        <div className="flex flex-col gap-4 p-6">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Supplier Name</label>
                                                <input
                                                    autoFocus
                                                    {...formik.getFieldProps('name')}
                                                    className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                    placeholder="e.g. Ram Textiles"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Brand Name</label>
                                                <input
                                                    {...formik.getFieldProps('brand')}
                                                    className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                    placeholder="e.g. Cotton King"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Address</label>
                                                <input
                                                    {...formik.getFieldProps('address')}
                                                    className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                    placeholder="e.g. Surat, Gujarat"
                                                />
                                            </div>

                                            <label className="flex cursor-pointer items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-[#3a3950] bg-white dark:bg-[#232233] text-gray-800 dark:text-[#f7f7f5]">
                                                <span className="font-font1 text-sm font-medium">Experienced Supplier</span>
                                                <div className="relative inline-block">
                                                    <input
                                                        onChange={(e) => formik.setFieldValue("experienced", e.target.checked)}
                                                        name="experienced"
                                                        checked={formik.values.experienced}
                                                        className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-200 dark:border-[#3a3950] bg-gray-200 dark:bg-[#1f1e30] checked:border-[#d8f275] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8f275] focus-visible:ring-offset-2"
                                                        type="checkbox"
                                                    />
                                                    <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-400 dark:bg-slate-500 transition-all duration-200 peer-checked:left-7 peer-checked:bg-[#d8f275]" />
                                                </div>
                                            </label>
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={supplierData} onOpen={handleOpenForCreate} section={'supplier'} onRefresh={refreshData} />
        </>
    )
}

export default Suppliers
