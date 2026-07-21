import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetinvoiceDataByID } from '../../apis/invoice';
// import { message } from 'antd';
// import { BiDownload } from 'react-icons/bi';
// import { BsCurrencyRupee } from 'react-icons/bs';
import logo from '../../assets/textile.jpg';

const InvoicePreview = () => {
    const params = useParams();
    const url = params.id;
    console.log(params.id);

    const [invoice, setInvoice] = useState([]); // Initialize with null
    // const componentRef = useRef();
    const handlePrint = () => {
        window.print();
    }

    const GetInvoiceIdPreview = async (id) => {
        try {
            const response = await GetinvoiceDataByID(id);
            console.log(response.invoices)
            setInvoice(response.invoices[0])
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
                        <div onClick={handlePrint} className=' w-fit text-sm text-white bg-[#202020] create cursor-pointer fixed bottom-5 right-[3.2%] py-2 px-4 rounded-full z-50'>Download</div>
                        <div className=' max-w-[1290px] mx-auto px-4 my-8'>
                            {/* Page starts here (down) */}
                            <div className='border bg-[#fdfdfd] p-8'>
                                <div className='flex  md:flex-row md:gap-0  items-center justify-between mt-[1rem] mb-[4rem]'>
                                    <div className='text-center md:text-left'>
                                        <p className='text-6xl text-black first-letter:mb-2 '>Invoice  </p>
                                        <p className='text-xl text-[#12121271]'>#{invoice?.challanRef?.challanNo}</p>
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
                                            <p className='text-[#0000007f] font-extrabold'> {invoice.createdAt}</p>
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-xl text-black'>Due on</p>
                                            {/* <p className='text-[#0000007f] font-extrabold'>
                                                {
                                                    invoice.payment_status ? <span className='text-green-500'>Paid</span> :
                                                        moment(invoice.createdAt).add(15, 'days').format("DD MMM YYYY")
                                                }
                                            </p> */}
                                        </div>
                                    </div>
                                    <div className=' md:border col-span-1 text-justify py-6 px-4 border-[#2727278d]'>
                                        <div className='flex flex-col gap-3 '>
                                            <p className='text-xl'>Billed to</p>
                                            <div className='text-[#0000007f] text-lg font-extrabold'>
                                                <p className='text-[#000000aa]'>{invoice?.challanRef?.customer?.name}</p>
                                                <p>{invoice?.challanRef?.customer?.companyName}</p>
                                                {/* <p>{invoice.client_city} , {invoice.client_state}</p>
                                                <p>Tel No. : {invoice.client_no}</p> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='border-t border-b text-justify py-6 col-span-1 px-4 border-[#2727278d]'>
                                        <div className='flex flex-col gap-3'>
                                            <p className='text-xl'>From</p>
                                            <div className='text-[#0000007f] text-lg font-extrabold'>
                                                <p className='text-[#000000aa]'>{invoice?.challanRef?.supplier?.name}</p>
                                                <p>{invoice?.challanRef?.supplier?.address}</p>
                                                <p>{invoice?.challanRef?.supplier?.brand} </p>
                                                {/* <p>Tel No. : {invoice.sender_no}</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div>
                                    <table className="border-collapse mt-6 w-full border border-[#2727278d]">
                                        <thead>
                                            <tr className="border-2 border-[#2727278d]  text-[0.8rem] font-normal p-6 ">
                                                {invoice?.challanRef?.products?.length > 0 &&
                                                    Object.entries(invoice.challanRef?.products[0]).map(
                                                        ([key, value], index) => {
                                                            console.log(key);
                                                            if (key === "challanChartImages" || key === "_id") {
                                                                return;
                                                            }
                                                            return (
                                                                <th className="p-4" key={index}>
                                                                    {key.toUpperCase()}
                                                                </th>
                                                            );
                                                        }
                                                    )}

                                                <th>RECEIVED</th>
                                                <th>DUE</th>
                                            </tr>


                                        </thead>
                                        <tbody>
                                            {invoice?.challanRef?.products &&
                                                invoice?.challanRef?.products?.map((row, rowIndex) => (
                                                    // console.log(row)
                                                    <tr
                                                        className="border-2 text-center text-[0.9rem] border-[#2727278d] max-h-[6rem] mt-2"
                                                        key={rowIndex}
                                                    >
                                                        {Object.entries(row).map(
                                                            ([key, value], cellIndex) => {
                                                                if (key === "challanChartImages" || key === "_id") {
                                                                    return;
                                                                }
                                                                return (
                                                                    <td className="p-4 border-[#2727278d]" key={cellIndex}>
                                                                        {key.toLowerCase() ===
                                                                            "challanChartImages"
                                                                            ? null
                                                                            : value}
                                                                    </td>
                                                                );
                                                            }
                                                        )}

                                                        {
                                                            invoice.products &&
                                                            <>
                                                                <td>{invoice.products?.[rowIndex]?.received}</td>
                                                                <td>{invoice.products?.[rowIndex]?.due}</td>
                                                            </>
                                                        }
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>

                                    {/* the subtotal wala part */}
                                    <section className='text-white grid grid-cols-1 justify-center border-t border-black py-8 md:grid-cols-3  md:gap-4 mb-[25rem]  mt-16'>
                                        <div className='col-span-2  text-black p-4  border-[#2f2f31]'>
                                            <div className='border rounded-xl  border-black'>

                                                <p className='mb-2 text-black text-lgjakarta-font relative bottom-4 left-2 bg-white w-fit px-2'>Overall Remarks</p>

                                                <p className='mx-4 mb-4 text-justify'>{invoice?.challanRef?.overallremarks}</p>
                                            </div>

                                        </div>

                                        <div className='flex gap-4 border border-dashed border-[#121212] flex-col col-span-1 p-6 rounded-2xl '>
                                            <div className=' flex flex-col p-6 gap-4 rounded-2xl'>



                                                <div className='px-4 rounded-   full  flex items-center justify-between h-fit py-3 text-black  border-black'>
                                                    <div className='text-base'>
                                                        Grand Total
                                                    </div>
                                                    <div className='flex items-center justify-center '>
                                                        <span className='text-green-500 mr-2 class'>Rs.</span>

                                                        <p className='w-[5rem] '>{invoice.grandTotal}</p>
                                                        
                                                        
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