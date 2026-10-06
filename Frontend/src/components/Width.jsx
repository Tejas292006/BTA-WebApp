import React, { useEffect, useState } from 'react'
import DataTableModel from './DataTableModel';
import { Modal, Autocomplete, AutocompleteItem, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, } from "recoil"
import { globalLoaderAtom } from '../store';
import { widthDataState } from '../store';
import { Createwidth, Deletewidth, Updatewidth } from '../api';
import { categoryDataState } from '../store';
import apiClient from '../api/client';


const Width = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();
    const [widthData, setwidthData] = useRecoilState(widthDataState)
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



    // Create The width
    const createwidth = async (values) => {
        try {

            values.ref = refcat;
            setIsLoading(true)
            const response = await Createwidth(values);
            console.log(values)

            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.widthDoc)
                setwidthData([...widthData, response.widthDoc]);
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



    // Delete width
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deletewidth(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setwidthData((prevData) => prevData.filter((width) => width.id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    const updateFormWithwidthData = (widthId, updatedwidthData) => {
        const widthDataexist = updatedwidthData.find((element) => element.id === widthId);
        const catId = widthDataexist?.categoryId || widthDataexist?.category?.id || (typeof widthDataexist?.ref === 'object' ? widthDataexist?.ref?.id : widthDataexist?.ref) || '';
        setrefcat(catId ? String(catId) : '');

        formik.setValues({
            name: widthDataexist?.name || '',
        });
    };
    // ...

    // Use updateFormWithwidthData in the useEffect
    useEffect(() => {
        if (updateId) {
            updateFormWithwidthData(updateId, widthData);
            setUpdated(false);
        }
    }, [updated]);

    // ...

    // Call updateFormWithwidthData wherever needed
    const handleUpdate = (widthId) => {
        try {
            setUpdated(true)
            updateFormWithwidthData(widthId, widthData);

            setUpdateId(widthId)
            onOpen();

        } catch (error) {
            console.error("Error updating width:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            values.ref = refcat;
            setIsLoading(true);
            const response = await Updatewidth(updateId, values);
            setIsLoading(false);

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.width);

                // Optimistically update UI
                const updatedwidths = widthData.map((width) =>
                    width.id === updateId ? response.width : width
                );

                setwidthData(updatedwidths);
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
        console.error("Error updating width:", error.message);
        toast.error(error.message);
    };


    const formik = useFormik({
        initialValues: {
            name: '',
            ref: ''
        },
        onSubmit: async values => {
            if (updateId) {
                setIsLoading(true)
                await handleUpdateSubmit(values);
                setIsLoading(false)
            } else {
                setIsLoading(true)
                await createwidth(values);
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
        setrefcat('');
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
        setrefcat('');
    };

    const handleOpenForCreate = () => {
        setUpdateId(null);
        formik.resetForm();
        setrefcat('');
        onOpen();
    };

    const refreshData = async () => {
        try {
            const res = await apiClient.get('/api/width/get-all-width');
            if (res.data && res.data.widths) {
                setwidthData(res.data.widths);
            }
        } catch (error) {
            console.error("Error refreshing widths:", error);
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
                                    {updateId ? "Update width" : "Create width"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-gray-50 dark:bg-[#1f1e30] border border-gray-200 dark:border-[#2b2a3f]">
                                        <div className="flex flex-col gap-3 p-6">
                                            <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Width Name</label>
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                placeholder="e.g. 44 inch, 60 inch, 72 inch"
                                            />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Linked Category</label>
                                                <Autocomplete
                                                    classNames={{
                                                        base: "max-w-full",
                                                        listboxWrapper: "max-h-[320px]",
                                                        selectorButton: "text-gray-600 dark:text-gray-300",
                                                    }}
                                                    onSelectionChange={(key) => setrefcat(key ? String(key) : '')}
                                                    items={categoriesData || []}
                                                    selectedKey={refcat ? String(refcat) : null}
                                                    inputProps={{
                                                        classNames: {
                                                            input: "ml-1 text-gray-900 dark:text-white font-font1 font-medium",
                                                            inputWrapper: "h-[50px] bg-white dark:bg-[#232233] border border-gray-200 dark:border-[#3a3950]",
                                                            label: "text-gray-700 dark:text-gray-300",
                                                        },
                                                    }}
                                                    listboxProps={{
                                                        hideSelectedIcon: false,
                                                        itemClasses: {
                                                            base: [
                                                                "rounded-medium",
                                                                "text-gray-900 dark:text-white",
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
                                                    aria-label="Select a Category"
                                                    placeholder="Select a Category"
                                                    popoverProps={{
                                                        offset: 10,
                                                        shouldCloseOnInteractOutside: () => true,
                                                        classNames: {
                                                            base: "rounded-large",
                                                            content: "p-1 border border-gray-200 dark:border-[#3a3950] bg-white dark:bg-[#1e1d2e] shadow-lg",
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
                                                        className="text-gray-400 dark:text-gray-300"
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
                                                        <AutocompleteItem key={String(item.id)} textValue={item.name}>
                                                            <div className="flex justify-between items-center text-gray-900 dark:text-white">
                                                                <span className="text-small font-font1">{item.name}</span>
                                                            </div>
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>
                                            </div>
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={widthData} onOpen={handleOpenForCreate} section={'width'} onRefresh={refreshData} />
        </>
    )
}

export default Width

