import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, Autocomplete, AutocompleteItem, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { widthDataState } from '../../store/width/widthAtom';
import { Createwidth, Deletewidth, Updatewidth } from '../../apis/width';
import { categoryDataState } from '../../store/category/category';


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

    const INITIAL_VISIBLE_COLUMNS = ["name", "isNameNumerical", "actions"];

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
                setwidthData((prevData) => prevData.filter((width) => width._id !== id));

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
        const widthDataexist = updatedwidthData.find((element) => element._id === widthId);
        console.log(widthDataexist, updatedwidthData, 'existssssssssssssssssssssss');
        setrefcat(() => (widthDataexist?.ref))

        formik.setValues({
            name: widthDataexist?.name,
           
        });
    };
    // ...

    // Use updateFormWithwidthData in the useEffect
    useEffect(() => {
        updateFormWithwidthData(updateId, widthData);
        setUpdated(false);
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
                    width._id === updateId ? response.width : width
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
    const setUpdate = () => {
        setUpdateId(false)
        formik.resetForm(); 
        setrefcat('')

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
                                    {updateId ? "Update width" : "Create width"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="width name.."
                                            />
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
                                                    <AutocompleteItem key={item._id} textValue={item.name}>
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={widthData} onOpen={onOpen} section={'width'} />
        </>
    )
}

export default Width

