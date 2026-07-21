import React, { PureComponent, useEffect, useMemo, useState } from 'react'
import './ProductForm.css'
import { useNavigate, useParams } from 'react-router-dom';
import { Autocomplete, AutocompleteItem, Button, Input } from "@nextui-org/react";
import { toast } from 'react-hot-toast';
import AutoComplete from '../Autocomplete/AutoComplete';
import { useFormik } from 'formik';
import * as z from 'zod';
import { CreateProduct, UpdateProduct, UploadImage } from '../../apis/product';
// import Arrowsvg from "../../assets/arrow.svg"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { suppliersDataState } from "../../store/supplier/supplierAtom"
import { categoryDataState } from "../../store/category/category"
import { qualityDataState } from "../../store/quality/qualityAtom"
import { designDataState } from "../../store/design/designAtom"
import { feeltypeDataState } from "../../store/feeltype/feeltypeAtom"
import { finishtypeDataState } from "../../store/finishtype/finishtypeAtom"
import { weaveDataState } from "../../store/weave/weaveAtom"
import { widthDataState } from "../../store/width/widthAtom"
import { productsDataState } from '../../store/product/productAtom';
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';
import { unitDataState } from '../../store/unit/unitAtom';
import { attributeValueDataState } from '../../store/attributevalue/attributevalueAtom';

const ProductPageForm = () => {
    const params = useParams();
    const productURL = params.id === 'new' ? null : params.id;

    console.log(productURL)
    const navigate = useNavigate();
    const [updateId, setUpdateId] = useState('');

    const categoryData = useRecoilValue(categoryDataState);
    const supplierData = useRecoilValue(suppliersDataState);
    // const weaveData = useRecoilValue(weaveDataState);

    // const qualityData = useRecoilValue(qualityDataState);   // depend on category
    // const designData = useRecoilValue(designDataState);     // depend on category
    // const feelTypeData = useRecoilValue(feeltypeDataState); // depend on category
    // const finishTypeData = useRecoilValue(finishtypeDataState);// depend on category
    // const widthData = useRecoilValue(widthDataState);       // depend on category

    // console.table(widthData)

    const productAttributeValueFirst = useRecoilValue(attributeValueDataState);// depend on category
    console.log(productAttributeValueFirst);

    const [productChartImage, setProductChartImage] = useState('');
    const [productChartImageData, setProductChartImageData] = useState([]);


    const setProductsData = useSetRecoilState(productsDataState);
    const productsData = useRecoilValue(productsDataState);

    const handleProductChartImageChange = (e) => {
        setProductChartImage(e.target.files[0]);
        console.log(e.target.files[0])
    };
    const uploadImage = async (e) => {
        try {
            const formData = new FormData();
            let imageFile = productChartImage;
            console.log("inside productChartImage")


            if (imageFile) {
                formData.append("color-chart-product", imageFile);
                const response = await UploadImage(formData);

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
            toast.error(error.message);
            console.log(error.message);
        }
    };

    // Function to filter items based on selected category and reference field
    const getFilteredItems = (items, selectedCategory) => {
        return items.filter(item => item?.category === selectedCategory);
    };
    const handleUpdate = async (productId) => {
        try {

            // changed from todoListState to filteredTodoListState
            const singleProductData = productsData.find((element) => element._id == productId);
            console.log(singleProductData)
            setProductChartImageData(singleProductData?.productColorChartData);
            formik.setValues({
                supplierName: singleProductData?.supplierName && singleProductData?.supplierName?._id,
                productName: singleProductData?.productName || "",
                category: singleProductData?.category && singleProductData?.category?._id,
                productAttributes: singleProductData?.productAttributes?.map(attr => ({
                    attrType: attr.attrType,
                    attrValue: attr.attrValue
                })),
                pricePerUnit: {
                    magnitude: singleProductData?.pricePerUnit?.magnitude || null,
                    unit: singleProductData?.pricePerUnit?.unit || null,
                },
                productColorChartData: singleProductData?.productColorChartData
            });


            setUpdateId(productId);

        } catch (error) {
            console.error("Error updating finishtype:", error.message);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (productURL) {
            handleUpdate(productURL);
        }
    }, [])

    const updateDependentFields = (value) => {
        const updatedProductAttributes = productAttributeValueFirst.map(attr => ({
            attrType: attr.attributeRef?._id || attr.attributeRef,
            attrValue: null
        }));
        formik.setValues({
            ...formik.values,
            category: value,
            productAttributes: updatedProductAttributes,
        });
    };

    React.useEffect(() => {
        formik.setFieldValue("productColorChartData", productChartImageData)

    }, [productChartImageData])

    const productAttributes = [
        {
            _id: "1",
            name: "quality",
        },
        {
            _id: "2",
            name: "design",
        },
        {
            _id: "3",
            name: "weave",
        },
        {
            _id: "4",
            name: "width",
        },
        {
            _id: "5",
            name: "finishtype",
        },
        {
            "_id": "6",
            name: "feeltype",
        },
        {
            "_id": "7",
            name: "weight",
        },

    ];
    const productAttributesValue = [
        {
            _id: "101",
            attributeType: {
                _id: "1",
                name: "quality",
            },
            attributesValues: [
                {
                    value: "good",
                    category: "65d4e127b8a8343255867647"
                },
                {
                    value: "better",
                    category: "65d4e1a9b8a834325586765e"
                }
            ]
        },

        {
            _id: "102",
            attributeType: {
                _id: "2",
                name: "design",
            },
            attributesValues: [
                {
                    value: "des 1",
                    category: "65d4e127b8a8343255867647"
                },
                {
                    value: "des2",
                    category: "65d4e1a9b8a834325586765e"
                }
            ]
        },
        {
            _id: "103",
            attributeType: {
                _id: "3",
                name: "weave",
            },
            attributesValues: [
                {
                    value: "weave 1",
                    category: "65d4e127b8a8343255867647"
                },
                {
                    value: "weave 2",
                    category: "65d4e1a9b8a834325586765e"
                }
            ]
        },
        {
            _id: "104",
            attributeType: {
                _id: "4",
                name: "width",
            },
            attributesValues: [
                {
                    value: "wide",
                    category: "65d4e127b8a8343255867647"
                },
                {
                    value: "narrow",
                    category: "65d4e1a9b8a834325586765e"
                }
            ]
        },
        {
            _id: "105",
            attributeType: {
                _id: "5",
                name: "finishtype",
            },
            attributesValues: [
                {
                    value: "matte",
                    category: "65d4e127b8a8343255867647"
                },
                {
                    value: "glossy",
                    category: "65d4e1a9b8a834325586765e"
                }
            ]
        },
        {
            _id: "106",
            attributeType: {
                "_id": "6",
                name: "feeltype",
            },
            attributesValues: [
                {
                    value: "soft",
                    category: "65d4e127b8a8343255867647"
                },
                {
                    value: "rough",
                    category: "65d4e1a9b8a834325586765e"
                }
            ]
        },
        {
            _id: "106",
            attributeType: {
                "_id": "7",
                name: "weight",
            },
            attributesValues: [
                {
                    value: "10",
                    category: "65d4e127b8a8343255867647"
                },
                {
                    value: "20",
                    category: "65d4e1a9b8a834325586765e"
                }
            ]
        },

    ]

    // Zod validation schema
    // const productSchema = z.object({
    //     supplierName: z.string().minLength(1)('Supplier Name is required'),
    //     productName: z.string().minLength(1)('Product Name is required'),
    //     category: z.string().minLength(1)('Category is required'),
    //     quality: z.string().minLengthn(1)('Quality is required'),
    //     design: z.string().minLength(1)('Design is required'),
    //     weight: z.string().minLength(1)('Weight is required'),
    //     finishtype: z.string().minLength(1)('Finish Type is required'),
    //     feeltype: z.string().minLength(1)('Feel Type is required'),
    // });

    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);

    const initialProductAttributes = useMemo(() => {
        // if (!updateId) {
        return productAttributeValueFirst.map(attr => ({
            attrType: attr.attributeRef?._id || attr.attributeRef,
            attrValue: null
        }));
        // }
    }, []);


    console.log(initialProductAttributes);

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            supplierName: "",
            productName: "",
            category: null,
            productAttributes: initialProductAttributes,
            pricePerUnit: {
                magnitude: null,
                unit: null
            },
            productColorChartData: [
                {
                    src: null,
                }
            ]
        },
        validate: (values) => {
            const errors = {};

            if (!values.supplierName) {
                errors.supplierName = "Supplier Name is required";
            }

            if (!values.productName) {
                errors.productName = "Product Name is required";
            }

            if (!values.category) {
                errors.category = "Category is required";
            }

            // if (!values.design) {
            //     errors.design = "Design is required";
            // }

            // if (!values.quality) {
            //     errors.quality = "Quality is required";
            // }

            // if (!values.feeltype) {
            //     errors.feeltype = "Feel Type is required";
            // }

            // if (!values.finishtype) {
            //     errors.finishtype = "Finish Type is required";
            // }

            // if (!values.weave) {
            //     errors.weave = "Weave is required";
            // }

            // if (!values.width) {
            //     errors.width = "Width is required";
            // }
            // if (!values.pricePerUnit || values.pricePerUnit.magnitude === null || values.pricePerUnit.unit === null) {
            //     errors.pricePerUnit = "Both Magnitude and Unit are required for Price Per Unit";
            // }


            // Add validation for other fields...

            return errors;
        },
        onSubmit: async (values) => {
            // Handle form submission logic here
            console.log(productChartImageData)

            // if (!values.productColorChartData.length > 0) {
            //     toast.error("Please enter at least one image");
            //     return; x
            // }

            console.log(values, "+++++++++++++++");
            // return;
            try {
                // dispatch(SetLoader(true));
                let response = null;
                if (updateId) {
                    setIsLoading(true);
                    response = await UpdateProduct(updateId, values);
                    setIsLoading(false);
                } else {
                    setIsLoading(true);
                    response = await CreateProduct(values);
                    setIsLoading(false);
                }

                if (response.success) {
                    navigate('/inventory');
                    toast.success(response.message);
                    // setUpdateId(null); // Reset update ID when modal is closed
                    setProductsData((prevValue) => [...prevValue, response.product])

                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                setIsLoading(false);

                console.log(error.message);
                toast.error(error.message);
            }
        },
    });


    const units = useRecoilValue(unitDataState);


    console.log(formik.values);


    // useEffect(()=>{
    //     productAttributesValue.map((attr,attrIndex)=>{
    //         formik.setFieldValue(`productAttributes[${attrIndex}].attrValue`, null);
    //         formik.setFieldValue(`productAttributes[${attrIndex}].attrType`, attr?.attributeType?.name);
    //     })
    // },[])



    return (
        <>
            <main className="demo-page-content">
                <div className="flex h-full overflow-auto max-w-full">
                    <div className="w-full  rounded-[24px] shadow-md p-6 overflow-auto">
                        <h2 className="text-3xl font-bold mb-4 font-font2">{updateId ? "Update " : "Create "}Product</h2>
                        <form onSubmit={formik.handleSubmit} className="flex flex-wrap font-font1 flex-col gap-10 mt-5">
                            <div className="flex flex-col">
                                <AutoComplete
                                    placeholder={"Supplier Name"}
                                    users={supplierData}
                                    values={formik.values.supplierName}
                                    selectionChange={(value) => formik.setFieldValue('supplierName', value)}

                                />
                                {formik.touched.supplierName && formik.errors.supplierName ? (
                                    <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.supplierName}</div>
                                ) : null}
                                <br />
                                <Input
                                    type="text"
                                    placeholder="Product name..."
                                    labelPlacement="outside"
                                    classNames={{
                                        label: '!text-[#fff]  font-font1',
                                        base: "max-w-full",
                                        input: 'font-font1 text-[1rem]',
                                        inputWrapper: "h-[48px]  w-full",
                                    }}
                                    variant="flat"
                                    id="productName"
                                    name="productName"
                                    value={formik.values.productName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.productName && formik.errors.productName ? (
                                    <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.productName}</div>
                                ) : null}

                                <div className='mt-12 mb-4 flex gap-2 font-bold border-b border-black pb-2 border-dashed  text-base font-sans'>
                                    More Details about product
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M17 15.586 6.707 5.293 5.293 6.707 15.586 17H7v2h12V7h-2v8.586z" /></svg>
                                </div>
                                {/* select form for category , width , feel type etc */}
                                <div className="grid grid-cols-1  md:grid-cols-3 gap-6 w-full   ">


                                    <div className='flex flex-col items-start gap-2'>
                                        {/* AutoComplete for category */}
                                        <AutoComplete
                                            placeholder={"Enter category"}
                                            users={categoryData}
                                            values={formik.values.category}
                                            selectionChange={(value) => {
                                                formik.setFieldValue('category', value);
                                                updateDependentFields(value); // Reset dependent fields on category change
                                            }}
                                        />
                                        {formik.touched.category && formik.errors.category ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.category}</div>
                                        ) : null}

                                    </div>


                                    {
                                        productAttributeValueFirst && productAttributeValueFirst.map((attr, attrIndex) => {
                                            // const attributeValues = productAttributesValue.find(value => value.attributeType.name === attr.name)?.attributesValues;
                                            console.log(attr?.attributeRef?.name)

                                            if (attr?.attributeRef?.name === "cut") {
                                                return;
                                            }

                                            return (
                                                <>
                                                    <div className='flex flex-col items-start gap-2'>

                                                        <Autocomplete
                                                            selectedKey={formik.values.productAttributes[attrIndex]?.attrValue}
                                                            onSelectionChange={(value) => {
                                                                formik.setFieldValue(`productAttributes[${attrIndex}].attrType`, attr.attributeRef?._id || attr.attributeRef)
                                                                // Find the matching attributesValue object based on the selected value
                                                                const selectedAttributesValue = attr.valuesCombo.find(item => item.attributeValue === value);

                                                                // Set the attrValue to the value of the selected attributesValue object
                                                                if (selectedAttributesValue) {
                                                                    formik.setFieldValue(`productAttributes[${attrIndex}].attrValue`, selectedAttributesValue.attributeValue);
                                                                } else {
                                                                    // Handle the case where the selected value is not found in attributesValues
                                                                    formik.setFieldValue(`productAttributes[${attrIndex}].attrValue`, null);
                                                                    console.error('Selected value not found in attributesValues:', value);
                                                                }
                                                            }}
                                                            classNames={{
                                                                base: " border border- bg-transparent",
                                                                listboxWrapper: "max-h-[70px]",
                                                                selectorButton: "text-default-500",
                                                            }}
                                                            defaultItems={getFilteredItems(attr?.valuesCombo, formik.values.category)}
                                                            inputProps={{
                                                                classNames: {
                                                                    input: "text-[0.9rem] ",
                                                                    inputWrapper: " bg-[#fff] font-font1 h-[40px] max-w-full ",
                                                                },
                                                            }}
                                                            // listboxProps={{
                                                            //     hideSelectedIcon: true,
                                                            //     itemClasses: {
                                                            //         base: [

                                                            //         ],
                                                            //     },
                                                            // }}
                                                            aria-label="Select an employee"
                                                            placeholder={"Enter " + attr?.attributeRef?.name}
                                                            popoverProps={{
                                                                offset: 10,
                                                                classNames: {
                                                                    base: "",
                                                                    content: "p-1  border-default-100 ",
                                                                },
                                                            }}
                                                            variant="flat"
                                                        >
                                                            {(item) => (
                                                                <AutocompleteItem key={item.attributeValue} textValue={item.attributeValue}>
                                                                    <div className="flex justify-between items-center">
                                                                        <div className="flex gap-2 items-center">
                                                                            <div className="flex flex-col">
                                                                                <span className="text-small">{item.attributeValue}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </AutocompleteItem>
                                                            )}
                                                        </Autocomplete>

                                                        {/* <AutoComplete
                                                                placeholder={"Enter quality"}
                                                                // users={getFilteredItems(qualityData, formik.values.category)}
                                                                users={attr.attributeType}
                                                                values={formik.values.quality}
                                                                selectionChange={(value) => formik.setFieldValue('quality', value)}
                                                            />
                                                            {formik.touched.quality && formik.errors.quality ? (
                                                                <div className="text-red-500 text-[0.8rem] font-semibold italic">*{formik.errors.quality}</div>
                                                            ) : null} */}
                                                    </div>
                                                </>
                                            )

                                        })
                                    }


                                    {/* Input for Prce Per piece */}
                                    <div className='flex flex-col items-start gap-2'>
                                        <div className='flex gap-2 h-full items-center'>
                                            Rs.
                                            <input
                                                type="number"
                                                value={formik.values?.pricePerUnit?.magnitude}
                                                onChange={(e) => formik.setFieldValue('pricePerUnit.magnitude', e.target.value)}
                                                onBlur={formik.handleBlur}
                                                id="pricePerUnit"
                                                name="pricePerUnit"
                                                className='border h-full outline-none w-[180px] px-2'
                                                placeholder='Price per Piece'
                                            />
                                            /
                                            <div>
                                                <AutoComplete
                                                    placeholder={"Unit"}
                                                    users={units}
                                                    values={formik.values?.pricePerUnit?.unit}
                                                    selectionChange={(value) => formik.setFieldValue('pricePerUnit.unit', value)}
                                                />

                                            </div>
                                        </div>
                                        {/* <Input
                                            type="number"
                                            placeholder="Price Per Piece (in rs.)"
                                            labelPlacement="outside"
                                            classNames={{
                                                label: '!text-[#fff]  font-font1',
                                                base: "max-w-[272px]",
                                                input: 'font-font1 text-[1rem]',
                                                inputWrapper: "h-[48px]  w-full",
                                            }}
                                            variant="flat"
                                            id="pricePerPiece"
                                            name="pricePerPiece"
                                            value={formik.values.pricePerPiece}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        /> */}
                                        {formik.touched.pricePerUnit && formik.errors.pricePerUnit ? (
                                            <div className="text-red-500 text-[0.8rem] font-semibold italic">
                                                *{formik.errors.pricePerUnit}
                                            </div>
                                        ) : null}
                                    </div>

                                </div>
                                <div className='mt-12 mb-4 flex gap-2 font-bold border-b border-black pb-2 border-dashed  text-base font-sans'>
                                    Product Color Chart
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M17 15.586 6.707 5.293 5.293 6.707 15.586 17H7v2h12V7h-2v8.586z" /></svg>
                                </div>

                                <div className=''>
                                    <div className='grid grid-cols-6 gap-8'>
                                        <input
                                            type="file"
                                            onChange={(e) => handleProductChartImageChange(e)}
                                            className="hidden"
                                            id="bannerImageInput"
                                            name="banner_image"
                                        />
                                        <div className='flex gap-2 col-span-5'>

                                            <label htmlFor="bannerImageInput" className="font-semibold flex items-center justify-center text-center w-full h-full rounded-lg border border-black cursor-pointer">
                                                Select  Image ({productChartImage?.name})
                                            </label>

                                            {/* {mainImage?.name} */}
                                        </div>



                                        <div className='flex gap-2'>

                                            {/* {

                                                <div className='col-span-1 flex items-center justify-center'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                                        <path fill="#4caf50" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
                                                    </svg>
                                                </div>
                                            } */}

                                            <Button onClick={(e) => uploadImage(e)} isLoading={false} className="font-sans ml-auto col-span-1 text-[#fff] bg-[#000] font-medium"  >
                                                Upload
                                            </Button>

                                        </div>

                                    </div>
                                </div>

                                {/* Image Showing if it is there  */}
                                <div className="grid grid-cols-3 p-2 gap-4 h-full w-full mt-4">
                                    {
                                        productChartImageData && productChartImageData.length > 0 && productChartImageData.map((item, index) => (
                                            <>
                                                <div className='h-full rounded-xl  w-full'>
                                                    <img className='w-full rounded-xl h-full object-cover' src={item.src} alt="" />
                                                </div>
                                            </>
                                        ))
                                    }
                                </div>
                            </div>
                            <button type="submit" className="bg-neutral-950 font-font2  max-w-max text-neutral-400 border border-neutral-400 border-b-4 font-[600] overflow-hidden relative px-8 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                                <span className="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]" />
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ProductPageForm
