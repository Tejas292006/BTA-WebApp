import React, { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { invoiceDataState } from '../../store';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { customerDataState } from '../../store';
import { suppliersDataState } from '../../store';
import { productsDataState } from '../../store';
import { customerledgerDataState } from '../../store';
import { supplierledgerDataState } from '../../store';

export default function InvoiceReport2() {
    const invoiceData = useRecoilValue(invoiceDataState);
    const customerData = useRecoilValue(customerDataState);
    const suppliersData = useRecoilValue(suppliersDataState);
    const productsData = useRecoilValue(productsDataState);
    const customerLedger = useRecoilValue(customerledgerDataState);
    const supplierLedger = useRecoilValue(supplierledgerDataState);
    

    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [customerFilter, setCustomerFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');

    const filteredProducts = useMemo(() => {
        return productsData.filter((product) => product.supplierName.id === supplierFilter);
    }, [productsData, supplierFilter]);

    const filteredInvoices = useMemo(() => {
        return invoiceData.filter(invoice => {
            const invoiceDate = new Date(invoice.invoiceDate);
            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            const endDate = endDateFilter ? new Date(endDateFilter) : null;

            return (
                (!startDate || invoiceDate >= startDate) &&
                (!endDate || invoiceDate <= endDate) &&
                (supplierFilter === '' || invoice.supplierRef === supplierFilter) &&
                (customerFilter === '' || invoice.customerRef === customerFilter) &&
                (productFilter === '' || invoice.products.some(product => 
                    product.id === productFilter
                ))
            );
        });
    }, [invoiceData, startDateFilter, endDateFilter, supplierFilter, customerFilter, productFilter]);

    const renderProductCell = (products) => {
        const displayProducts = products.slice(0, 2);
        const remainingProducts = products.slice(2);

        return (
            <div>
                {displayProducts.map((product, index) => (
                    <div key={index}>{productsData.find(p => p.id === product.id)?.productName}</div>
                ))}
                {remainingProducts.length > 0 && (
                    <Tooltip content={
                        <div>
                            {remainingProducts.map((product, index) => (
                                <div key={index}>{productsData.find(p => p.id === product.id)?.productName}</div>
                            ))}
                        </div>
                    }>
                        <span>+{remainingProducts.length} more</span>
                    </Tooltip>
                )}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Invoice Report</h1>
            
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
                    onSelectionChange={(supplierId) => {
                        setSupplierFilter(supplierId);
                        setProductFilter(''); // Reset product filter when supplier changes
                    }}
                >
                    {(supplier) => <AutocompleteItem key={supplier.id}>{supplier.name}</AutocompleteItem>}
                </Autocomplete>
                <Autocomplete
                    label="Customer"
                    placeholder="Select a customer"
                    defaultItems={customerData}
                    onSelectionChange={(customerId) => setCustomerFilter(customerId)}
                >
                    {(customer) => <AutocompleteItem key={customer.id}>{customer.name}</AutocompleteItem>}
                </Autocomplete>
                <Autocomplete
                    label="Product"
                    placeholder="Select a product"
                    defaultItems={filteredProducts}
                    onSelectionChange={(productId) => setProductFilter(productId)}
                    isDisabled={!supplierFilter}
                >
                    {(product) => <AutocompleteItem key={product.id}>{product.productName}</AutocompleteItem>}
                </Autocomplete>
            </div>

            <Table aria-label="Invoice table">
                <TableHeader>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>InvoiceNo.</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Recieved</TableColumn>
                    <TableColumn>Balance</TableColumn>
                    <TableColumn>View</TableColumn>
                </TableHeader>
                <TableBody>
                    {filteredInvoices.map((invoice, index) => {
                        const cust = customerLedger.filter((c,i)=>(c.invoiceRef === invoice?.id))
                        const totalr = cust.reduce((acc,item)=>(acc+item.credit),0)
                    return ( <TableRow key={index}>
                            <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                            <TableCell>{invoice.invoiceNo}</TableCell>
                            <TableCell>{invoice.grandTotal}</TableCell>
                            <TableCell>{totalr}</TableCell>
                            
                            {/* <TableCell>{renderProductCell(invoice.products)}</TableCell> */}
                            <TableCell>{invoice.grandTotal-totalr}</TableCell>
                            <TableCell>{invoice.grandTotal}</TableCell>
                        </TableRow>)
})}
                </TableBody>
            </Table>
        </div>
    );
}