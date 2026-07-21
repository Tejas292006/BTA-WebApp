import React, { useState, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { invoiceDataState } from '../../store/invoice/invoiceAtom';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { customerDataState } from '../../store/customer/customerAtom';
import { suppliersDataState } from '../../store/supplier/supplierAtom';
import { productsDataState } from '../../store/product/productAtom';
import { customerledgerDataState } from '../../store/customerledgers/customerLedgerAtom';
import { supplierledgerDataState } from '../../store/supplierledgers/supplierLedgerAtom';
import { customerpaymentDataState } from '../../store/customerpayments/customerPaymentsAtom';

export default function InvoiceReport3 () {
    const invoiceData = useRecoilValue(invoiceDataState);
    const customerData = useRecoilValue(customerDataState);
    const suppliersData = useRecoilValue(suppliersDataState);
    const productsData = useRecoilValue(productsDataState);
    const customerLedger = useRecoilValue(customerledgerDataState);
    const supplierLedger = useRecoilValue(supplierledgerDataState);
    const customerPayment = useRecoilValue(customerpaymentDataState)
    


    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [customerFilter, setCustomerFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [BalanceInvoice, setBalanceInvoice] = useState();
    console.log(invoiceData,"invoice data")

    const filteredProducts = useMemo(() => {
        return productsData.filter((product) => product.supplierName._id === supplierFilter);
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

    React.useEffect(() => {
        // Group invoices by supplierId and customerId
        // / Group invoices by supplierId and customerId
const groupedInvoices = invoiceData.reduce((acc, invoice) => {
  const key = `${invoice.supplierRef}-${invoice.customerRef}`;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(invoice);
  return acc;
}, {});

// Step 2: Deep copy the grouped invoices
const copiedGroupedInvoices = structuredClone(groupedInvoices); // Use structuredClone or JSON method

// Step 3: Apply your cumulative sum logic on the copied grouped invoices
Object.values(copiedGroupedInvoices).forEach(group => {
  let runningBalance = 0; // Initialize running balance
  group.forEach(invoice => {
    runningBalance += invoice.grandTotal; // Cumulative sum of grandTotal
    invoice.balance = runningBalance;     // Assign the cumulative sum to balance
  });
});

// Logging the results
console.log('Original Grouped Invoices:', groupedInvoices);
console.log('Copied and Modified Grouped Invoices with Cumulative Balances:', copiedGroupedInvoices);
setBalanceInvoice(Object.values(copiedGroupedInvoices).flat())
console.log('Array Invoices with Cumulative Balances:', Object.values(copiedGroupedInvoices).flat());

      }, []);
    
    const renderProductCell = (products) => {
        const displayProducts = products.slice(0, 2);
        const remainingProducts = products.slice(2);

        return (
            <div>
                {displayProducts.map((product, index) => (
                    <div key={index}>{productsData.find(p => p._id === product.id)?.productName}</div>
                ))}
                {remainingProducts.length > 0 && (
                    <Tooltip content={
                        <div>
                            {remainingProducts.map((product, index) => (
                                <div key={index}>{productsData.find(p => p._id === product.id)?.productName}</div>
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
                    defaultItems={filteredProducts}
                    onSelectionChange={(productId) => setProductFilter(productId)}
                    isDisabled={!supplierFilter}
                >
                    {(product) => <AutocompleteItem key={product._id}>{product.productName}</AutocompleteItem>}
                </Autocomplete>
            </div>

            <Table aria-label="Invoice table">
                <TableHeader>
               
                <TableColumn>INVOICE_NO</TableColumn>
                <TableColumn>DATE</TableColumn>

                    <TableColumn>SUPPLIER_NAME</TableColumn>
                    <TableColumn>CUSTOMER_NAME</TableColumn>
                    <TableColumn>AMOUNT</TableColumn>
                    <TableColumn>RECIEVED</TableColumn>
                    <TableColumn>BALANCE</TableColumn>
                    {/* <TableColumn>REMAININGTOCLIENT</TableColumn>
                    <TableColumn>REMAININGFROMCLIENT</TableColumn> */}
                </TableHeader>
                <TableBody>
                {invoiceData.map((invoice, index) => {
                    console.log(invoice)
    // Filter adjustments related to the current invoice ID from customer payments
    const adjustments = customerPayment
        .flatMap((payment) => payment.adjustments) // Extract adjustments from all customer payments
        .filter((adjustment) => adjustment.invoiceId.toString() === invoice?._id.toString()); // Match adjustments with the current invoice ID
     console.log(adjustments,"adjusments")
    const particularInvoice = BalanceInvoice?.filter((c,i)=>(c?._id === invoice?._id))
    const cust = customerLedger.filter((c,i)=>(c.invoiceRef === invoice?._id))
    const totalr = cust.reduce((acc,item)=>(acc+item.credit),0)

    // Render rows
    return (
        <TableRow key={index}>
            {/* Display the invoice number and grand total in every row */}
            <TableCell>{invoice.invoiceNo}</TableCell>
            <TableCell>{invoice.invoiceDate}</TableCell>
            <TableCell>{suppliersData.find(s => s._id === invoice.supplierRef)?.name}</TableCell>
            <TableCell>{customerData.find(c => c._id === invoice.customerRef)?.name}</TableCell>
            <TableCell>{invoice.grandTotal}</TableCell>
            <TableCell>{totalr}</TableCell>
            <TableCell>{adjustments?.[0]?.balance || particularInvoice?.[0]?.balance}</TableCell>

            {/* Display remaining balance */}
            {/* <TableCell>{adjustments[index]?.remaining || 0}</TableCell> */}
            
            
            
            {/* <TableCell>{adjustments[i]?.whomToPay === "supplier" ? adjustments[i]?.adjust : 0}</TableCell>
            <TableCell>{adjustments[i]?.adjust}</TableCell>
            <TableCell>{invoice.grandTotal}</TableCell> */}
        </TableRow> )

})}

                </TableBody>
            </Table>
        </div>
    );
}