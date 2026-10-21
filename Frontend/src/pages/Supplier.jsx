import React from 'react'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { useRecoilValue, waitForAll } from 'recoil';
import { suppliersDataState } from '../store';
import { FaStore } from "react-icons/fa";
import Suppliers from '../components/Suppliers';

const Supplier = () => {

    useRecoilValue(waitForAll([
        suppliersDataState,
    ]));

    const suppliersData = useRecoilValue(suppliersDataState);

    return (
        <div className='inventory-main '>
            <div className="flex w-full flex-col mt-2">
                <Tabs
                    aria-label="Options"
                    color="secondary"
                    variant="underlined"
                    classNames={{
                        tabList: "gap-6 w-full ml-3 relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-[#000] dark:bg-[#d8f275]",
                        tab: "max-w-fit px-0 h-12 font-font1",
                        tabContent: "group-data-[selected=true]:text-[#000] dark:group-data-[selected=true]:text-white"
                    }}
                >
                    <Tab
                        key="suppliers"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <FaStore />
                                <span>Suppliers</span>
                                <Chip size="sm" variant="light">{suppliersData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Suppliers />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Supplier
