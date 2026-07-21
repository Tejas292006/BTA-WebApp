import React, { useEffect, useState } from 'react'
import DataTableModel from '../DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createweave, Deleteweave, Updateweave } from '../../apis/weave';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil"
import { weaveDataState } from "../../store/weave/weaveAtom"
import { categoryDataState } from '../../store/category/category';
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';

const Weave = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();

    const [updateId, setUpdateId] = useState(null)
    const [refcat, setrefcat] = useState('')
    const [WeaveData, setWeaveData] = useRecoilState(weaveDataState)
    console.log(WeaveData, "weaveDataState")
    const [updated, setUpdated] = useState(false)

    const [categoriesData, setCategoriesData] = useRecoilState(categoryDataState)
    console.log(categoriesData, "categoryDataState")

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

    const INITIAL_VISIBLE_COLUMNS = ["name", "verified", "actions"];

    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);


    // Create The weave
    const createweave = async (values) => {
        try {
            values.ref = refcat;
            setIsLoading(true)
            const response = await Createweave(values);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/inventory');
                console.log(response.weaveDoc)
                setWeaveData([...WeaveData, response.weaveDoc]);
                onOpenChange(false)
                setUpdateId(null); // Reset update ID when modal is closed
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            console.log(error.message);
            toast.error(error.message);
        }
    }



    // Delete weave
    const deleteItem = async (id) => {
        try {
            setIsLoading(true)
            const response = await Deleteweave(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setWeaveData((prevData) => prevData.filter((weave) => weave._id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    // Update The weave
    const updateFormWithWeaveData = (WeaveId, updatedWeaveData) => {
        const WeaveDataexist = updatedWeaveData.find((element) => element._id === WeaveId);
        console.log(WeaveDataexist, updatedWeaveData, 'existssssssssssssssssssssss');
        setrefcat(() => (WeaveDataexist?.ref))

        formik.setValues({
            name: WeaveDataexist?.name,
        });
    };
    // ...

    // Use updateFormWithWeaveData in the useEffect
    useEffect(() => {
        updateFormWithWeaveData(updateId, WeaveData);
        setUpdated(false);
    }, [updated]);

    // ...

    // Call updateFormWithWeaveData wherever needed
    const handleUpdate = (WeaveId) => {
        try {
            setUpdated(true)
            updateFormWithWeaveData(WeaveId, WeaveData);

            setUpdateId(WeaveId)
            onOpen();

        } catch (error) {
            console.error("Error updating Weave:", error.message);
            toast.error(error.message);
        }
    };
       // Handle update form submission
       const handleUpdateSubmit = async (values) => {
        try {
            values.ref = refcat;
            setIsLoading(true);
            const response = await Updateweave(updateId, values);
            setIsLoading(false);

            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.weave);
                 
                // Optimistically update UI
                const updatedweaves = WeaveData.map((weave) =>
                    weave._id === updateId ? response.weave : weave
                );
                
                setWeaveData(updatedweaves);
                
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
        console.error("Error updating weave:", error.message);
        toast.error(error.message);
    };



    const formik = useFormik({
        initialValues: {
            name: '',
            ref: "",
        },
        onSubmit: async values => {
            if (updateId) {
                setIsLoading(true)
                await handleUpdateSubmit(values);
                setIsLoading(false)
            } else {
                setIsLoading(true)
                await createweave(values);
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
                        // if (!newState) {
                        //     formik.setValues({})
                        // }
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    {updateId ? "Update weave" : "Create weave"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                                        <div className="flex flex-col gap-2 p-8">
                                            <input
                                                autoFocus
                                                {...formik.getFieldProps('name')}
                                                className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                                                placeholder="weave name.."
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={WeaveData} onOpen={onOpen} section={'weave'} />
        </>
    )
}

export default Weave
