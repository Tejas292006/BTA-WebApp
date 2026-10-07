import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UilAngleLeft } from '@iconscout/react-unicons';
import { GetinvoiceDataByID } from '../api';
// import { message } from 'antd';
// import { BiDownload } from 'react-icons/bi';
// import { BsCurrencyRupee } from 'react-icons/bs';
import logo from '../assets/textile.jpg';

const InvoicePreview = () => {
    const params = useParams();
    const navigate = useNavigate();
    const url = params.id;
    console.log(params.id);

    const [invoice, setInvoice] = useState(null);
    // const componentRef = useRef();
    const handlePrint = () => {
        window.print();
    }

    const GetInvoiceIdPreview = async (id) => {
        try {
            const response = await GetinvoiceDataByID(id);
            if (response.success) {
                setInvoice(response.invoice);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        GetInvoiceIdPreview(params.id);
    }, [])

    console.log(invoice)

    return (
        <div>
            {invoice ? (
                <>
                    <section className='border text-black bg-[#e3e3e3] min-h-[100vh]'>
                        <div className='flex gap-3 fixed top-5 left-5 z-50'>
                            <button
                                onClick={() => navigate(-1)}
                                className='flex items-center gap-1 px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-gray-800 rounded-full shadow-lg transition-all cursor-pointer'
                            >
                                <UilAngleLeft className="w-5 h-5" />
                                Back
                            </button>
                        </div>
                        <div onClick={handlePrint} className=' w-fit text-sm text-white bg-[#202020] create cursor-pointer fixed bottom-5 right-[3.2%] py-2 px-4 rounded-full z-50'>Download</div>
                        <div className=' max-w-[1290px] mx-auto px-4 my-8'>
                            {/* Page starts here (down) */}
                            <div className='border bg-[#fdfdfd] p-8'>
                                <div className='flex  md:flex-row md:gap-0  items-center justify-between mt-[1rem] mb-[4rem]'>
                                    <div className='text-center md:text-left'>
                                        <p className='text-6xl text-black first-letter:mb-2 '>Invoice  </p>
                                        <p className='text-xl text-[#12121271]'>#{invoice?.invoiceNo || invoice?.challanRef?.challanNo || invoice?.id}</p>
                                    </div>
                                    <div className='print:bg-red-500 bg-[#121212] px-4 py-2 rounded-lg w-[10rem]'>
                                        <img src={logo} alt="" />
                                    </div>
                                </div>

                                {/* sender and client details */}
                                <div className=' grid grid-cols-1 md:grid-cols-3  border-[#2727278d]'>
                                    <div className='border-t border-b text-justify flex flex-col gap-6 py-6 col-span-1 px-4 border-[#2727278d]'>
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-xl text-black'>Issued on</p>
                                            <p className='text-[#0000007f] font-extrabold'> {invoice.invoiceDate || (invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A')}</p>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-xl text-black'>Status</p>
                                            <p className='font-extrabold'>
                                                {invoice.isCleared ? <span className='text-green-600'>Cleared / Paid</span> : <span className='text-amber-600'>Pending</span>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className=' md:border col-span-1 text-justify py-6 px-4 border-[#2727278d]'>
                                        <div className='flex flex-col gap-3 '>
                                            <p className='text-xl'>Billed to</p>
                                            <div className='text-[#0000007f] text-lg font-extrabold'>
                                                <p className='text-[#000000aa]'>{invoice?.customer?.name || invoice?.challanRef?.customer?.name || 'N/A'}</p>
                                                <p>{invoice?.customer?.companyName || invoice?.challanRef?.customer?.companyName || ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border-t border-b text-justify py-6 col-span-1 px-4 border-[#2727278d]'>
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-xl'>From</p>
                                            <div className='text-[#0000007f] text-lg font-extrabold'>
                                                <p className='text-[#000000aa]'>{invoice?.supplier?.name || invoice?.challanRef?.supplier?.name || 'N/A'}</p>
                                                <p>{invoice?.supplier?.address || invoice?.challanRef?.supplier?.address || ''}</p>
                                                <p>{invoice?.supplier?.brand || invoice?.challanRef?.supplier?.brand || ''} </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div>
                                    <table className="border-collapse mt-6 w-full border border-[#2727278d]">
                                        <thead>
                                            <tr className="border-2 border-[#2727278d] bg-gray-100 text-[0.8rem] font-semibold text-center">
                                                <th className="p-3">#</th>
                                                <th className="p-3 text-left">PRODUCT</th>
                                                <th className="p-3">CUT</th>
                                                <th className="p-3">UNIT</th>
                                                <th className="p-3">QTY / BALES</th>
                                                <th className="p-3">RATE (₹)</th>
                                                <th className="p-3">RECEIVED</th>
                                                <th className="p-3">DUE</th>
                                                <th className="p-3">TOTAL (₹)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(invoice.products) && invoice.products.length > 0 ? (
                                                invoice.products.map((row, idx) => {
                                                    const prodName = typeof row.product === 'object' ? row.product?.productName : row.product;
                                                    const cutVal = typeof row.cut === 'object' ? row.cut?.name : row.cut;
                                                    const unitVal = row.unit === '1' ? 'Pcs' : (row.unit === '2' ? 'Mtr' : (row.unit || 'Pcs'));
                                                    const qtyVal = row.bales && row.bales !== 'NA' ? `${row.bales} bales` : (row.qtyPcs && row.qtyPcs !== 'NA' ? `${row.qtyPcs} pcs` : (row.qtyMtr && row.qtyMtr !== 'NA' ? `${row.qtyMtr} mtr` : '-'));
                                                    const receivedVal = row.received_pcs || row.received_mtr || row.received_bales || row.received || 0;
                                                    const dueVal = row.due != null ? row.due : 0;
                                                    const rateVal = row.rate || 0;
                                                    const totalVal = row.total || (Number(rateVal) * Number(receivedVal || dueVal || 0));

                                                    return (
                                                        <tr className="border-2 text-center text-[0.9rem] border-[#2727278d]" key={idx}>
                                                            <td className="p-3">{idx + 1}</td>
                                                            <td className="p-3 text-left font-medium">{prodName || 'Product'}</td>
                                                            <td className="p-3">{cutVal || '-'}</td>
                                                            <td className="p-3">{unitVal}</td>
                                                            <td className="p-3">{qtyVal}</td>
                                                            <td className="p-3">{rateVal}</td>
                                                            <td className="p-3 text-green-700 font-semibold">{receivedVal}</td>
                                                            <td className="p-3 text-red-600 font-semibold">{dueVal}</td>
                                                            <td className="p-3 font-bold">{totalVal}</td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="9" className="p-4 text-center text-gray-500">No products recorded on this invoice</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    {/* the subtotal wala part */}
                                    <section className='text-white grid grid-cols-1 justify-center border-t border-black py-8 md:grid-cols-3  md:gap-4 mb-[25rem]  mt-16'>
                                        <div className='col-span-2  text-black p-4  border-[#2f2f31]'>
                                            <div className='border rounded-xl  border-black'>
                                                <p className='mb-2 text-black text-lgjakarta-font relative bottom-4 left-2 bg-white w-fit px-2'>Overall Remarks</p>
                                                <p className='mx-4 mb-4 text-justify'>{invoice?.overallremarks || invoice?.challanRef?.overallremarks || 'None'}</p>
                                            </div>
                                        </div>

                                        <div className='flex gap-4 border border-dashed border-[#121212] flex-col col-span-1 p-6 rounded-2xl '>
                                            <div className=' flex flex-col p-6 gap-4 rounded-2xl'>
                                                <div className='px-4 rounded-full flex items-center justify-between h-fit py-3 text-black  border-black'>
                                                    <div className='text-base font-semibold'>
                                                        Grand Total
                                                    </div>
                                                    <div className='flex items-center justify-center '>
                                                        <span className='text-green-500 mr-2 class font-bold'>Rs.</span>
                                                        <p className='w-[5rem] font-bold text-lg'>{invoice.grandTotal || invoice.totalBillingAmount || 0}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>


                                    {/* footer  */}
                                    <footer>
                                        <p>This is computer generated invoice , no signature required</p>
                                    </footer>


                                    {/* <footer>
                                        <div className='text-lg border-b pb-4 border-[#686868]'>Thank you for bussiness</div>

                                        <div className='flex items-center  mt-3 py-4   justify-between'>
                                            <div>Itx 3D Studio</div>
                                            <div>7451152182</div>
                                            <div>itx3dstudio@gmail.com</div>
                                        </div>
                                    </footer> */}

                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <p>Loading invoice data...</p>
            )}
        </div>
    );
};

export default InvoicePreview;