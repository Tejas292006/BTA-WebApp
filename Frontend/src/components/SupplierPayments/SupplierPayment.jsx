import React, { useEffect, useState } from "react";
import { IndianRupee } from "lucide-react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    RadioGroup,
    Radio,
    Tab,
    Tabs,
    CardBody,
    Card,
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Autocomplete,
    AutocompleteItem,
    Textarea,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Chip,
    Spinner,
    select,
    checkbox,
    Listbox, ListboxItem, ScrollShadow, Avatar,
    Select,
    SelectItem,
    Checkbox
} from "@nextui-org/react";
import { useFormik } from "formik";
import { snapshot_UNSTABLE, RecoilRoot } from "recoil";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalLoaderAtom } from "../../store/GlobalLoader/globalLoaderAtom.jsx";
import {
    Createsupplierpayment,
    Deletesupplierpayment,
    Updatesupplierpayment,
} from "../../apis/supplierpayment.js";
import { invoiceDataState } from "../../store/invoice/invoiceAtom.jsx";
import { customerDataState } from "../../store/customer/customerAtom.jsx";
import { suppliersDataState } from "../../store/supplier/supplierAtom.jsx";
import { challanDataState } from "../../store/challan/challan.jsx";
import { quickchallanDataState } from "../../store/quickchallan/quickChallanAtom.jsx";
import { UpdateProductsDue, UpdatechallanProducts } from "../../apis/challan.js";
import { productsDataState } from "../../store/product/productAtom.jsx";
import { UpdateQuickChallanProducts, UpdateQuickProductsDue } from "../../apis/quickChallan.js";
import { cutDataState } from "../../store/cut/cutAtom.jsx";
import DataTableModel from "../DataTableModel/DataTableModel.jsx";
// import Adjustment from "./Adjustment";
// import NewRefrence from "./NewReferenceTable";
import NewReferenceTable from "./NewReferenceTable.jsx";
import { paymentModeState } from "../../store/paymentmode/paymentModeAtom.jsx";
import axios from "axios";
import { supplierpaymentDataState } from "../../store/supplierpayments/supplierPaymentsAtom.jsx";
// import { Createpayment } from "../../apis/payment";

const SupplierPayment = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();


    const [updateId, setUpdateId] = useState(null);
    // const [checkBoxItems, setCheckBoxItems] = React.useState([{ name: "", isChecked: "false" }, { name: "", isChecked: "false" }]);
    const [challanRef, setChallanRef] = useState(null);
    const [selectedPaymentResolveType, setSelectedPaymentResolveType] = React.useState('');
    const [invoiceData, setInvoiceData] = useRecoilState(invoiceDataState);
    const [supplierPaymentData, setSupplierPaymentData] = useRecoilState(supplierpaymentDataState);
    const [customerData, setcustomerData] = useRecoilState(customerDataState);
    const [paymentModeData, setPaymentModeData] = useRecoilState(paymentModeState);
    const [suppliersData, setsuppliersData] = useRecoilState(suppliersDataState);
    const [productsData, setProductsData] = useRecoilState(productsDataState)
    const [quickchallansData, setquickchallansData] = useRecoilState(
        quickchallanDataState
    );
    const [challansData, setChallansData] = useRecoilState(challanDataState);

    const [updatedProducts, setUpdatedProducts] = useState([]);

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

    const allChallanData = [...challansData, ...quickchallansData];

    console.log(invoiceData, '--------------------');

    const [selectedBalanceAmount, setSelectedBalanceAmount] = useState(0);

    const yourArray = [...selectedKeys];
    const selectedChallanData = yourArray.map((entry) => {
        return allChallanData.find((item) => item._id === entry);
    });
    const [selectedChallansProducts, setSelectedChallansProducts] = useState([]);

    const cutData = useRecoilValue(cutDataState);
    const [selectedCut, setSelectedCut] = useState(null);

    const [discountedAmount, setDiscountedAmount] = useState(0);


    const columns = [
        { name: "ID", uid: "_id", sortable: true },
        { name: "SUPPLIER_NAME", uid: "supplierName", sortable: true },
        { name: "CUSTOMER_NAME", uid: "customerName", sortable: true },
        { name: "RECEIVED(Total)", uid: "products.received", sortable: true },
        { name: "DUE(Total)", uid: "products.due", sortable: true },
        { name: "ACTIONS", uid: "actions" },
    ];

    const statusOptions = [
        { name: "Disabled", uid: "true" },
        { name: "Active", uid: "false" },
    ];

    const INITIAL_VISIBLE_COLUMNS = [
        "supplierName",
        "customerName",
        "products.received",
        "products.due",
        "actions",
    ];
    const Units = [
        { name: "Pcs", _id: 1 },
        { name: "Meter", _id: 2 },
    ]


    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);
    const [updated, setUpdated] = useState(false);
    const [supplierRef, setSupplierRef] = useState("");
    const [customerRef, setCustomerRef] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0);


    const [invoices, setInvoices] = useState([]);


    // const [newRefFeild, setNewRefFeild] = useState([]);


    const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);

    const [totalDue, setTotalDue] = useState(0);

    useEffect(() => {
        const newTotalDue = invoices.reduce((acc, item) => acc + (item?.remaining || 0), 0);
        setTotalDue(newTotalDue);
    }, [invoices]);


    // const onPaymentTypeSelection = (value) => {
    //     if (!customerRef || !supplierRef) {
    //         toast.error("Select both customer and supplier")
    //         return;
    //     }
    //     if (value === "newRef") {
    //         setNewRefData({ adjust: 0 })
    //     }
    //     setSelectedPaymentResolveType(value)
    // }

    const onPaymentTypeSelection = (value) => {
        if (!customerRef || !supplierRef) {
            toast.error("Select both customer and supplier")
            return;
        }
        if (value === "newRef") {
            setNewRefData({ adjust: 0, prevAdjust: 0 })
        }
        setSelectedPaymentResolveType(value)
        // Don't reset the invoices here
    }
    console.log(filteredInvoiceData, "===================")

    useEffect(() => {
        const products = [];
        selectedChallanData.map((item) => {
            item.products.map((row) => {
                if (!row?.isProductDispatchedByInvoice) {
                    const newRow = { ...row };

                    // Update the copied row object
                    if (newRow.due !== 0) {
                        if (newRow.unit === '1' && (item.challanType === 'main')) {
                            //if unit in pcs
                            newRow.qtyPcs = newRow.unit === '1' ? newRow.due : newRow.qtyPcs;
                            newRow.qtyMtr = (newRow.qtyPcs * newRow.cut?.name) || newRow.qtyMtr;

                        } else if (newRow.unit === '2' && (item.challanType === 'main')) {
                            //if unit in meter
                            newRow.qtyMtr = newRow.unit === '2' ? newRow.due : newRow.qtyMtr;
                            newRow.qtyPcs = (newRow.qtyMtr / newRow.cut?.name) || newRow.qtyMtr;
                        }

                        if (item.challanType === 'quick') {
                            newRow.bales = newRow.due
                        }
                    }

                    products.push({
                        id: newRow?.product?._id,
                        challanId: item._id,
                        unit: newRow?.unit,
                        product: newRow?.product?.productName || "NA",
                        cut: newRow?.cut?.name || "NA",
                        qtyPcs: newRow.qtyPcs || "NA",
                        challanType: item.challanType,
                        qtyMtr: newRow.qtyMtr || "NA",
                        bales: newRow.bales || "NA",
                        received_mtr: "", // This will be filled by user input
                        received_pcs: "", // This will be filled by user input
                        received_bales: "", // This will be filled by user input
                        due: newRow.due || null, // This will be filled by user input
                        rate: newRow?.rate ?? newRow.product.pricePerUnit.magnitude,
                        total: "", // This will be filled by user input
                        markAsCompleted: false, // This will be filled by user input
                        isBeingDispatchedInInvoice: newRow?.product?.isProductDispatchedByInvoice || false,
                    });
                }
            });
        });
        setSelectedChallansProducts(products);
    }, [selectedKeys]);

    const [amountEntered, setAmountEntered] = useState(0)
    const [paymentModeType, setPaymentModeType] = useState("")
    const [inputsVisible, setInputsVisible] = useState(false)
    const [chequeNumber, setChequeNumber] = useState("")
    const [newTotalAmountEntered, setNewTotalAmountEntered] = useState(amountEntered)

    useEffect(() => {
        setNewTotalAmountEntered(amountEntered)
    }, [amountEntered])

    const handleAmountChange = (e) => {
        setAmountEntered(e.target.value)
    }



    const onPaymentModeChange = (modeValue) => {
        if (modeValue.toLowerCase() === "cheque") {
            setInputsVisible(true);
        } else {
            setInputsVisible(false);
        }
        setPaymentModeType(modeValue);
    }



    const updateNewTotalAmountEntered = () => {
        const totalAdjusted = invoices.reduce((sum, invoice) => sum + invoice.adjust, 0);
        const newTotal = amountEntered - totalAdjusted;
        setNewTotalAmountEntered(newTotal);

        // if (newTotal < 0) {
        //     setDiscountedAmount(Math.abs(newTotal));
        // } else {
        //     setDiscountedAmount(0);
        // }
    };

    // useEffect(() => {
    //     if (!selectedPaymentResolveType) {
    //         return;
    //     }
    //     let updatedInvoiceData = [];
    //     if (selectedPaymentResolveType === "newRef") {
    //         const productRequest = confirm("Do you want to show the invoices ?");
    //         if (productRequest) {
    //             updatedInvoiceData = invoiceData.filter(item => item?.customerRef === customerRef && item?.supplierRef === supplierRef);
    //             setSelectedPaymentResolveType("adjustment");
    //             return;
    //         }

    //     } else {
    //         updatedInvoiceData = invoiceData.filter(item => item?.customerRef === customerRef && item?.supplierRef === supplierRef);
    //     }
    //     setFilteredInvoiceData(updatedInvoiceData);
    // }, [selectedPaymentResolveType, customerRef, supplierRef, invoiceData]);

    useEffect(() => {
        if (!selectedPaymentResolveType) {
            return;
        }
        let updatedInvoiceData = [];
        if (selectedPaymentResolveType === "newRef") {
            const productRequest = confirm("Do you want to show the invoices ?");
            if (productRequest) {
                // If user wants to show invoices, switch back to adjustment mode
                setSelectedPaymentResolveType("adjustment");
            } else {
                setFilteredInvoiceData(updatedInvoiceData)
            }
            // Don't update filteredInvoiceData here
        } else if (selectedPaymentResolveType === "adjustment" && invoices.length === 0) {
            // Only update filteredInvoiceData if invoices are empty
            updatedInvoiceData = invoiceData.filter(item => item?.customerRef === customerRef && item?.supplierRef === supplierRef);
            setFilteredInvoiceData(updatedInvoiceData);
        }
    }, [selectedPaymentResolveType, customerRef, supplierRef]);


    // update due of profucts
    const updateProductDue = async (challanId, productId, challanType, due) => {
        try {
            const payload = {
                productId: productId,
                due: due
            };
            if (challanType === "quick") {
                await UpdateQuickProductsDue(challanId, payload);
            } else if (challanType === "main") {
                await UpdateProductsDue(challanId, payload);
            }
            toast.success("Updated");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }
    // Create The width
    const createSupplierPayment = async (values) => {
        try {
            values.challanRef = [...selectedKeys];
            values.products = selectedChallansProducts;
            values.supplierRef = supplierRef;
            values.customerRef = customerRef;
            values?.products?.forEach(product => {
                if (product.due === 0) {
                    handleDispatchToggle(true, product.challanId, product.id, product.challanType)
                    product.isBeingDispatchedInInvoice = true;
                }
                updateProductDue(product.challanId, product.id, product.challanType, product.due);
            });
            setIsLoading(true);
            const response = await Createsupplierpayment(values);
            setIsLoading(false);
            if (response.success) {
                toast.success(response.message);
                navigate("/payments");
                setInvoiceData([...supplierPaymentData, response.supplierpaymentDoc]);
                onOpenChange(false);
                setUpdateId(null); // Reset update ID when modal is closed
                console.log(supplierPaymentData,"supplier payment data")

            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            // dispatch(SetLoader(false));
            toast.error(error.message);
        }
    };

    const [existingBalance, setExisitingBalance] = useState(0);
    const [balanceUsed, setBalanceUsed] = useState(false);

    useEffect(() => {
        const selectedCustomer = customerData?.find(item => item._id === customerRef)
        console.log(selectedCustomer)
        const linkedSupplierData = selectedCustomer?.supplierBalances?.find(item => item?.supplier === supplierRef)
        console.log(linkedSupplierData)

        const prevBalance = linkedSupplierData?.balance;

        setExisitingBalance(prevBalance)
    }, [customerRef, supplierRef])

    // Delete invoice
    const deleteItem = async (id) => {
        try {
            setIsLoading(true);
            const response = await Deletesupplierpayment(id);
            setIsLoading(false);
            if (response.success) {
                toast.success(response.message);
                setSupplierPaymentData((prevData) =>
                    prevData.filter((supplierpayment) => supplierpayment._id !== id)
                );
                navigate("/payments");
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false);

            toast.error(error.message);
        }
    };

    const updateFormWithinvoiceData = (invoiceId, updatedinvoiceData) => {
        const invoiceDataexist = updatedinvoiceData.find(
            (element) => element._id === invoiceId
        );
        setSelectedChallansProducts(invoiceDataexist?.products);
    };
    useEffect(() => {
        updateFormWithinvoiceData(updateId, invoiceData);
        setUpdated(false);
    }, [updated]);

    // Call updateFormWithinvoiceData wherever needed
    const handleUpdate = (invoiceId) => {
        try {
            setUpdated(true);
            updateFormWithinvoiceData(invoiceId, invoiceData);

            setUpdateId(invoiceId);
            onOpen();
        } catch (error) {
            console.error("Error updating invoice:", error.message);
            toast.error(error.message);
        }
    };
    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        values.challanRef = [...selectedKeys];
        values.products = selectedChallansProducts;
        values.products = selectedChallansProducts;
        values.products = selectedChallansProducts;
        try {
            // values.ref = refcat;
            setIsLoading(true);
            const response = await Updateinvoice(updateId, values);
            setIsLoading(false);

            if (response.success) {
                toast.success(response.message);

                // Optimistically update UI

                setInvoiceData((preValue) => {
                    const updatedinvoices = preValue.map((invoice) => {
                        return invoice._id === updateId ? response.invoice : invoice;
                    });
                    return updatedinvoices;
                });
                onOpenChange(false);
                setUpdateId(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setIsLoading(false);

            console.error("Error updating invoice:", error.message);
            toast.error(error.message);
        }
    };

    const updateInvoiceAsPerRemaining = async () => {
        const invoiceAdjustments = invoices.map(invoice => ({
            invoiceId: invoice?._id,
            remainingAmount: invoice?.remaining
        }));

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/invoice/process-supplier-payment`, { invoiceAdjustments });
            // Update the state with the new data
            // setInvoices(response.data.updatedInvoices.filter(invoice => !invoice.isCleared));
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    }

    const updateSupplierBalanceOfCustomer = async (newBalance, adjustment) => {

        const finalData = {
            updatedBalance: newBalance,
            customerId: customerRef,
            supplierId: supplierRef,
            invoiceAdjustments: adjustment
        }

        const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/customer/update-supplier-balance`, finalData);

        if (response.data.success) {
            console.log('Payment processed successfully:', response.data);
            // Update your frontend state or notify the user accordingly
        } else {
            console.error('Error processing payment:', response.data.message);
        }
    }

    const formik = useFormik({
        initialValues: {
            customerRef: "",
            supplierRef: "",
            paymentDate: new Date().toISOString().slice(0, 10),
            amountEntered: 0,
            paymentMode: "",
            chequeNumber: "",
            adjustments: [],
            overallRemarks: "",
            newReference: null
        },
        onSubmit: async (values) => {
            // Prepare the data for submission


            updateInvoiceAsPerRemaining();

            const paymentData = {
                ...values,
                adjustments: invoices.map(invoice => ({
                    invoiceId: invoice?._id,
                    invoiceNo: invoice.invoiceNo,
                    adjust: invoice.adjust,
                    discount: invoice.discount,
                    interest: invoice.interest,
                    remaining: invoice.remaining
                })),
                newReference: newRefData ? {
                    currentBalance: currentBalance,
                    adjust: newRefData.adjust,
                    newBalance: currentBalance + newRefData.adjust
                } : null
            };

            if (!paymentData) {
                return;
            }

            updateSupplierBalanceOfCustomer(paymentData?.newReference?.newBalance, paymentData?.adjustments);
            console.log(paymentData);
            // return;

            if (updateId) {
                setIsLoading(true);
                await handleUpdateSubmit(paymentData);
                setIsLoading(false);
            } else {
                setIsLoading(true);
                await createSupplierPayment(paymentData);
                onOpenChange(false)
                setIsLoading(false);
            }
        },
    });

    // Update formik values when certain states change
    useEffect(() => {
        formik.setFieldValue('amountEntered', amountEntered);
        formik.setFieldValue('paymentMode', paymentModeType);
        formik.setFieldValue('chequeNumber', chequeNumber);
    }, [amountEntered, paymentModeType, chequeNumber]);

    const onCustomerChange = (value) => {
        setCustomerRef(value);
        formik.setFieldValue('customerRef', value);
    };

    const onSupplierChange = (value) => {
        setSupplierRef(value);
        formik.setFieldValue('supplierRef', value);
    };

    // Function to pass to NewReferenceTable
    const handleNewRefChange = (newRefData) => {
        formik.setFieldValue('newReference', newRefData);
    };

    const setUpdate = () => {
        setUpdateId(false);
        formik.resetForm();
        // setrefcat('')
    };


    const handleDispatchToggle = async (isChecked, challanId, productId, challanType) => {

        try {
            const payload = {
                isProductDispatchedByInvoice: isChecked,
                productId: productId
            };
            if (challanType === "quick") {
                await UpdateQuickChallanProducts(challanId, payload);
            } else if (challanType === "main") {
                await UpdatechallanProducts(challanId, payload);
            }
            toast.success("Updated");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }


    // handleChange function for input fields
    const handleChange = (e, rowIndex) => {
        const { name, value } = e.target;
        selectedChallansProducts[rowIndex].received_pcs = parseInt(value);
        const cutvalue = cutData.find(cut => cut.name === selectedChallansProducts[rowIndex]?.cut)

        if (selectedChallansProducts[rowIndex]?.challanType === "main") {
            if (cutvalue.isNameNumerica) {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].received_mtr - selectedChallansProducts[rowIndex].qtyMtr);
                if (selectedChallansProducts[rowIndex]?.unit === "1") {
                    selectedChallansProducts[rowIndex].total = Math.abs(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
                } else {
                    selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
                }
            } else {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].received_pcs - selectedChallansProducts[rowIndex].qtyPcs);
            }
        } else if (selectedChallansProducts[rowIndex]?.challanType === "quick") {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        } else {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        }

        setUpdatedProducts((prevData) => [
            ...prevData,
            selectedChallansProducts[rowIndex],
        ]);
    };
    // handleChange function for input fields
    const handleChange2 = (e, rowIndex) => {
        const { name, value } = e.target;
        const originalQty = selectedChallansProducts[rowIndex]?.qtyPcs === "NA" || selectedChallansProducts[rowIndex].qtyMtr === "NA"
            ? selectedChallansProducts[rowIndex]?.bales
            : selectedChallansProducts[rowIndex]?.qtyMtr;
        selectedChallansProducts[rowIndex].received_mtr = parseInt(value);


        if (selectedChallansProducts[rowIndex]?.challanType === "main") {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        } else if (selectedChallansProducts[rowIndex]?.challanType === "quick") {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        } else {
            if (selectedChallansProducts[rowIndex]?.unit === "1") {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_pcs)
            } else {
                selectedChallansProducts[rowIndex].due = Math.abs(selectedChallansProducts[rowIndex].bales - selectedChallansProducts[rowIndex].received_bales);
                selectedChallansProducts[rowIndex].total = Math.trunc(selectedChallansProducts[rowIndex].rate * selectedChallansProducts[rowIndex].received_mtr)
            }
        }
        setUpdatedProducts((prevData) => [
            ...prevData,
            selectedChallansProducts[rowIndex],
        ]);
    };

    const removeAttributeFromTable = (index) => {
        formik.setValues((prevValues) => {
            const updatedProducts = [...prevValues.products];
            updatedProducts.splice(index, 1);
            return { ...prevValues, products: updatedProducts };
        });
    };


    const fillterChallan = React.useMemo(() => {
        return allChallanData.filter((item) => item.supplier._id === supplierRef && item.customer._id === customerRef && (item.products.filter(product => product.isProductDispatchedByInvoice === false)).length > 0 ? true : false)
    }, [supplierRef, customerRef]);



    const [selectedKeynewproduct, setselectedKeynewproduct] = useState("")
    const productAddInvoice = () => {
        if (!selectedKeynewproduct) {
            toast.error("Put Product Details !")
            return;
        }
        if (!selectedCut) {
            toast.error("Put Product Details !")
            return;
        }
        let product = productsData.find(p => p._id === selectedKeynewproduct);
        const newProduct = {
            id: product?._id,
            product: product?.productName || "NA",
            unit: product?.pricePerUnit?.unit?.name === "Pcs" ? "1" : "2",
            cut: selectedCut,
            qtyPcs: 0,
            qtyMtr: 0,
            bales: 0,
            received_mtr: "",
            received_pcs: "",
            received_bales: "",
            due: "",
            rate: product?.pricePerUnit?.magnitude | 0,
            total: "",
            markAsCompleted: false,
            isBeingDispatchedInInvoice: product?.isProductDispatchedByInvoice | false,
        };
        setselectedKeynewproduct('');
        setSelectedCut('');
        setSelectedChallansProducts([...selectedChallansProducts || [], newProduct]);
    }

    console.log(cutData, "invoiceData");

    useEffect(() => {
        if (filteredInvoiceData) {
            setInvoices(filteredInvoiceData.map(item => {
                if (item?.isCleared && !item?.isPaidToSupplier) {
                    return {
                        ...item,
                        grandTotal: item?.grandTotal,
                        adjust: 0,
                        discount: 0,
                        interest: 0,
                        remaining: item?.grandTotal
                    };
                }
            }).filter(item => item !== null)); // This ensures that cleared invoices are not set in the state
        }
    }, [filteredInvoiceData]);

    console.log(invoices,"invoices dataaaaaaaaaaaaaaaaa")


    // useEffect(() => {
    //     if (filteredInvoiceData) {
    //         setInvoices(filteredInvoiceData.map(item => ({
    //             ...item,
    //             adjust: 0,
    //             discount: 0,
    //             interest: 0,
    //             remaining: item?.grandTotal
    //         })));
    //     }
    // }, [filteredInvoiceData]);


    // const handleAdjustChange = (index, value) => {
    //     const updatedInvoices = [...invoices];
    //     const adjustValue = parseFloat(value) || 0;
    //     const previousAdjust = updatedInvoices[index].adjust || 0;

    //     // Calculate the difference between the new and previous adjust value
    //     const adjustDifference = adjustValue - previousAdjust;

    //     // Update newTotalAmountEntered
    //     const newTotalAmount = newTotalAmountEntered - adjustDifference;
    //     setNewTotalAmountEntered(newTotalAmount);


    //     updatedInvoices[index].adjust = adjustValue;
    //     updatedInvoices[index].remaining = updatedInvoices[index].grandTotal - adjustValue;
    //     setInvoices(updatedInvoices);
    // };


    // adjust change 1

    // const handleAdjustChange = (index, value) => {
    //     const updatedInvoices = [...invoices];
    //     const currentInvoice = updatedInvoices[index];
    //     const adjustValue = parseFloat(value) || 0;
    //     const previousAdjust = currentInvoice.adjust || 0;

    //     // Check if the new adjust value exceeds the grand total
    //     if (adjustValue > currentInvoice.grandTotal) {
    //         // If it does, set adjust to the grand total
    //         currentInvoice.adjust = currentInvoice.grandTotal;
    //         currentInvoice.remaining = 0;
    //     } else {
    //         // If it doesn't, proceed as normal
    //         currentInvoice.adjust = adjustValue;
    //         currentInvoice.remaining = currentInvoice.grandTotal - adjustValue;
    //     }

    //     // Calculate the difference between the new and previous adjust value
    //     const adjustDifference = currentInvoice.adjust - previousAdjust;

    //     // Update newTotalAmountEntered
    //     const newTotalAmount = newTotalAmountEntered - adjustDifference;
    //     setNewTotalAmountEntered(newTotalAmount);

    //     // If newTotalAmount becomes negative, update remainingAmount
    //     if (newTotalAmount < 0) {
    //         setDiscountedAmount(Math.abs(newTotalAmount));
    //         // newTotalAmount = 0;
    //     } else {
    //         setDiscountedAmount(0);
    //     }


    //     setInvoices(updatedInvoices);
    // };


    // adjust change 2

    // const handleAdjustChange = (index, value) => {
    //     const updatedInvoices = [...invoices];
    //     const currentInvoice = updatedInvoices[index];
    //     const adjustValue = parseFloat(value) || 0;

    //     currentInvoice.adjust = Math.min(adjustValue, newTotalAmountEntered);

    //     // Recalculate remaining amount
    //     const totalAdjustment = currentInvoice.adjust + currentInvoice.discount - currentInvoice.interest;
    //     currentInvoice.remaining = Math.max(0, currentInvoice.grandTotal - totalAdjustment);

    //     setInvoices(updatedInvoices);
    //     updateNewTotalAmountEntered();
    // };


    //latest one 
    const handleAdjustChange = (index, value) => {
        const updatedInvoices = [...invoices];
        const currentInvoice = updatedInvoices[index];
        const adjustValue = parseFloat(value) || 0;

        currentInvoice.adjust = adjustValue;

        // Recalculate remaining amount, allowing negative values
        const totalAdjustment = currentInvoice.adjust + currentInvoice.discount - currentInvoice.interest;
        currentInvoice.remaining = currentInvoice.grandTotal - totalAdjustment;

        setInvoices(updatedInvoices);
        updateNewTotalAmountEntered();
    };

    const [newRefData, setNewRefData] = useState(null);


    const handleNewRefAdjustChange = (value) => {
        const adjustValue = parseFloat(value) || 0;
        const prevAdjust = newRefData.prevAdjust;

        // Calculate the difference between the new and previous adjustment
        const adjustDifference = adjustValue - prevAdjust;

        // Update newTotalAmountEntered
        setNewTotalAmountEntered(prev => prev - adjustDifference);

        // Update newRefData with new adjust value and store the current adjust as prevAdjust
        setNewRefData({ adjust: adjustValue, prevAdjust: adjustValue });
    };


    const [interestAmount, setInterestAmount] = useState(0);


    // const handleDiscountChange = (index, value) => {
    //     const updatedInvoices = [...invoices];
    //     const currentInvoice = updatedInvoices[index];
    //     const discountValue = parseFloat(value) || 0;

    //     currentInvoice.discount = discountValue;

    //     // Recalculate remaining amount
    //     const totalAdjustment = currentInvoice.adjust + currentInvoice.discount - currentInvoice.interest;
    //     currentInvoice.remaining = Math.max(0, currentInvoice.grandTotal - totalAdjustment);

    //     setInvoices(updatedInvoices);
    //     updateNewTotalAmountEntered();
    // };

    // latest one (downside)

    const handleDiscountChange = (index, value) => {
        const updatedInvoices = [...invoices];
        const currentInvoice = updatedInvoices[index];
        const discountValue = parseFloat(value) || 0;

        currentInvoice.discount = discountValue;

        // Recalculate remaining amount, allowing negative values
        const totalAdjustment = currentInvoice.adjust + currentInvoice.discount - currentInvoice.interest;
        currentInvoice.remaining = currentInvoice.grandTotal - totalAdjustment;

        setInvoices(updatedInvoices);
        updateNewTotalAmountEntered();
    };

    // const handleInterestChange = (index, value) => {
    //     const updatedInvoices = [...invoices];
    //     const currentInvoice = updatedInvoices[index];
    //     const interestValue = parseFloat(value) || 0;

    //     currentInvoice.interest = interestValue;

    //     // Recalculate remaining amount
    //     const totalAdjustment = currentInvoice.adjust + currentInvoice.discount - currentInvoice.interest;
    //     currentInvoice.remaining = Math.max(0, currentInvoice.grandTotal - totalAdjustment);

    //     setInvoices(updatedInvoices);
    //     updateNewTotalAmountEntered();
    // };


    const handleInterestChange = (index, value) => {
        const updatedInvoices = [...invoices];
        const currentInvoice = updatedInvoices[index];
        const interestValue = parseFloat(value) || 0;

        currentInvoice.interest = interestValue;

        // Recalculate remaining amount, allowing negative values
        const totalAdjustment = currentInvoice.adjust + currentInvoice.discount - currentInvoice.interest;
        currentInvoice.remaining = currentInvoice.grandTotal - totalAdjustment;

        setInvoices(updatedInvoices);
        updateNewTotalAmountEntered();
    };

    // const handleInterestChange = (value) => {
    //     // Convert input to a number, default to 0 if NaN
    //     const numValue = parseFloat(value) || 0;
    //     const prevValue = interestAmount

    //     console.log("value : ", numValue)

    //     const adjustDiff = numValue - prevValue;

    //     // // Ensure interest is not negative and doesn't exceed newTotalAmountEntered
    //     // const validInterest = Math.max(0, Math.min(numValue, newTotalAmountEntered));
    //     // console.log("validInterest : ",validInterest)

    //     setInterestAmount(numValue);

    //     // Update newTotalAmountEntered
    //     const updatedNewAmount = newTotalAmountEntered - adjustDiff;
    //     console.log("updated New Total amount : ", updatedNewAmount)
    //     setNewTotalAmountEntered(updatedNewAmount);
    // }

    const handleRemoveNewReference = () => {
        setNewTotalAmountEntered(prev => prev + newRefData.adjust);
        setNewRefData(null);
    };

    return (
        <>
            <div className="flex flex-col gap-2 w-90vw">
                <Modal
                    isOpen={isOpen}
                    scrollBehavior={"inside"}
                    size={"full"}
                    onOpenChange={(newState) => {
                        onOpenChange(newState);
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                                    {updateId ? "Update invoice" : "Create invoice"}
                                </ModalHeader>
                                <ModalBody>
                                    <div className="max-w-full rounded-2xl py-5 flex gap-1 flex-col">
                                        <div className="px-2 py-0 text-[1.2rem] font-font1 flex items-center gap-10">
                                            <div className='flex items-center gap-10 mt-5'>
                                                <Autocomplete
                                                    labelPlacement="outside"
                                                    label="Customer Name"
                                                    classNames={{
                                                        base: "max-w-[18rem] border-[#fff] ",
                                                        listboxWrapper: "max-h-[270px]",
                                                        selectorButton: "text-[#000]",
                                                    }}

                                                    onSelectionChange={(value) => onCustomerChange(value, "supplier")}
                                                    value={formik?.values?.customer?._id}
                                                    defaultItems={customerData}
                                                    selectedKey={formik?.values?.customer?._id}
                                                    inputProps={{
                                                        classNames: {
                                                            input: "ml-1 text-[#000] font-font1",
                                                            inputWrapper: "h-[20px]",
                                                            label: "font-[600] font-font1",
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
                                                    aria-label="Select an Customer "
                                                    placeholder="Enter an Customer "
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
                                                        color={"#000"}
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

                                                    variant="flat"
                                                >
                                                    {(item) => (
                                                        <AutocompleteItem key={item?._id} textValue={item?.name}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-small">{item?.name}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>
                                                <Autocomplete
                                                    labelPlacement="outside"
                                                    label="Supplier Name"
                                                    classNames={{
                                                        base: "max-w-[18rem] border-[#fff] ",

                                                        listboxWrapper: "max-h-[270px]",
                                                        selectorButton: "text-[#000]",
                                                    }}

                                                    onSelectionChange={onSupplierChange}
                                                    value={formik?.values?.supplier?._id}
                                                    defaultItems={suppliersData}
                                                    selectedKey={formik?.values?.supplier?._id}
                                                    inputProps={{
                                                        classNames: {
                                                            input: "ml-1 text-[#000] font-font1",
                                                            inputWrapper: "h-[20px]",
                                                            label: "font-[600] font-font1",
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
                                                    aria-label="Select an Supplier"
                                                    placeholder="Enter an Supplier"
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
                                                        color={"#000"}
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

                                                    variant="flat"
                                                >
                                                    {(item) => (
                                                        <AutocompleteItem key={item?._id} textValue={item?.name}>
                                                            <div className="flex justify-between items-center">
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-small">{item?.name}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </AutocompleteItem>
                                                    )}
                                                </Autocomplete>
                                            </div>

                                            <Input
                                                type="date"
                                                labelPlacement="outside"
                                                label="Date"
                                                classNames={{
                                                    label: "font-[600] font-font1",
                                                    input: "font-[500] font-font1",
                                                    // inputWrapper: "max-h-[50px]"
                                                }}
                                                value={formik?.values?.paymentDate?.split('T')[0]}
                                                onChange={(e) => formik.setValues(prevValues => ({
                                                    ...prevValues,
                                                    paymentDate: e.target.value,
                                                }))}
                                                // Use the date string directly
                                                // {...formik.getFieldProps('challanDate')}
                                                className=" max-w-[15rem] mt-5"
                                            />


                                            {
                                                existingBalance &&

                                                <div className="text-sm border-2 bg-gray-100 p-2 rounded-lg">
                                                    <p>Current Balance of Customer</p>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-green-500 font-semibold text-xl">Rs. {existingBalance}</p>
                                                        <Input
                                                            type="number"
                                                            label="Use from balance"
                                                            max={existingBalance}
                                                            value={selectedBalanceAmount}
                                                            onChange={(e) => setSelectedBalanceAmount(Math.min(parseFloat(e.target.value) || 0, existingBalance))}
                                                        />
                                                        <button onClick={() => {
                                                            setBalanceUsed(true);
                                                            setAmountEntered(selectedBalanceAmount);
                                                        }} className="text-white bg-blue-500 px-2 py-1 text-xs">
                                                            Use selected amount
                                                        </button>
                                                    </div>
                                                </div>
                                            }

                                        </div>

                                        <div className="flex flex-col md:flex-row items-center mt-6 gap-4 max-w-[60rem]">
                                            <Input
                                                type="number"
                                                placeholder={'0.00'}
                                                className="flex"
                                                label="Amount (in Rs.)"
                                                value={amountEntered}
                                                onChange={(e) => handleAmountChange(e)}
                                            />


                                            <Autocomplete
                                                labelPlacement="outside"
                                                label="Payment Mode"
                                                classNames={{
                                                    base: " border-[#fff] ",

                                                    listboxWrapper: "max-h-[270px]",
                                                    selectorButton: "text-[#000]",
                                                }}

                                                onSelectionChange={(e) => onPaymentModeChange(e)}
                                                // value={formik?.values?.supplier?._id}
                                                defaultItems={paymentModeData}
                                                // selectedKey={formik?.values?.supplier?._id}
                                                inputProps={{
                                                    classNames: {
                                                        input: "ml-1 text-[#000] font-font1",
                                                        inputWrapper: "h-[20px]",
                                                        label: "font-[600] font-font1",
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
                                                aria-label="Select an Supplier"
                                                placeholder="Enter an Supplier"
                                                popoverProps={{
                                                    offset: 10,
                                                    classNames: {
                                                        base: "rounded-large",
                                                        content: "p-1  border-none bg-background",

                                                    },
                                                }}
                                                variant="flat"
                                            >
                                                {(item) => (
                                                    <AutocompleteItem key={item?.name} textValue={item?.name}>
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex gap-2 items-center">
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">{item?.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AutocompleteItem>
                                                )}
                                            </Autocomplete>


                                            {inputsVisible &&
                                                <Input
                                                    labelPlacement="outside"
                                                    label="Enter Cheque Number"
                                                    placeholder="ex.12345689"
                                                    value={chequeNumber}
                                                    onChange={(e) => {
                                                        setChequeNumber(e.target.value)
                                                    }}
                                                />
                                            }
                                        </div>


                                        <div className="font-semibold my-4">Select the payment resolve mode </div>



                                        <div className="flex flex-col items-center justify-center  gap-2">

                                            {/* <div className="border-2 h-fit px-4 py-2 rounded-full border-[#2020204d]">
                                                <Checkbox onValueChange={console.log} className={`font-semibold`}>Adjustment</Checkbox>
                                            </div>

                                            <div className="border-2 h-fit px-4 py-2 rounded-full border-[#2020204d]">
                                                <Checkbox  className={`font-semibold`}>New Refrence</Checkbox>
                                            </div> */}





                                            {/* <Tabs
                                                aria-label="Options"
                                                selectedKey={selectedPaymentResolveType}
                                                onSelectionChange={setSelectedPaymentResolveType}
                                                className="flex flex-col w-[40%]"
                                                color="primary"
                                            >
                                                <Tab key="adjustment" title="Adjustment">
                                                    <Adjustment
                                                        invoiceData={filteredInvoiceData}
                                                    />
                                                </Tab>
                                                <Tab key="newRef" title="New Refrence">
                                                    <NewRefrence />
                                                </Tab>

                                            </Tabs> */}

                                            {/* Table for the adjustment */}

                                            {(!invoices || invoices.length === 0) && <div>Currently No Invoices are there</div>}

                                            {
                                                invoices.length !== 0 &&
                                                <div className="container mx-auto py-6 px-4">
                                                    <div className="flex items-center my-4">
                                                        <p>Adjustment</p>
                                                        <span className={`${newTotalAmountEntered < 0 ? "text-red-800 bg-red-100" : "text-green-800 bg-green-100"} mx-2 rounded-xl font-semibold px-2 flex items-center py-1`}>
                                                            <IndianRupee size={18} />
                                                            <p>{newTotalAmountEntered}/-</p>
                                                        </span>
                                                    </div>
                                                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Products</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjust</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {
                                                                invoices.length !== 0 && invoices?.map((item, idx) => {
                                                                    return (
                                                                        <tr key={idx} className="hover:bg-gray-50">
                                                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item?.invoiceNo}</td>
                                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item?.products?.length}</td>
                                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item?.grandTotal}</td>
                                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                                                                                <input
                                                                                    type="number"
                                                                                    className="w-[50%] px-2 py-1 border-2 border-[#3535355c] rounded"
                                                                                    value={item?.adjust === 0 ? '' : item?.adjust}
                                                                                    onChange={(e) => handleAdjustChange(idx, e.target.value)}
                                                                                    max={newTotalAmountEntered}
                                                                                />
                                                                            </td>
                                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                                                                                <input
                                                                                    type="number"
                                                                                    className="w-[50%] px-2 py-1 border-2 border-[#3535355c] rounded"
                                                                                    value={item?.discount === 0 ? '' : item?.discount}
                                                                                    onChange={(e) => handleDiscountChange(idx, e.target.value)}
                                                                                />
                                                                            </td>
                                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                                                                                <input
                                                                                    type="number"
                                                                                    className="w-[50%] px-2 py-1 border-2 border-[#3535355c] rounded"
                                                                                    value={item?.interest === 0 ? '' : item?.interest}
                                                                                    onChange={(e) => handleInterestChange(idx, e.target.value)}
                                                                                />
                                                                            </td>
                                                                            {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{item?.remaining?.toFixed(2)}</td> */}
                                                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
                                                                                <span className={item?.remaining < 0 ? 'text-red-600' : ''}>
                                                                                    {item?.remaining.toFixed(2)}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>

                                                </div>
                                            }

                                            {/* table for new ref */}



                                            {newRefData && <div className="container mx-auto py-6 px-4">
                                                <div className="flex items-center justify-between my-2 ">
                                                    <div>New Reference</div>

                                                    {selectedPaymentResolveType === "newRef" &&
                                                        <span className={`${newTotalAmountEntered < 0 ? "text-red-800 bg-red-100" : "text-green-800 bg-green-100"} mx-2 rounded-xl font-semibold px-2 flex items-center py-1`}>
                                                            <IndianRupee size={18} />
                                                            <p>{newTotalAmountEntered}/-</p>
                                                        </span>
                                                    }

                                                    {selectedPaymentResolveType === "adjustment" && <button
                                                        className="text-sm text-red-500 underline"
                                                        onClick={handleRemoveNewReference}
                                                    >
                                                        Remove New Reference
                                                    </button>
                                                    }
                                                </div>
                                                {/* <NewRefrence
                                                /> */}

                                                <NewReferenceTable
                                                    customerData={customerData}
                                                    balanceUsed={balanceUsed}
                                                    currentSupplierId={supplierRef}
                                                    currentCustomerId={customerRef}
                                                    setCustomerData={setcustomerData}
                                                    newRefData={newRefData}
                                                    setNewRefData={setNewRefData}
                                                    setNewTotalAmountEntered={setNewTotalAmountEntered}
                                                    newTotalAmountEntered={newTotalAmountEntered}
                                                    onAdjustChange={handleAdjustChange}
                                                    currentBalance={currentBalance}
                                                    setCurrentBalance={setCurrentBalance}
                                                />
                                            </div>
                                            }



                                            <div className="flex gap-2 items-center">
                                                <Button className={`${selectedPaymentResolveType === "adjustment" ? "bg-primary text-white" : ""}`} onClick={() => onPaymentTypeSelection("adjustment")}>Adjustment</Button>
                                                <Button className={`${selectedPaymentResolveType === "newRef" ? "bg-primary text-white" : ""}`} onClick={() => onPaymentTypeSelection("newRef")}>New Reference</Button>
                                            </div>


                                            <Textarea
                                                label="Overall Remarks"
                                                labelPlacement="outside"
                                                value={formik?.values?.overallRemarks}
                                                onChange={(e) => formik.setFieldValue("overallRemarks", e.target.value)}
                                            />


                                            {/* <div className="w-full flex items-start justify-between mt-8 px-10 ">
                                                <div className="flex flex-col w-[30%] gap-6">
                                                    <Input
                                                        placeholder="0.00"
                                                        label="Discount"
                                                        labelPlacement="outside"
                                                        value={discountedAmount.toFixed(2)}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value) || 0;
                                                            setDiscountedAmount(value);
                                                        }}
                                                    />

                                                    <Input
                                                        // placeholder="0.00"
                                                        label="Interest"
                                                        labelPlacement="outside"
                                                        value={interestAmount === 0 ? "" : interestAmount}
                                                        onChange={(e) => handleInterestChange(e.target.value)}
                                                    // disabled={newTotalAmountEntered <= 0}
                                                    />

                                                </div>

                                                <div>
                                                    <Input
                                                        placeholder="0.00"
                                                        label="Total Due"
                                                        value={totalDue.toFixed(2)}
                                                        labelPlacement="outside"
                                                        readOnly
                                                    />
                                                </div>

                                            </div>
 */}


                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                        onClick={setUpdate}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        color="primary"
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
            <DataTableModel
                visible_columns={INITIAL_VISIBLE_COLUMNS}
                deleteItem={deleteItem}
                update={handleUpdate}
                columns={columns}
                statusOptions={statusOptions}
                users={supplierPaymentData}
                onOpen={onOpen}
                section={"invoice"}
            />
        </>
    );
};

export default SupplierPayment;
