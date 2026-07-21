import React, { useEffect } from 'react'
import DataTable from '../DataTable/DataTable';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { productsDataState } from '../../store/product/productAtom';
import { DeleteProduct, GetAllProducts } from '../../apis/product';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { globalLoaderAtom } from '../../store/GlobalLoader/globalLoaderAtom';

const ProductPage = () => {

    const navigate = useNavigate()

    // Data Format
    const columns = [
        { name: "ID", uid: "_id", sortable: true },
        { name: "Product Name", uid: "productName", sortable: true },
        { name: "Supplier Name", uid: "supplierName", sortable: true },
        // { name: "Quality", uid: "quality", sortable: true },
        { name: "Category", uid: "category" },
        // { name: "Design", uid: "design" },
        // { name: "Weave", uid: "weave" },
        // { name: "Width", uid: "width" },
        // { name: "Finish type", uid: "finishtype" },
        // { name: "Feel type", uid: "feeltype" },
        // { name: "STATUS", uid: "status", sortable: true },
        { name: "ACTIONS", uid: "actions" },
    ];

    const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);

    const productsData = useRecoilValue(productsDataState);
    const setProductsData = useSetRecoilState(productsDataState);
    console.log(productsData)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await GetAllProducts(); // Assuming you have an API function to fetch products
                if (response.success) {
                    setProductsData(response.products);
                } else {
                    throw new Error(response.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchData(); // Call the function to fetch data when the component mounts
    }, [setProductsData]);

    // Delete finishtype
    const deleteItem = async (id) => {
        try {
            setIsLoading(true)
            const response = await DeleteProduct(id);
            setIsLoading(false)
            // dispatch(SetLoader(false));
            console.log("------------------------------------------------", response)
            if (response.success) {
                toast.success(response.message);
                console.log(response.message)

                setProductsData((prevData) => prevData.filter((product) => product._id !== id));

                navigate('/inventory');
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            // dispatch(SetLoader(false));
            setIsLoading(false)
            toast.error(error.message)
        }
    }

    console.log(productsData)

    // Update The finishtype
    const handleUpdate = async (finishtypeId) => {
        try {

            // changed from todoListState to filteredTodoListState
            const finishtypeData = FinishTypesData.find((element) => element._id == finishtypeId);

            // Set the initial values for Formik
            formik.setValues({
                name: finishtypeData?.name,
                
                ref: finishtypeData?.ref,
            });

            setrefcat(finishtypeData?.ref)

            setUpdateId(finishtypeId);
            onOpen(); // Open the modal
        } catch (error) {
            console.error("Error updating finishtype:", error.message);
            toast.error(error.message);
        }
    };

    // Handle update form submission
    const handleUpdateSubmit = async (values) => {
        try {
            values.ref = refcat;
            const response = await Updatefinishtype(updateId, values);
            if (response.success) {
                toast.success(response.message);
                console.log("Data update", response.finishtype);

                // Optimistically update UI
                setFinishTypesData((prevData) => {
                    const updatedfinishtypes = prevData.map((finishtype) =>
                        finishtype._id === updateId ? response.finishtype : finishtype
                    );
                    return updatedfinishtypes;
                });

                // Close the modal and reset update ID
                onOpenChange(false);
                setUpdateId(null);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Error updating finishtype:", error.message);
            toast.error(error.message);
        }
    };



    const statusOptions = [
        { name: "Disabled", uid: "true" },
        { name: "Active", uid: "false" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["productName", "supplierName", "verified", "category", "actions"];


    const users = [
        {
            id: 1,
            name: "Tony Reichert",
            role: "CEO",
            team: "Management",
            status: "active",
            age: "29",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            email: "tony.reichert@example.com",
        },
        {
            id: 2,
            name: "Zoey Lang",
            role: "Tech Lead",
            team: "Development",
            status: "paused",
            age: "25",
            avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            email: "zoey.lang@example.com",
        },
        {
            id: 3,
            name: "Jane Fisher",
            role: "Sr. Dev",
            team: "Development",
            status: "active",
            age: "22",
            avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
            email: "jane.fisher@example.com",
        },
    ];



    return (
        <>
            <DataTable columns={columns} statusOptions={statusOptions} users={productsData} section={'product'} deleteItem={deleteItem} visible_columns={INITIAL_VISIBLE_COLUMNS} />
        </>
    )
}

export default ProductPage
