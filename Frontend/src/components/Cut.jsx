import React, { useEffect, useState } from 'react'
import DataTableModel from './DataTableModel';
import { Modal, Autocomplete, AutocompleteItem, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, } from "recoil"
import { globalLoaderAtom } from '../store';
import { cutDataState } from '../store';
import { Createcut, Deletecut, Updatecut } from '../api';
import { categoryDataState } from '../store';
import apiClient from '../api/client';


const Cut = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();
    const [cutData, setcutData] = useRecoilState(cutDataState)
    const [updateId, setUpdateId] = useState(null)
    const [categoriesData, setCategoriesData] = useRecoilState(categoryDataState)
    const [refcat, setrefcat] = useState('')
    const [updated, setUpdated] = useState(false)



    // Data Format
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NAME", uid: "name", sortable: true },
        { name: "Linked Category", uid: "ref", sortable: true },
        { name: "isNameNumercal", uid: "isNameNumerical", sortable: true },
        { name: "ACTIONS", uid: "actions" },
    ];

    const statusOptions = [
        { name: "Disabled", uid: "true" },
        { name: "Active", uid: "false" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["id", "name", "ref", "isNameNumerical", "actions"];

    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);



    // Create The cut
    const createcut = async (values) => {
        try {
            // Client-side duplicate check — same name (case-insensitive)
            const duplicate = cutData.find(
                c => c.name?.trim().toLowerCase() === values.name?.trim().toLowerCase()
            );
            if (duplicate) {
                toast.error('A cut with this name already exists.');
                return;
            }

            values.ref = refcat;
            setIsLoading(true)
            const response = await Createcut(values);
            setIsLoading(false)

            if (response.success) {
                toast.success(response.message);
                // Use functional updater so we always append to latest state
                setcutData(prev => [...prev, response.cutDoc]);
                onOpenChange(false);
                setUpdateId(null);
                formik.resetForm();
                setrefcat('');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
        }
    }


    // Delete cut
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deletecut(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setcutData((prevData) => prevData.filter((cut) => cut.id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }
    // Call updateFormWithCutData wherever needed
    const handleUpdate = (cutId) => {
        try {
            const cutDataexist = cutData.find((element) => element.id === cutId);
            console.log(cutDataexist, 'existssssssssssssssssssssss');
            setrefcat(() => (cutDataexist?.ref))
    
            formik.setValues({
                name: cutDataexist?.name,
                isNameNumerical: cutDataexist?.isNameNumerical,
            });
            setUpdateId(cutId)
            onOpen();

        } catch (error) {
            console.error("Error updating cut:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            // Client-side duplicate check (exclude the current item being edited)
            const duplicate = cutData.find(
                c => c.name?.trim().toLowerCase() === values.name?.trim().toLowerCase()
                    && c.ref?.id === refcat
                    && c.id !== updateId
            );
            if (duplicate) {
                toast.error('A cut with this name already exists in this category.');
                return;
            }

            values.ref = refcat;
            setIsLoading(true);
            const response = await Updatecut(updateId, values);
            setIsLoading(false);

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.cut);

                // Optimistically update UI
                const updatedcuts = cutData.map((cut) =>
                    cut.id === updateId ? response.cut : cut
                );

                setcutData(updatedcuts);
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
        console.error("Error updating cut:", error.message);
        toast.error(error.message);
    };


    const formik = useFormik({
        initialValues: {
            name: '',
            isNameNumerical: false,
            ref: ''
        },
        onSubmit: async values => {
            if (updateId) {
                setIsLoading(true)
                await handleUpdateSubmit(values);
                setIsLoading(false)
            } else {
                setIsLoading(true)
                await createcut(values);
                setIsLoading(false)
            }
        },
    });
    const setUpdate = () => {
        setUpdateId(false)
        formik.resetForm();
        setrefcat('')
    }

    // Wrapped onOpen for the "Add New" button — always clears form first
    const handleOpenForCreate = () => {
        setUpdateId(null);
        formik.resetForm();
        setrefcat('');
        onOpen();
    };

    const refreshData = async () => {
        try {
            const res = await apiClient.get('/api/cut/get-all-cut');
            if (res.data && res.data.cuts) {
                setcutData(res.data.cuts);
            }
        } catch (error) {
            console.error("Error refreshing cuts:", error);
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
                            setUpdateId(null);
                            formik.resetForm();
                            setrefcat('');
                        }
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    {updateId ? "Update cut" : "Create cut"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-gray-50 dark:bg-[#1f1e30] border border-gray-200 dark:border-[#2b2a3f]">
                                        <div className="flex flex-col gap-3 p-6">
                                            <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Cut Name</label>
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                placeholder="e.g. Single, Double, Triple"
                                            />
                                            </div>
                                            <Autocomplete
                                                classNames={{
                                                    base: "max-w-full border-[#fff] ",
                                                    listboxWrapper: "max-h-[320px]",
                                                    selectorButton: "text-[#fff]",
                                                }}
                                                onSelectionChange={setrefcat}
                                                value={refcat}
                                                defaultItems={categoriesData}
                                                selectedKey={refcat}
                                                inputProps={{
                                                    classNames: {
                                                        input: "ml-1 text-[#fff] font-font1",
                                                        inputWrapper: "h-[50px]",
                                                        label: "text-[#fff]",
                                                    },
                                                }}
                                                listboxProps={{
                                                    hideSelectedIcon: true,
                                                    itemClasses: {
                                                        base: [
                                                            "rounded-medium",
                                                            "text-[#000]",
                                                            "transition-opacity",
                                                            "data-[hover=true]:text-foreground",
                                                            "dark:data-[hover=true]:bg-default-50",
                                                            "data-[pressed=true]:opacity-70",
                                                            "data-[hover=true]:bg-default-200",
                                                            "data-[selectable=true]:focus:bg-default-100",
                                                            "data-[focus-visible=true]:ring-default-500",
                                                        ],
                                                    },
                                                }}
                                                aria-label="Select an Category"
                                                placeholder="Enter an Category"
                                                popoverProps={{
                                                    offset: 10,
                                                    shouldCloseOnInteractOutside: () => true,
                                                    classNames: {
                                                        base: "rounded-large",
                                                        content: "p-1  border-none bg-background",

                                                    },
                                                }}
                                                startContent={<svg
                                                    aria-hidden="true"
                                                    fill="none"
                                                    focusable="false"
                                                    height={20}
                                                    role="presentation"
                                                    viewBox="0 0 24 24"
                                                    width={20}
                                                    color={"#fff"}
                                                >
                                                    <path
                                                        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2.5}
                                                    />
                                                    <path
                                                        d="M22 22L20 20"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2.5}
                                                    />
                                                </svg>}
                                                variant="bordered"
                                            >
                                                {(item) => (
                                                    <AutocompleteItem key={item.id} textValue={item.name}>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-2 items-center">
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">{item.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AutocompleteItem>
                                                )}
                                            </Autocomplete>

                                            <label className="flex cursor-pointer items-center justify-between p-1 text-[#fff]">
                                                isNameNumerical
                                                <div className="relative inline-block">
                                                    <input
                                                        onChange={(e) => formik.setFieldValue("isNameNumerical", e.target.checked)}
                                                        name="isNameNumercal" // Associate the input with the form field 'verified'
                                                        checked={formik.values.isNameNumerical} // Set the checked state from formik values
                                                        className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                                        type="checkbox"
                                                    />
                                                    <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300" />
                                                </div>
                                            </label>
                                            {/* <label className="flex cursor-pointer items-center justify-between p-1 text-[#fff]">
                                                isNameNumercal
                                                <div className="relative inline-block">
                                                    <input
                                                        onChange={(e) => formik.setFieldValue("isNameNumercal", e.target.checked)}
                                                        name="isNameNumerical" // Associate the input with the form field 'experienced'
                                                        checked={formik.values.isNameNumerical} // Set the checked state from formik values
                                                        className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                                        type="checkbox"
                                                    />
                                                    <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300" />
                                                </div>
                                            </label> */}
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter className="border-t border-gray-100 dark:border-[#2b2a3f]">
                                    <Button
                                        color="danger" variant="light"
                                        className="font-font1"
                                        onPress={onClose}
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={cutData} onOpen={handleOpenForCreate} section={'cut'} onRefresh={refreshData} />
        </>
    )
}

export default Cut

