import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, Autocomplete, AutocompleteItem, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { finishtypeDataState } from '../../store/finishtype/finishtypeAtom';
import { Createfinishtype, Deletefinishtype, Updatefinishtype } from '../../apis/finishtype';
import { categoryDataState } from '../../store/category/category';


const Finishtype = () => {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();
    const [finishtypeData, setfinishtypeData] = useRecoilState(finishtypeDataState)
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



    // Create The finishtype
    const createfinishtype = async (values) => {
        try {

            values.ref = refcat;
            setIsLoading(true)
            const response = await Createfinishtype(values);
            console.log(values)

            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.finishtypeDoc)
                setfinishtypeData([...finishtypeData, response.finishtypeDoc]);
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



    // Delete finishtype
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deletefinishtype(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setfinishtypeData((prevData) => prevData.filter((finishtype) => finishtype._id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    const updateFormWithfinishtypeData = (finishtypeId, updatedfinishtypeData) => {
        const finishtypeDataexist = updatedfinishtypeData.find((element) => element._id === finishtypeId);
        console.log(finishtypeDataexist, updatedfinishtypeData, 'existssssssssssssssssssssss');
        setrefcat(() => (finishtypeDataexist?.ref))

        formik.setValues({
            name: finishtypeDataexist?.name,
           
        });
    };
    // ...

    // Use updateFormWithfinishtypeData in the useEffect
    useEffect(() => {
        updateFormWithfinishtypeData(updateId, finishtypeData);
        setUpdated(false);
    }, [updated]);

    // ...

    // Call updateFormWithfinishtypeData wherever needed
    const handleUpdate = (finishtypeId) => {
        try {
            setUpdated(true)
            updateFormWithfinishtypeData(finishtypeId, finishtypeData);

            setUpdateId(finishtypeId)
            onOpen();

        } catch (error) {
            console.error("Error updating finishtype:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            values.ref = refcat;
            setIsLoading(true);
            const response = await Updatefinishtype(updateId, values);
            setIsLoading(false);

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.finishtype);

                // Optimistically update UI
                const updatedfinishtypes = finishtypeData.map((finishtype) =>
                    finishtype._id === updateId ? response.finishtype : finishtype
                );

                setfinishtypeData(updatedfinishtypes);
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
        console.error("Error updating finishtype:", error.message);
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
                await createfinishtype(values);
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
                                    {updateId ? "Update finishtype" : "Create finishtype"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="finishtype name.."
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
                                                    finishtype={20}
                                                    color={"#fff"}
                                                >
                                                    <path
                                                        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokefinishtype={2.5}
                                                    />
                                                    <path
                                                        d="M22 22L20 20"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokefinishtype={2.5}
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={finishtypeData} onOpen={onOpen} section={'finishtype'} />
        </>
    )
}

export default Finishtype

