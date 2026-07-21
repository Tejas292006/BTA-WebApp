import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createsupplier, Deletesupplier, Updatesupplier } from '../../apis/supllier';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useRecoilState, useRecoilValue } from "recoil"
import { suppliersDataState } from "../../store/supplier/supplierAtom"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';

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
                setsupplierData((prevData) => prevData.filter((supplier) => supplier._id !== id));

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
        const supplierDataexist = updatedsupplierData.find((element) => element._id === supplierId);
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
                    supplier._id === updateId ? response.supplier : supplier
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

    const setUpdate = () => {
        setUpdateId(false)
        formik.resetForm();
    }


    console.log(formik.values, "values")
    // console.log("supplier data outside: ", suppliersData)

    return (
        <>
            <div className="flex flex-col gap-2">
                <Modal
                    isOpen={isOpen}
                    scrollBehavior={"inside"}
                    size={"xl"}
                    onOpenChange={(newState) => {
                        onOpenChange(newState);
                        if (!newState) {
                            formik.setValues({})
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
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="Supplier name.."
                                            />
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('brand')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff] mt-2"
                                                placeholder="Brand name.."
                                            />
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('address')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff] mt-2"
                                                placeholder="Address.."
                                            />

                                            <label className="flex cursor-pointer items-center justify-between p-1 text-[#fff]">
                                                Experienced
                                                <div className="relative inline-block">
                                                    <input
                                                        onChange={(e) => formik.setFieldValue("experienced", e.target.checked)}
                                                        name="experienced" // Associate the input with the form field 'verified'
                                                        checked={formik.values.experienced} // Set the checked state from formik values
                                                        className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                                        type="checkbox"
                                                    />
                                                    <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300" />
                                                </div>
                                            </label>
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={supplierData} onOpen={onOpen} section={'supplier'} />
        </>
    )
}

export default Suppliers
