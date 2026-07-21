import React, { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { productsDataState } from '../../store/product/productAtom';
import { suppliersDataState } from '../../store/supplier/supplierAtom';
import { customerDataState } from '../../store/customer/customerAtom';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { quickchallanDataState } from '../../store/quickchallan/quickChallanAtom';
import { challanDataState } from '../../store/challan/challan';

export default function ChallanReport() {
    const customerData = useRecoilValue(customerDataState);
    const suppliersData = useRecoilValue(suppliersDataState);
    const productsData = useRecoilValue(productsDataState);
    const challanData = useRecoilValue(challanDataState);
    const quickChallanData = useRecoilValue(quickchallanDataState);

    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [customerFilter, setCustomerFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [challanTypeFilter, setChallanTypeFilter] = useState('');

    const combinedChallanData = useMemo(() => {
        return [
            ...challanData.map(challan => ({ ...challan, challanType: 'main' })),
            ...quickChallanData.map(challan => ({ ...challan, challanType: 'quick' }))
        ];
    }, [challanData, quickChallanData]);

    const filteredChallans = useMemo(() => {
        return combinedChallanData.filter(challan => {
            const challanDate = new Date(challan.challanDate || challan.quickchallanDate);
            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;

            return (
                (!startDate || challanDate >= startDate) &&
                (!endDate || challanDate <= endDate) &&
                (supplierFilter === '' || challan.supplier === supplierFilter) &&
                (customerFilter === '' || challan.customer === customerFilter) &&
                (productFilter === '' || challan.products.some(product => product.product === productFilter)) &&
                (challanTypeFilter === '' || challan.challanType === challanTypeFilter)
            );
        });
    }, [combinedChallanData, startDateFilter, endDateFilter, supplierFilter, customerFilter, productFilter, challanTypeFilter]);

    const renderProductsCell = (products) => {
        return (
            <Tooltip content={
                <div>
                    {products.map((product, index) => (
                        <div key={index}>{productsData.find(p => p._id === product.product)?.productName}</div>
                    ))}
                </div>
            }>
                <span>{products.length} products</span>
            </Tooltip>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Challan Report</h1>
            
            <div className="flex space-x-4">
                <Input
                    label="Start Date"
                    placeholder="YYYY-MM-DD"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    type="date"
                />
                <Input
                    label="End Date"
                    placeholder="YYYY-MM-DD"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    type="date"
                />
                <Autocomplete
                    label="Supplier"
                    placeholder="Select a supplier"
                    defaultItems={suppliersData}
                    onSelectionChange={(supplierId) => setSupplierFilter(supplierId)}
                >
                    {(supplier) => <AutocompleteItem key={supplier._id}>{supplier.name}</AutocompleteItem>}
                </Autocomplete>
                <Autocomplete
                    label="Customer"
                    placeholder="Select a customer"
                    defaultItems={customerData}
                    onSelectionChange={(customerId) => setCustomerFilter(customerId)}
                >
                    {(customer) => <AutocompleteItem key={customer._id}>{customer.name}</AutocompleteItem>}
                </Autocomplete>
                <Autocomplete
                    label="Product"
                    placeholder="Select a product"
                    defaultItems={productsData}
                    onSelectionChange={(productId) => setProductFilter(productId)}
                >
                    {(product) => <AutocompleteItem key={product._id}>{product.productName}</AutocompleteItem>}
                </Autocomplete>
                <Autocomplete
                    label="Challan Type"
                    placeholder="Select challan type"
                    defaultItems={[{id: 'main', name: 'Main'}, {id: 'quick', name: 'Quick'}]}
                    onSelectionChange={(type) => setChallanTypeFilter(type)}
                >
                    {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                </Autocomplete>
            </div>

            <Table aria-label="Challan table">
                <TableHeader>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Challan No</TableColumn>
                    <TableColumn>Supplier</TableColumn>
                    <TableColumn>Customer</TableColumn>
                    <TableColumn>Products</TableColumn>
                    <TableColumn>Total Bill</TableColumn>
                    <TableColumn>Challan Type</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredChallans.map((challan, index) => (
                        <TableRow key={index}>
                            <TableCell>{formatDate(challan.challanDate || challan.quickchallanDate)}</TableCell>
                            <TableCell>{challan.challanNo || challan.quickchallanNo}</TableCell>
                            <TableCell>{suppliersData.find(s => s._id === challan.supplier)?.name}</TableCell>
                            <TableCell>{customerData.find(c => c._id === challan.customer)?.name}</TableCell>
                            <TableCell>{renderProductsCell(challan.products)}</TableCell>
                            <TableCell>{challan.totalBill || 'N/A'}</TableCell>
                            <TableCell>{challan.challanType}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}