import React, { useEffect, useState } from 'react'
import DataTableModel from '../../components/DataTableModel/DataTableModel';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Radio, Tab, Tabs, CardBody, Card, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Autocomplete, AutocompleteItem, Textarea, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip, Spinner } from "@nextui-org/react";
import { useFormik } from 'formik'
import { Createquickchallan, Deletequickchallan, Updatequickchallan } from '../../apis/quickChallan';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from "recoil"
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { quickchallanDataState } from '../../store/quickchallan/quickChallanAtom';
import { productsDataState } from '../../store/product/productAtom';
import { cutDataState } from '../../store/cut/cutAtom';
import { suppliersDataState } from '../../store/supplier/supplierAtom';
import AutoComplete from '../../components/Autocomplete/AutoComplete';
import { customerDataState } from '../../store/customer/customerAtom';
import { IndianRupee } from 'lucide-react'
import { UploadImageChallan } from '../../apis/product';

import { attributeDataState } from '../../store/attribute/attributeAtom';
import { attributeValueDataState } from '../../store/attributevalue/attributevalueAtom';

import FillterTableData from '../../components/FillterDataTable/FillterTableData';

const quickchallan = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState(null)
  const [productref, setproductref] = useState(null)
  const [supplierRef, setsupplierRef] = useState(null)
  const [customerRef, setcustomerRef] = useState(null)
  const [bale, setbale] = useState("")
  const [qty, setqty] = useState("")
  const [qtymeter, setqtymeter] = useState("")
  const [price, setprice] = useState("")
  const [remark, setRemark] = useState("")
  const [unit, setUnit] = useState("")
  const [prodcutkey, setprodcutkey] = useState("")
  const [totalbill, settotalbill] = useState(null)
  const [cutref, setcutref] = useState(null)

  const [quickchallansData, setquickchallansData] = useRecoilState(quickchallanDataState)
  const [quickchallanNumber, setquickchallanNumber] = useState("")

  const [productsData, setProductsData] = useRecoilState(productsDataState)
  // const [updated, setUpdated] = useState(false)

  const [cutData, setcutData] = useRecoilState(cutDataState)
  const [attributeData, setattributeData] = useRecoilState(attributeDataState)
  const [attributeValueData, setattributeValueData] = useRecoilState(
    attributeValueDataState
  );
  // const products = useRecoilValue(getProductById(supplierRef));
  const [suppliersData, setSuppliersData] = useRecoilState(suppliersDataState)
  const [customerData, setcustomerData] = useRecoilState(customerDataState)
  const [productChartImage, setProductChartImage] = useState('');
  const [productChartImageData, setProductChartImageData] = useState([]);

  const [attributesvaluesData, setattributesvaluesData] = useState([]);
  const [productCategory, setProductCategory] = useState(null);
  const [modalImage, setModalImage] = useState(null);


  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };



  // Data Format
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "CHALLAN NO.", uid: "challanNo", sortable: true },
    { name: "TYPE", uid: "type", sortable: true },
    { name: "CUSTOMER", uid: "customer", sortable: true },
    { name: "SUPPLIER", uid: "supplier", sortable: true },
    { name: "PRODUCTS", uid: "products", sortable: true },
    { name: "BILL", uid: "totalBill", sortable: true },
    { name: "VERIFIED", uid: "verified", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = [
    { name: "Disabled", uid: "true" },
    { name: "Active", uid: "false" },
  ];

  const INITIAL_VISIBLE_COLUMNS = ["quickchallanNo", "customer", "type", "supplier", "products", "totalBill", "verified", "actions"];

  const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);

  // Create The Supplier
  const creatsupplier = async (values) => {
    try {
      setIsLoading(true)
      const response = await Createquickchallan(values);
      setIsLoading(false)
      // dispatch(SetLoader(false));
      if (response.success) {
        toast.success(response.message);
        console.log(response.quickchallanDoc)
        setquickchallansData([...quickchallansData, response.quickchallanDoc]);
        setUpdateId(null); // Reset update ID when modal is closed
        onOpenChange(false)
      } else {
        console.log(response.response.data.error);
        toast.error(response.response.data.error);
        // throw new Error(response.error);
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
      const response = await Deletequickchallan(id);
      setIsLoading(false)
      if (response.success) {
        toast.success(response.message);

        // Update local state based on the correct identifier (use _id instead of id)
        setquickchallansData((prevData) => prevData.filter((supplier) => supplier._id !== id));

      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setIsLoading(false)
      toast.error(error.message)
    }
  }



  // Handle update form submission
  const handleUpdateSubmit = async (values) => {
    try {
      setIsLoading(true)
      const response = await Updatequickchallan(updateId, values);
      setIsLoading(false)
      if (response.success) {
        toast.success(response.message);

        // setquickchallansData((prevData) => {
        //   const updatedSuppliers = prevData.map((supplier) => {
        //     // console.log(supplier._id === updateId ? response.supplier : supplier)
        //     return supplier._id === updateId ? response.quickchallan : supplier
        //   }
        //   );
        //   return updatedSuppliers;
        // });
        // Optimistically update UI
        const updatedsuppliers = quickchallansData.map((supplier) =>
          supplier._id === updateId ? response.quickchallan : supplier
        );

        setquickchallansData(updatedsuppliers);

        formik.resetForm();


        onOpenChange(false);
        setUpdateId(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error updating supplier:", error.message);
      toast.error(error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      quickchallanNo: '',
      quickchallanDate: new Date().toISOString().slice(0, 10),
      // totalBill: '',
      customer: '',
      type: '',
      supplier: '',
      overallremarks: '',
      products: [],
      verified: true,
    },
    onSubmit: async values => {
      // generateToatl()
      console.log(values);
      // return;
      if (updateId) {
        setIsLoading(true)
        console.log(values, "update")
        await handleUpdateSubmit(values);
        setIsLoading(false)
      } else {
        values.quickchallanNo = quickchallanNumber;
        console.log(values, "going")
        setIsLoading(true)
        await creatsupplier(values);
        setIsLoading(false)
      }
    },
  });

  const updateFormWithsupplierData = (supplierId, updatedsupplierData) => {
    const mySupplierData = updatedsupplierData.find((element) => element._id === supplierId);
    console.log(mySupplierData, updatedsupplierData, 'existssssssssssssssssssssss');

    formik.setValues({
      quickchallanNo: mySupplierData?.quickchallanNo,
      quickchallanDate: mySupplierData?.quickchallanDate,
      // totalBill: mySupplierData?.totalBill,
      customer: mySupplierData?.customer._id,
      products: mySupplierData?.products.map((product) => ({
        cut: product.cut,
        bales: product.bales,
        price: product.price,
        product: product.product,
        unit: product.unit,
        remarkDesc: product.remarkDesc,
        total: product.totalBill,
      })),
      supplier: mySupplierData?.supplier._id,
      overallremarks: mySupplierData?.overallremarks,
      type: mySupplierData?.type,
      verified: mySupplierData?.verified,
    });


    setsupplierRef(mySupplierData?.supplier)
    settotalbill(mySupplierData?.totalBill)
    setRemark(mySupplierData?.remarkDesc)
  };


  const handleUpdate = async (supplierId) => {
    try {
      console.log(supplierId, "id")
      updateFormWithsupplierData(supplierId, quickchallansData);

      setUpdateId(supplierId)
      onOpen();
    } catch (error) {
      console.error("Error updating supplier:", error.message);
      toast.error(error.message);
    }
  };

  // console.log(formik?.values?.supplier, "Supplir -----------------------------------------------------------------------")

  const addProductToTable2 = () => {
    if (productref && cutref && unit && bale && price) {
      // let overall = 0;
      // if (unit === '1') {
      //   overall = isNaN(price) ? 0 : Math.floor(parseFloat(qty) * parseFloat(price));
      // }
      // if (unit === '2') {
      //   overall = isNaN(price) ? 0 : Math.floor(parseFloat(qtymeter) * parseFloat(price));
      // }
      const newProduct = { product: productref, cut: cutref, bales: bale, challanChartImages: productChartImageData, price: price || 0, unit: unit, remarkDesc: remark };
      formik.setValues(prevValues => ({
        ...prevValues,
        supplier: productsData.find(product => product?._id === productref)?.supplierName?._id,
        products: [...(prevValues?.products || []), newProduct] // Ensure products is initialized as an array
      }));

      settotalbill(price)
      // formik.setFieldValue('totalBill', price);
      setUnit("")
      setproductref("")
      setProductChartImageData([])
      setProductChartImage("")
      setcutref("")
      setbale("")
      setprice("")
      // setqtymeter("")
      setRemark("")
      setfilterkeys([])
    } else {
      toast.error("Please select all fields");
    }
  };
  const addProductToTable = () => {
    if (productref && cutref && unit && bale && price) {

      // let overall = 0;
      // if (unit === '1') {
      //   overall = isNaN(price) ? 0 : Math.floor(parseFloat(qty) * parseFloat(price));
      // }
      // if (unit === '2') {
      //   overall = isNaN(price) ? 0 : Math.floor(parseFloat(qtymeter) * parseFloat(price));
      // }
      const newProduct = { product: productref, cut: cutref, bales: bale, challanChartImages: productChartImageData, price: price || 0, unit: unit, remarkDesc: remark };
      formik.setValues(prevValues => ({
        ...prevValues,
        products: [...(prevValues?.products || []), newProduct] // Ensure products is initialized as an array
      }));

      settotalbill(price)
      // formik.setFieldValue('totalBill', price);
      setUnit("")
      setproductref("")
      setProductChartImageData([])
      setProductChartImage("")
      setcutref("")
      setbale("")
      setprice("")
      // setqtymeter("")
      setRemark("")
    } else {
      toast.error("Please select all fields");
    }
  };

  const balepiecesChange = (event) => {
    event.preventDefault();
    setbale(event.target.value);
  };

  const qtypiecesChange = (event) => {
    event.preventDefault();
    setbale(event.target.value);
    if (cutref) {
      let qtyMeter;
      const cutvalue = cutData.find(cut => cut._id === cutref)
      if (cutvalue?.isNameNumerical) {
        qtyMeter = Math.floor(event.target.value * parseFloat(cutvalue?.name));
        setqtymeter(qtyMeter);
      }
      setqtymeter(qtyMeter);
    } else {
      toast.error("add cut first");
    }
  };

  const setproductchange = (value) => {
    console.log(value)
    const price = productsData?.filter(item => item?._id === value)[0]?.pricePerUnit?.magnitude;
    const selectedProductCategory = productsData?.filter(item => item?._id === value)[0]?.category?._id || "";
    console.log(selectedProductCategory)
    setproductref(value);
    setProductCategory(selectedProductCategory);
    setprice(price)
  };

  console.log(productCategory)
  console.log(cutData?.filter(item => item?.ref?._id === productCategory))

  const onSupplierChange = (value) => {
    setsupplierRef(value)
    formik.setValues((prevValues) => {
      return { ...prevValues, supplier: value };
    });
  };
  const onCustomerChange = (value, typeofquickchallan) => {
    setcustomerRef(value)
    formik.setValues((prevValues) => {
      return { ...prevValues, customer: value, type: typeofquickchallan };
    });
  };

  const removeAttributeFromTable = (index) => {
    formik.setValues((prevValues) => {
      const updatedProducts = [...prevValues.products];
      updatedProducts.splice(index, 1);
      return { ...prevValues, products: updatedProducts };
    });
    // generateToatl();
  };
  // const generateToatl = () => {
  //   // Accessing products from formik values
  //   const products = formik.values.products;

  //   if (products?.length > 0) {
  //     // Calculating the total bill
  //     const totalBill = products.reduce((acc, product) => {
  //       return acc + product.price;
  //     }, 0);

  //     console.log(totalBill)

  //     // Setting the total bill
  //     settotalbill(totalBill);
  //     formik.setFieldValue('totalBill', totalBill);
  //   }
  //   else {
  //     settotalbill(0);
  //     formik.setFieldValue('totalBill', 0);
  //   }
  // };

  const handleProductChartImageChange = async (e) => {
    setProductChartImage(e.target.files[0]);
    if (e.target.files[0]) {
      try {
        const formData = new FormData();
        let imageFile = e.target.files[0];
        if (imageFile) {
          formData.append("color-chart-challan", imageFile);
          setIsLoading(true)
          const response = await UploadImageChallan(formData);
          setIsLoading(false)

          if (response.success) {
            toast.success(response.message);
            const newImageLink = response.url;
            setProductChartImageData((prevImages) => [...prevImages, { src: newImageLink }]);
            setProductChartImage('');
          } else {
            toast.error(response.message);
          }
        } else {
          toast.error('Please select an image file.');
        }

      } catch (error) {
        setIsLoading(false)
        toast.error(error.message);
        console.log(error.message);
      }
    }
  };




  useEffect(() => {
    if (quickchallansData.length === 0) {
      setquickchallanNumber('1');
    } else {
      // Extract the last element's quickchallanNumber
      const lastquickchallanNumber = quickchallansData[quickchallansData.length - 1].quickchallanNo;
      // console.log(lastquickchallanNumber, "last")
      // Increment the last quickchallanNumber and set it
      const newquickchallanNumber = (parseInt(lastquickchallanNumber) + 1).toString();
      // console.log(newquickchallanNumber, "quickchallan")
      setquickchallanNumber(newquickchallanNumber);
    }
    // setcutData(attributeValueData.filter(attribute => attribute?.attributeRef?._id === (attributeData.find(attributename => attributename?.name === "cut")?._id))[0].valuesCombo)
  }, [onOpenChange, quickchallansData]);





  // console.log(formik.values, "values")
  // console.log(productref, "supplier")
  // console.log("product: ", productsData)
  // console.log("attribute ", attributeData)
  // console.log("data ", attributeValueData)
  // console.log("data ", quickchallansData)
  // console.log("cut: ", cutData)
  // console.log("productChartImageData: ", productChartImageData)
  // console.log("quickchallan: ", totalbill)
  // const datePart = new Date(yourArray.quickchallanDate)
  // const currentDate = new Date().toISOString().split('T')[0];
  // console.log(formik.values.quickchallanDate.split('T')[0], "date")
  // console.log(currentDate, "current-date")

  const Units = [
    { name: "Pcs", _id: 1 },
    { name: "Meter", _id: 2 },
  ]


  const [filterkeys, setfilterkeys] = React.useState([]);

  const handleClose = (fruitToRemove) => {
    setfilterkeys(filterkeys?.filter(fruit => fruit !== fruitToRemove));
    if (filterkeys?.length === 1) {
      setfilterkeys(initialFruits);
    }
  };


  const selectionchang = (value) => {
    setprodcutkey(value)
    setfilterkeys([...filterkeys, value])
  }

  const [selectedKeys, setSelectedKeys] = useState(undefined);

  useEffect(() => {
    console.log(attributeValueData?.filter(attributeValue => attributeValue?.attributeRef?._id === selectedKeys), "fitler")
    setattributesvaluesData(attributeValueData?.filter(attributeValue => attributeValue?.attributeRef?._id === selectedKeys))
  }, [selectedKeys])


  // Memoization function to cache results
  function memoize(func) {
    const cache = {};
    return function (...args) {
      const key = JSON.stringify(args);
      if (cache[key]) {
        return cache[key];
      } else {
        const result = func.apply(this, args);
        cache[key] = result;
        return result;
      }
    };
  }

  // Filter function to filter products based on filter keys
  const filterProducts = memoize((productsData, filterKeys) => {
    return productsData.filter(product => {
      // Iterate through each filter key
      for (const filterKey of filterKeys) {
        // Check if the product attributes contain the filter key
        if (!product?.productAttributes.some(attr => attr.attrValue === filterKey)) {
          return false; // If any filter key is not found, skip this product
        }
      }
      return true; // If all filter keys are found, include this product
    });
  });


  // Call the filter function with products data and filter keys
  const filteredProducts = filterProducts(productsData, filterkeys);

  // console.log(filteredProducts)

  const columnsoffillter = [
    {
      key: "productName",
      label: "NAME",
    },
    {
      key: "supplierName",
      label: "SUPPLIER",
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "pricePerUnit",
      label: "Price(PerUnit)",
    },
    {
      key: "quality",
      label: "QUALITY",
    },
  ];


  return (
    <>
      {
        isLoading && (<div className="absolute h-full left-0 top-0 w-full bg-black/30 z-[99] flex justify-center items-center">
          <Spinner size='lg' color='secondary' />
        </div>)
      }

      <div className="flex flex-col gap-2 py-4">

        <Modal
          isOpen={isOpen}
          scrollBehavior={"inside"}
          size={"full"}
          className="!mx-20 !rounded-xl"
          onOpenChange={(newState) => {
            onOpenChange(newState);
            if (!newState) {
              formik.resetForm();
              setUpdateId("")
              setRemark("");
              settotalbill("");
            }
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-2xl font-bold font-font2  mb-3">{updateId ? "Update quickchallan" : "Create quickchallan"}</ModalHeader>

                <ModalBody className='flex flex-col gap-6'>
                  <div className="flex flex-col w-full">
                    <h1 className='font-[600] font-font1 m-auto text-[1rem] mb-5'>Select The Type Of quickchallan !</h1>
                    <Card className="max-w-full max-h-full">
                      <CardBody className="overflow-hidden">
                        <Tabs
                          fullWidth
                          size="lg"
                          aria-label="Tabs form"
                          disabledKeys={(formik.values.type === "supplier") && ["Products"] || (formik.values.type === "product") && ["Supplier"]}
                        >
                          <Tab key="Supplier"
                            className="py-6 flex flex-col  gap-10 font-[400] font-font2"
                            title="Supplier"
                          >
                            <div className='flex  gap-5 mt-5 flex-col'>
                              <Input size={'md'}
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                }}
                                className="flex-grow max-w-[18rem] bg-[#000]"
                                labelPlacement="outside"
                                type="text" label="quickchallan No."
                                placeholder={formik.values.quickchallanNo && formik.values.quickchallanNo || "Generate after Creation "}
                                disabled={true}
                                variant="flat"
                              />
                              <Input
                                type="date"
                                labelPlacement="outside-left"
                                label="Date"
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                  // inputWrapper: "max-h-[50px]"
                                }}
                                value={formik?.values?.quickchallanDate?.split('T')[0]}
                                onChange={(e) => formik.setValues(prevValues => ({
                                  ...prevValues,
                                  quickchallanDate: e.target.value,
                                  type: "supplier"
                                }))}
                                // Use the date string directly
                                // {...formik.getFieldProps('quickchallanDate')}
                                className=" max-w-[15rem] mt-5"
                              />

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
                                  value={formik?.values?.customer}
                                  defaultItems={customerData}
                                  selectedKey={formik?.values?.customer}
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
                                  value={formik?.values?.supplier}
                                  defaultItems={suppliersData}
                                  selectedKey={formik?.values?.supplier}
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
                            </div>
                            <div className="img-form flex flex-col gap-5 mt-5">
                              <h1 className='font-font1 font-[600] mx-auto'>Add quickchallan Products.</h1>
                              <div className='grid grid-cols-2 md:grid-cols-6 gap-5 sm:grid-cols-3  mt-4 w-full' >
                                <Autocomplete
                                  labelPlacement="outside"
                                  label="Product Name"
                                  className='max-w-[15rem]'
                                  classNames={{
                                    base: "max-w-full border-[#fff] ",
                                    listboxWrapper: "max-h-[270px]",
                                    selectorButton: "text-[#000]",
                                  }}

                                  onSelectionChange={(value) => setproductchange(value)}
                                  value={productref}
                                  items={(supplierRef && productsData?.filter(product => product?.supplierName?._id === supplierRef) || [])}
                                  selectedKey={productref}
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
                                  aria-label="Select an Product"
                                  placeholder="Enter an Product"
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
                                    <AutocompleteItem key={item?._id} textValue={item?.productName}>
                                      <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                          <div className="flex flex-col">
                                            <span className="text-small">{item?.productName}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </AutocompleteItem>
                                  )}
                                </Autocomplete>
                                <Autocomplete
                                  classNames={{
                                    base: "max-w-full border-[#fff] ",
                                    listboxWrapper: "max-h-[270px]",
                                    selectorButton: "text-[#000]",
                                  }}
                                  labelPlacement="outside"
                                  label="Cut Name"

                                  onSelectionChange={setcutref}
                                  value={cutref}
                                  defaultItems={cutData?.filter(item => item?.ref?._id === productCategory) || cutData}
                                  // items={(productref && cutData?.filter(cut => cut?.ref === productref) || [] )}
                                  selectedKey={cutref}
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
                                  aria-label="Select an Cut"
                                  placeholder="Enter an Cut"
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

                                <Input
                                  label="Bale(s)"
                                  classNames={{
                                    label: "font-[600] font-font1",
                                    input: "font-[500] font-font1",
                                  }}
                                  labelPlacement="outside"
                                  type="number"
                                  endContent={<p className='font-[500] font-font1 text-[0.9rem]'>pieces</p>}
                                  placeholder="0"
                                  value={bale}
                                  className='max-w-[15rem]'
                                  onChange={(e) => setbale(e.target.value)}
                                />
                                {/* <Input
                                  label="Product Qty"
                                  classNames={{
                                    label: "font-[600] font-font1",
                                    input: "font-[500] font-font1",
                                  }}
                                  labelPlacement="outside"
                                  type="number"
                                  endContent={<p className='font-[500] font-font1 text-[0.9rem]'>meter</p>}
                                  placeholder="0"
                                  value={qtymeter}
                                  className='max-w-[15rem]'
                                  onChange={(e) => setqtymeter(e.target.value)}
                                /> */}
                                <Input
                                  label="Price"
                                  classNames={{
                                    label: "font-[600] font-font1",
                                    input: "font-[500] font-font1",
                                  }}
                                  labelPlacement="outside"
                                  type="number"
                                  placeholder="0"
                                  value={price}
                                  className='max-w-[15rem]'
                                  onChange={(e) => setprice(e.target.value)}
                                />
                                <Autocomplete
                                  classNames={{
                                    base: "max-w-full border-[#fff] ",
                                    listboxWrapper: "max-h-[270px]",
                                    selectorButton: "text-[#000]",
                                  }}
                                  labelPlacement="outside"
                                  label="Unit"

                                  onSelectionChange={setUnit}
                                  value={unit}
                                  defaultItems={Units}
                                  // items={(productref && cutData?.filter(cut => cut?.ref === productref) || [] )}
                                  selectedKey={unit}
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
                                  aria-label="Select an Cut"
                                  placeholder="Enter Unit"
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
                              <div className='flex items-center  w-full gap-10 mt-3 '>
                                <Textarea
                                  variant="flat"
                                  placeholder="Enter your remarks"
                                  className="font-[600] remove-scrolbar flex-grow  font-font1 max-w-[20rem] h-[100px] "
                                  classNames={{
                                    inputWrapper: "remove-scrolbar overflow-scroll",
                                  }}
                                  value={remark}
                                  onValueChange={setRemark}
                                />
                                <div className='flex gap-10  max-w-max items-center flex-grow'>
                                  <input
                                    type="file"
                                    onChange={(e) => handleProductChartImageChange(e)}
                                    className="hidden"
                                    id="bannerImageInput"
                                    name="banner_image"
                                  />
                                  <div className='flex gap-2  col-span-5 max-w-[15rem]'>
                                    <label htmlFor="bannerImageInput" className="font-[600] px-5 py-2 font-font1 text-[0.8rem] max-w-fit flex items-center justify-center text-center rounded-lg border border-black cursor-pointer">
                                      Select chart Image ({productChartImage?.name})
                                    </label>
                                  </div>
                                </div>
                                <div className="grid border  grid-cols-4 overflow-y-auto p-2 flex-grow  max-w-[35rem]">
                                  {
                                    productChartImageData?.length > 0 ? (
                                      productChartImageData?.map(productChartImage =>
                                        <a href='#' key={productChartImage?.src}>
                                          <img className='h-20 w-20 object-cover' src={productChartImage?.src} alt={productChartImage} />
                                        </a>
                                      )
                                    ) : (
                                      <div>No Images</div>
                                    )
                                  }
                                </div>
                              </div>
                              <Button
                                // isLoading={loading}
                                className="font-font1 max-w-[13rem] w-full m-auto text-[#fff] bg-[#000] font-medium "
                                onClick={addProductToTable}
                              >
                                Add
                              </Button>
                            </div>
                            <Table
                              classNames={{
                                base: 'max-h-[300px]  max-w-[1400px] border rounded-[14px] overflow-scroll',
                                table: 'min-h-[150px]  ',
                                th: 'text-center',
                                tr: 'text-center ',
                                td: 'font-font1 font-[600]',
                              }}
                              aria-label="Attribute Values Table"
                            >
                              <TableHeader>
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>CUT</TableColumn>
                                <TableColumn>BALE(s)</TableColumn>
                                {/* <TableColumn>QTY(Mtr)</TableColumn> */}
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>UNIT</TableColumn>
                                {/* <TableColumn>OVERALL</TableColumn> */}
                                <TableColumn>REMARK</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {formik.values?.products?.map((object, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {productsData.find(product => product._id === object.product._id)?.productName}
                                      </TableCell>
                                      <TableCell>
                                        {cutData.find(product => product._id === object.cut._id)?.name}
                                      </TableCell>
                                      <TableCell>
                                        {object.bales}
                                      </TableCell>
                                      {/* <TableCell>
                                        {object.qtyMtr}
                                      </TableCell> */}
                                      <TableCell>
                                        {object.price}
                                      </TableCell>
                                      <TableCell>
                                        {Units[object.unit - 1].name}
                                      </TableCell>
                                      {/* <TableCell>
                                        {object.overall}
                                      </TableCell> */}
                                      <TableCell className='overflow-hidden'>
                                        {object?.remarkDesc || "nothing"}
                                      </TableCell>
                                      <TableCell >
                                        <span
                                          className=" text-lg  text-danger cursor-pointer active:opacity-50"
                                          onClick={() => removeAttributeFromTable(index)}
                                        >
                                          <svg
                                            aria-hidden="true"
                                            fill="none"
                                            focusable="false"
                                            height="1em"
                                            role="presentation"
                                            viewBox="0 0 20 20"
                                            width="1em"
                                          >
                                            <path
                                              d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M8.60834 13.75H11.3833"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M7.91669 10.4167H12.0834"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                          </svg>
                                        </span>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                            {/* <Card>
                              <CardBody className='flex flex-row px-10 justify-between items-center py-5'>
                                <Button
                                  onClick={generateToatl}
                                  className='bg-[#000] text-[#fff]'>
                                  Generate Total
                                </Button>
                                <div className='flex items-center '>
                                  <IndianRupee size={20} />
                                  <p className='font-font1 font-[500] text-[1rem]'>{totalbill || 0}.00</p>
                                </div>
                              </CardBody>
                            </Card> */}

                            <div>
                              <Textarea
                                variant="flat"
                                placeholder="Enter your overall remarks"
                                className="font-[600] remove-scrolbar flex-grow  font-font1 max-w-full h-[100px] "
                                classNames={{
                                  inputWrapper: "remove-scrolbar overflow-scroll",
                                }}
                                value={formik?.values?.overallremarks} // Use directly from formik values
                                onChange={formik.handleChange} // Use formik's handleChange function for input change
                                name="overallremarks"
                              />
                            </div>
                          </Tab>

                          {/* products tab */}


                          <Tab
                            className="py-6 flex flex-col gap-10 font-[400] font-font2"
                            key="Products"
                            title="Product"
                          >
                            <div className='flex  items-center gap-10'>
                              {
                                !supplierRef && (
                                  <>
                                    <Autocomplete
                                      classNames={{
                                        base: "max-w-[18rem] border-[#fff] ",
                                        listboxWrapper: "max-h-[270px]",
                                        selectorButton: "text-[#000]",
                                      }}

                                      onSelectionChange={selectionchang}
                                      value={prodcutkey}
                                      defaultItems={attributesvaluesData[0]?.valuesCombo || []}
                                      selectedKey={prodcutkey}
                                      inputProps={{
                                        classNames: {
                                          input: "ml-1 text-[#000] font-font1",
                                          inputWrapper: "h-[50px]",
                                          label: "font-[600] font-font1 text-[1rem]",
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
                                      aria-label="Select an "
                                      placeholder={`Enter ${attributeData?.find(attribute => attribute._id === selectedKeys)?.name || "Select"}`}
                                      selectorButtonProps={{
                                        className: "hidden"
                                      }}
                                      popoverProps={{
                                        offset: 10,
                                        classNames: {
                                          base: "rounded-large",
                                          content: "p-1  border-none bg-background",

                                        },
                                      }}
                                      endContent={
                                        <Dropdown>
                                          <DropdownTrigger>
                                            <Button
                                              variant="light"
                                              className="capitalize h-[35px] text-[0.8rem] font-font1 font-[500]"
                                            >
                                              {attributeData?.find(attribute => attribute._id === selectedKeys)?.name || "Select"}
                                            </Button>
                                          </DropdownTrigger>
                                          <DropdownMenu
                                            aria-label="Single selection example"
                                            disallowEmptySelection
                                            selectionMode="single"
                                            variant="light"
                                            selectedKeys={selectedKeys || 'Select'}
                                            onSelectionChange={(value) => setSelectedKeys(value.currentKey)}
                                            classNames={{
                                              list: "text-[0.8rem] font-font1 font-[600]",
                                            }}
                                          >
                                            {
                                              attributeData?.map(attribute =>
                                                <DropdownItem key={attribute?._id}>{attribute?.name}</DropdownItem>)
                                            }
                                          </DropdownMenu>
                                        </Dropdown>
                                      }
                                      startContent={
                                        <svg
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
                                        <AutocompleteItem key={item?.attributeValue} textValue={item?.attributeValue}>
                                          <div className="flex justify-between items-center">
                                            <div className="flex gap-2 items-center">
                                              <div className="flex flex-col">
                                                <span>{item?.attributeValue}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </AutocompleteItem>
                                      )}
                                    </Autocomplete>
                                    <div className="flex gap-2 border rounded-xl max-w-max px-3 max-h-[50px] h-full justify-center items-center">
                                      {
                                        filterkeys.length > 0 ? (

                                          filterkeys.map((fruit, index) => (
                                            <Chip key={index} onClose={() => handleClose(fruit)} variant="flat" className='font-font1 text-[0.8rem]'>
                                              {fruit}
                                            </Chip>
                                          ))
                                        ) : (
                                          <h1 className='font-font1 font-[600] text-[0.8rem] m-auto'>no filter</h1>
                                        )
                                      }
                                    </div>
                                  </>
                                )
                              }
                            </div>
                            <FillterTableData productref={productref} setproductchange={setproductchange} rows={supplierRef ? filteredProducts.filter(products => products?.supplierName?._id === supplierRef) : filteredProducts} columnsoffillter={columnsoffillter} />
                            <Input size={'md'}
                              classNames={{
                                label: "font-[600] font-font1",
                                input: "font-[500] font-font1",
                              }}
                              className="flex-grow max-w-[18rem] bg-[#000]"
                              labelPlacement="outside"
                              type="text" label="Challan No."
                              placeholder={formik.values.challanNo && formik.values.challanNo || "Generate after Creation "}
                              disabled={true}
                              // value={challanNumber}
                              variant="flat"
                            />
                            <div className='flex items-center gap-10'>
                              <Autocomplete
                                labelPlacement="outside"
                                label="Customer Name"
                                classNames={{
                                  base: "border-[#fff] flex-grow",
                                  listboxWrapper: "max-h-[270px]",
                                  selectorButton: "text-[#000]",
                                }}

                                onSelectionChange={(value) => onCustomerChange(value, "product")}
                                value={formik?.values?.customer}
                                defaultItems={customerData}
                                selectedKey={formik?.values?.customer}
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
                              <Input
                                type="text"
                                labelPlacement="outside"
                                label="Product Name"
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                }}
                                value={productsData?.find(product => product?._id === productref)?.productName || "Click On Product"}
                                readOnly
                                className=" mt-5 flex-grow"
                              />
                              <Input
                                type="text"
                                labelPlacement="outside"
                                label="Supplier Name"
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                }}
                                value={productsData?.find(product => product?._id === productref)?.supplierName?.name || "Click On Product"}
                                readOnly
                                className="mt-5 flex-grow"
                              />
                            </div>
                            <Input
                              type="date"
                              labelPlacement="outside-left"
                              label="Date"
                              classNames={{
                                label: "font-[600] font-font1",
                                input: "font-[500] font-font1",
                                // inputWrapper: "max-h-[50px]"
                              }}
                              value={formik?.values?.challanDate?.split('T')[0]}
                              onChange={(e) => formik.setValues(prevValues => ({
                                ...prevValues,
                                challanDate: e.target.value,
                              }))}
                              // Use the date string directly
                              // {...formik.getFieldProps('challanDate')}
                              className=" max-w-[15rem] mt-5"
                            />
                            <div className='grid grid-cols-2 md:grid-cols-5 gap-5 sm:grid-cols-3  mt-4 w-full' >
                              <Autocomplete
                                classNames={{
                                  base: "max-w-full border-[#fff] ",
                                  listboxWrapper: "max-h-[270px]",
                                  selectorButton: "text-[#000]",
                                }}
                                labelPlacement="outside"
                                label="Cut Name"

                                onSelectionChange={setcutref}
                                value={cutref}
                                defaultItems={cutData?.filter(item => item?.ref?._id === productCategory) || cutData}
                                // items={(productref && cutData?.filter(cut => cut?.ref === productref) || [] )}
                                selectedKey={cutref}
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
                                aria-label="Select an Cut"
                                placeholder="Enter an Cut"
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

                              <Input
                                label="Bale(s)"
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                }}
                                labelPlacement="outside"
                                type="number"
                                endContent={<p className='font-[500] font-font1 text-[0.9rem]'>pieces</p>}
                                placeholder="0"
                                value={bale}
                                className='max-w-[15rem]'
                                onChange={balepiecesChange}
                              />

                              <Input
                                label="Price"
                                classNames={{
                                  label: "font-[600] font-font1",
                                  input: "font-[500] font-font1",
                                }}
                                labelPlacement="outside"
                                type="number"
                                placeholder="0"
                                value={price}
                                className='max-w-[15rem]'
                                onChange={(e) => setprice(e.target.value)}
                              />
                              <Autocomplete
                                classNames={{
                                  base: "max-w-full border-[#fff] ",
                                  listboxWrapper: "max-h-[270px]",
                                  selectorButton: "text-[#000]",
                                }}
                                labelPlacement="outside"
                                label="Unit"

                                onSelectionChange={setUnit}
                                value={unit}
                                defaultItems={Units}
                                // items={(productref && cutData?.filter(cut => cut?.ref === productref) || [] )}
                                selectedKey={unit}
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
                                aria-label="Select an Cut"
                                placeholder="Enter Unit"
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
                            <div className='flex items-center w-full gap-10 mt-3 '>
                              <Textarea
                                variant="flat"
                                placeholder="Enter your remarks"
                                className="font-[600] remove-scrolbar flex-grow  font-font1 max-w-[20rem] h-[100px] "
                                classNames={{
                                  inputWrapper: "remove-scrolbar overflow-scroll",
                                }}
                                value={remark}
                                onValueChange={setRemark}
                              />
                              <div className='flex gap-10  max-w-max items-center flex-grow'>
                                <input
                                  type="file"
                                  onChange={(e) => handleProductChartImageChange(e)}
                                  className="hidden"
                                  id="bannerImageInput"
                                  name="banner_image"
                                />
                                <div className='flex gap-2  col-span-5 max-w-[15rem]'>
                                  <label htmlFor="bannerImageInput" className="font-[600] px-5 py-2 font-font1 text-[0.8rem] max-w-fit flex items-center justify-center text-center rounded-lg border border-black cursor-pointer">
                                    Select chart Image ({productChartImage?.name})
                                  </label>
                                </div>
                              </div>
                              <div className="grid border grid-cols-4 overflow-y-auto p-2 flex-grow max-w-[35rem]">
                                {productChartImageData?.length > 0 ? (
                                  productChartImageData.map((productChartImage, index) => (
                                    <div key={index}>
                                      <a href="#" onClick={() => openModal(productChartImage.src)}>
                                        <img className="h-20 w-20 object-cover" src={productChartImage.src} alt={productChartImage} />
                                      </a>
                                    </div>
                                  ))
                                ) : (
                                  <div>No Images</div>
                                )}
                              </div>

                              {modalImage && <ImageModal imageSrc={modalImage} onClose={closeModal} />}
                            </div>
                            <Button
                              className="font-font1 max-w-[13rem] w-full m-auto text-[#fff] bg-[#000] font-medium "
                              onClick={addProductToTable2}
                            >
                              Add
                            </Button>
                            <Table
                              classNames={{
                                base: 'max-h-[300px]  max-w-[1400px] border rounded-[14px] overflow-scroll',
                                table: 'min-h-[150px]  ',
                                th: 'text-center',
                                tr: 'text-center ',
                                td: 'font-font1 font-[600]',
                              }}
                              aria-label="Attribute Values Table"
                            >
                              <TableHeader>
                                <TableColumn>PRODUCT</TableColumn>
                                <TableColumn>CUT</TableColumn>
                                <TableColumn>BALE(s)</TableColumn>
                                <TableColumn>PRICE</TableColumn>
                                <TableColumn>UNIT</TableColumn>
                                <TableColumn>REMARK</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                              </TableHeader>
                              <TableBody>
                                {formik.values?.products?.map((object, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {productsData.find(product => product._id === object.product._id)?.productName}
                                      </TableCell>
                                      <TableCell>
                                        {cutData.find(product => product._id === object.cut._id)?.name}
                                      </TableCell>
                                      <TableCell>
                                        {object.bales}
                                      </TableCell>

                                      <TableCell>
                                        {object.price}
                                      </TableCell>
                                      <TableCell>
                                        {Units[object.unit - 1].name}
                                      </TableCell>

                                      <TableCell className='overflow-hidden'>
                                        {object?.remarkDesc || "nothing"}
                                      </TableCell>

                                      <TableCell>
                                        <span
                                          className="text-lg  text-danger cursor-pointer active:opacity-50 mx-auto  inline-block"
                                          onClick={() => removeAttributeFromTable(index)}
                                        >
                                          <svg
                                            aria-hidden="true"
                                            fill="none"
                                            focusable="false"
                                            height="1em"
                                            role="presentation"
                                            viewBox="0 0 20 20"
                                            width="1em"
                                          >
                                            <path
                                              d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M8.60834 13.75H11.3833"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                            <path
                                              d="M7.91669 10.4167H12.0834"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                            />
                                          </svg>
                                        </span>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                            {/* <Card>
                              <CardBody className='flex flex-row px-10 justify-between items-center py-5'>
                                <Button
                                  onClick={generateToatl}
                                  className='bg-[#000] text-[#fff]'>
                                  Generate Total
                                </Button>
                                <div className='flex items-center '>
                                  <IndianRupee size={20} />
                                  <p className='font-font1 font-[500] text-[1rem]'>{totalbill || 0}.00</p>
                                </div>
                              </CardBody>
                            </Card> */}
                            <div>
                              <Textarea
                                variant="flat"
                                placeholder="Enter your overall remarks"
                                className="font-[600] remove-scrolbar flex-grow  font-font1 max-w-full h-[100px] "
                                classNames={{
                                  inputWrapper: "remove-scrolbar overflow-scroll",
                                }}
                                value={formik?.values?.overallremarks} // Use directly from formik values
                                onChange={formik.handleChange} // Use formik's handleChange function for input change
                                name="overallremarks"
                              />
                            </div>
                          </Tab>
                        </Tabs>
                      </CardBody>
                    </Card>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    onClick={formik.handleSubmit} isLoading={isLoading}
                    className='bg-[#000] text-[#fff]'>
                    {updateId ? "Update" : "Create"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div >
      <DataTableModel filltername={"quickchallanNo"} visible_columns={INITIAL_VISIBLE_COLUMNS} deleteItem={deleteItem} update={handleUpdate} columns={columns} statusOptions={statusOptions} users={quickchallansData} onOpen={onOpen} section={'supplier'} />
    </>
  )
}

export default quickchallan
