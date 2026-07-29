
import { Tabs, Tab, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import GenerateInvoice from "../../components/GenerateInvoice/GenerateInvoice";
import { useRecoilValue, waitForAll } from "recoil";
import { invoiceDataState } from "../../store/invoice/invoiceAtom";
import { customerDataState } from "../../store/customer/customerAtom";
import { suppliersDataState } from "../../store/supplier/supplierAtom";
import { customerledgerDataState } from "../../store/customerledgers/customerLedgerAtom";
import { useNavigate } from "react-router-dom";


const Invoice = () => {
    useRecoilValue(waitForAll([
        invoiceDataState,
        customerDataState,
        suppliersDataState,
        customerledgerDataState
    ]));
    
    const invoiceData = useRecoilValue(invoiceDataState);
    const customerData = useRecoilValue(customerDataState);
    const suppliersData = useRecoilValue(suppliersDataState);
    const customerLedger = useRecoilValue(customerledgerDataState);
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getInvoicePaymentStatus = (invoice) => {
        const ledgerEntries = customerLedger.filter(entry => entry.invoiceRef === invoice?.id);
        const totalPaid = ledgerEntries.reduce((acc, entry) => acc + (entry.credit || 0), 0);
        return { totalPaid, balance: (invoice.grandTotal || 0) - totalPaid };
    };

    const paidInvoices = invoiceData.filter(invoice => {
        const { balance } = getInvoicePaymentStatus(invoice);
        return balance <= 0;
    });

    const unpaidInvoices = invoiceData.filter(invoice => {
        const { balance } = getInvoicePaymentStatus(invoice);
        return balance > 0;
    });


    return (
        <div className='inventory-main '>
            <div className="flex w-full flex-col mt-2">
                <Tabs
                    aria-label="Options"
                    color="secondary"
                    variant="underlined"
                    classNames={{
                        tabList: "gap-6 w-full ml-3 relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-[#000]",
                        tab: "max-w-fit px-0 h-12 font-font1",
                        tabContent: "group-data-[selected=true]:text-[#000]"
                    }}
                >
                    <Tab
                        key="generate"
                        title={
                            <div className="flex items-center space-x-2 ">
                               
                                <span>Generate</span>
                                <Chip size="sm" variant="light">{invoiceData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <GenerateInvoice/>
                    </Tab>
                    <Tab
                        key="Paid"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <img width="30" height="30" src="https://img.icons8.com/ios/50/paid-bill.png" alt="paid-bill"/>                      
                             
                                <span>Paid</span>
                                <Chip size="sm" variant="light">{paidInvoices?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <div className="space-y-4 px-4">
                            <h2 className="text-2xl font-bold font-font2">Paid Invoices</h2>
                            {paidInvoices.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 font-font1">
                                    <p className="text-lg">No paid invoices found</p>
                                </div>
                            ) : (
                                <Table aria-label="Paid invoices table">
                                    <TableHeader>
                                        <TableColumn>Invoice No</TableColumn>
                                        <TableColumn>Date</TableColumn>
                                        <TableColumn>Supplier</TableColumn>
                                        <TableColumn>Customer</TableColumn>
                                        <TableColumn>Grand Total</TableColumn>
                                        <TableColumn>Paid</TableColumn>
                                        <TableColumn>View</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {paidInvoices.map((invoice, index) => {
                                            const { totalPaid } = getInvoicePaymentStatus(invoice);
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{invoice.invoiceNo}</TableCell>
                                                    <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                                                    <TableCell>{suppliersData.find(s => s.id === invoice.supplierRef)?.name || 'N/A'}</TableCell>
                                                    <TableCell>{customerData.find(c => c.id === invoice.customerRef)?.name || 'N/A'}</TableCell>
                                                    <TableCell className="font-bold">{invoice.grandTotal}</TableCell>
                                                    <TableCell className="text-green-600 font-bold">{totalPaid}</TableCell>
                                                    <TableCell>
                                                        <Tooltip content="View Invoice">
                                                            <span 
                                                                className="text-lg text-blue-500 cursor-pointer hover:text-blue-700"
                                                                onClick={() => navigate(`/invoice-preview/${invoice.id}`)}
                                                            >
                                                                👁
                                                            </span>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </Tab>
                    <Tab
                        key="Unpaid"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <span>Unpaid</span>
                                <Chip size="sm" variant="light">{unpaidInvoices?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <div className="space-y-4 px-4">
                            <h2 className="text-2xl font-bold font-font2">Unpaid Invoices</h2>
                            {unpaidInvoices.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 font-font1">
                                    <p className="text-lg">No unpaid invoices found</p>
                                </div>
                            ) : (
                                <Table aria-label="Unpaid invoices table">
                                    <TableHeader>
                                        <TableColumn>Invoice No</TableColumn>
                                        <TableColumn>Date</TableColumn>
                                        <TableColumn>Supplier</TableColumn>
                                        <TableColumn>Customer</TableColumn>
                                        <TableColumn>Grand Total</TableColumn>
                                        <TableColumn>Paid</TableColumn>
                                        <TableColumn>Balance</TableColumn>
                                        <TableColumn>View</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {unpaidInvoices.map((invoice, index) => {
                                            const { totalPaid, balance } = getInvoicePaymentStatus(invoice);
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{invoice.invoiceNo}</TableCell>
                                                    <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                                                    <TableCell>{suppliersData.find(s => s.id === invoice.supplierRef)?.name || 'N/A'}</TableCell>
                                                    <TableCell>{customerData.find(c => c.id === invoice.customerRef)?.name || 'N/A'}</TableCell>
                                                    <TableCell className="font-bold">{invoice.grandTotal}</TableCell>
                                                    <TableCell className="text-green-600">{totalPaid}</TableCell>
                                                    <TableCell className="text-red-600 font-bold">{balance}</TableCell>
                                                    <TableCell>
                                                        <Tooltip content="View Invoice">
                                                            <span 
                                                                className="text-lg text-blue-500 cursor-pointer hover:text-blue-700"
                                                                onClick={() => navigate(`/invoice-preview/${invoice.id}`)}
                                                            >
                                                                👁
                                                            </span>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Invoice
