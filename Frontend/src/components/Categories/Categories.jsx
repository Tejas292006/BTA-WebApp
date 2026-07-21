import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, Autocomplete, AutocompleteItem, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { categoryDataState } from '../../store/category/category';
import { Createcategory, Deletecategory, Updatecategory } from '../../apis/categories';


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

    const INITIAL_VISIBLE_COLUMNS = ["name", "isNameNumerical", "actions"];

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
                setcategoryData((prevData) => prevData.filter((category) => category._id !== id));

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
        const categoryDataexist = updatedcategoryData.find((element) => element._id === categoryId);
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
                    category._id === updateId ? response.category : category
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
    const setUpdate = () => {
        setUpdateId(false)
        formik.resetForm(); 
       

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
                                    {updateId ? "Update category" : "Create category"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="category name.."
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={categoryData} onOpen={onOpen} section={'category'} />
        </>
    )
}

export default Categories

