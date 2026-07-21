
import { Tabs, Tab, Chip } from "@nextui-org/react";
import GenerateInvoice from "../../components/GenerateInvoice/GenerateInvoice";


const Invoice = () => {


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
                                <Chip size="sm" variant="light"></Chip>
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
                                <Chip size="sm" variant="light"></Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                    </Tab>
                    <Tab
                        key="Unpaid"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <span>Unpaid</span>
                                <Chip size="sm" variant="light"></Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Invoice
