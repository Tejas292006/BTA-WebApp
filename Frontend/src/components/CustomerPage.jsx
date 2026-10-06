import React, { useEffect, useState } from 'react'
import DataTableModel from './DataTableModel';
import { Modal,Autocomplete,AutocompleteItem, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio } from "@nextui-org/react";
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState,} from "recoil"
import { globalLoaderAtom } from '../store';
import { customerDataState } from '../store';
import { Createcustomer, Deletecustomer, Updatecustomer } from '../api';
import { categoryDataState } from '../store';
import apiClient from '../api/client';


const CustomerPage = () => {
    
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();
    const [customerData, setcustomerData] = useRecoilState(customerDataState)
    const [updateId, setUpdateId] = useState(null)
    const [categoriesData, setCategoriesData] = useRecoilState(categoryDataState)
    const [refcat, setrefcat] = useState('')
    const [updated, setUpdated] = useState(false)

    const refreshData = async () => {
        try {
            const res = await apiClient.get('/api/customer/get-all-customer');
            if (res.data?.customers) setcustomerData(res.data.customers);
        } catch (e) {
            toast.error('Failed to refresh data');
        }
    };
    

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
   
      

    // Create The width
    const createcustomer = async (values) => {
        try {

            values.ref = refcat;
            setIsLoading(true)
            const response = await Createcustomer(values);
            console.log(values)

            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);
                navigate('/customers');
                console.log(response.customerDoc)
                setcustomerData([...customerData, response.customerDoc]);
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



    // Delete customer
    const deleteItem = async (id) => {
        console.log(id)

        try {
            setIsLoading(true)
            const response = await Deletecustomer(id);
            setIsLoading(false)
            if (response.success) {
                toast.success(response.message);

                // Update local state based on the correct identifier (use _id instead of id)
                setcustomerData((prevData) => prevData.filter((customer) => customer.id !== id));
                   
                navigate('/customers');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            toast.error(error.message)
        }
    }

    const updateFormWithcustomerData = (customerId, updatedcustomerData) => {
        const customerDataexist = updatedcustomerData.find((element) => element.id === customerId);
        console.log(customerDataexist, updatedcustomerData, 'existssssssssssssssssssssss');
        formik.setValues({
          name: customerDataexist?.name,
          companyName : customerDataexist?.companyName,
        });
      };
      
      // ...
      
      // Use updateFormWithcustomerData in the useEffect
      useEffect(() => {
        updateFormWithcustomerData(updateId, customerData);
        setUpdated(false);
      }, [updated]);
      
      // ...
      
      // Call updateFormWithcustomerData wherever needed
      const handleUpdate = (customerId) => {
        try {
          setUpdated(true)
          updateFormWithcustomerData(customerId, customerData);
          
          setUpdateId(customerId)
            onOpen();

        } catch (error) {
          console.error("Error updating customer:", error.message);
          toast.error(error.message);
        }
      };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            values.ref = refcat;
            setIsLoading(true)
            const response = await Updatecustomer(updateId, values);
            setIsLoading(false)
            
            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.customer);

                // Optimistically update UI
                const updatedcustomers = customerData.map((customer) =>{
                    return customer.id === updateId ? response.customer : customer}
                    )
                setcustomerData(()=>{
                
                return updatedcustomers;
            })
            formik.resetForm();
            // setUpdated(true)
            console.log(updated,'updateddddddddddddddddddddddddd')
// Close the modal and reset update ID
                onOpenChange(false);
                setUpdateId(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false)

            console.error("Error updating customer:", error.message);
            toast.error(error.message);
        }
    };



    const formik = useFormik({
        initialValues:   {name : '',
         companyName: ''},
        onSubmit: async values => {
            if (updateId) {
                setIsLoading(true)
                await handleUpdateSubmit(values);
                setIsLoading(false)
            } else {
                setIsLoading(true)
                await createcustomer(values);
                setIsLoading(false)
            }
        },
    });
const setUpdate = ()=>{
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
                        if (!newState) {
                            setUpdateId(null);
                            formik.resetForm();
                        }
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    {updateId ? "Update customer" : "Create customer"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl bg-gray-50 dark:bg-[#1f1e30] border border-gray-200 dark:border-[#2b2a3f]">
                                        <div className="flex flex-col gap-4 p-6">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Customer Name</label>
                                                <input
                                                    autoFocus
                                                    {...formik.getFieldProps('name')}
                                                    className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                    placeholder="e.g. Raj Fabrics"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 font-font1">Company Name</label>
                                                <input
                                                    {...formik.getFieldProps('companyName')}
                                                    className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                                                    placeholder="e.g. Raj Fabrics Pvt. Ltd."
                                                />
                                            </div>
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
            <DataTableModel visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={customerData} onOpen={onOpen} section={'customer'} onRefresh={refreshData} />
        </>
    )
}

export default CustomerPage

