import React, { useEffect, useState } from 'react'
import DataTableModel from './DataTableModel';
import { Modal, Autocomplete, AutocompleteItem, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, } from "recoil"
import { globalLoaderAtom } from '../store';
import { categoryDataState } from '../store';
import { Createcategory, Deletecategory, Updatecategory } from '../api';
import apiClient from '../api/client';


const Categories = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();
    const [categoryData, setcategoryData] = useRecoilState(categoryDataState)
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

    const INITIAL_VISIBLE_COLUMNS = ["id", "name", "isNameNumerical", "actions"];

    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);



    // Create The category
    const createcategory = async (values) => {
        try {

            values.ref = refcat;
            setIsLoading(true)
            const response = await Createcategory(values);
            console.log(values)

            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.categoryDoc)
                setcategoryData([...categoryData, response.categoryDoc]);
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



    // Delete category
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deletecategory(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setcategoryData((prevData) => prevData.filter((category) => category.id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    const updateFormWithcategoryData = (categoryId, updatedcategoryData) => {
        const categoryDataexist = updatedcategoryData.find((element) => element.id === categoryId);
        console.log(categoryDataexist, updatedcategoryData, 'existssssssssssssssssssssss');

        formik.setValues({
            name: categoryDataexist?.name,
           
        });
    };
    // ...

    // Use updateFormWithcategoryData in the useEffect
    useEffect(() => {
        updateFormWithcategoryData(updateId, categoryData);
        setUpdated(false);
    }, [updated]);

    // ...

    // Call updateFormWithcategoryData wherever needed
    const handleUpdate = (categoryId) => {
        try {
            setUpdated(true)
            updateFormWithcategoryData(categoryId, categoryData);

            setUpdateId(categoryId)
            onOpen();

        } catch (error) {
            console.error("Error updating category:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            values.ref = refcat;
            setIsLoading(true);
            const response = await Updatecategory(updateId, values);
            setIsLoading(false);

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.category);

                // Optimistically update UI
                const updatedcategorys = categoryData.map((category) =>
                    category.id === updateId ? response.category : category
                );

                setcategoryData(updatedcategorys);
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
        console.error("Error updating category:", error.message);
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
                await createcategory(values);
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
            const res = await apiClient.get('/api/category/get-all-category');
            if (res.data && res.data.categories) {
                setcategoryData(res.data.categories);
            }
        } catch (error) {
            console.error("Error refreshing categories:", error);
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
                                    {updateId ? "Update category" : "Create category"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-gray-50 dark:bg-[#1f1e30] border border-gray-200 dark:border-[#2b2a3f]">
                                        <div className="flex flex-col gap-3 p-6">
                                            <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Category Name</label>
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                placeholder="e.g. Fabric, Yarn, Thread"
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={categoryData} onOpen={handleOpenForCreate} section={'categories'} onRefresh={refreshData} />
        </>
    )
}

export default Categories

