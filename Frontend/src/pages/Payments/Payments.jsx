import React from 'react'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { UilRuler,UilCube,UilArrowsHAlt , UilPalette, UilSlack, UilLightbulbAlt, UilCheckCircle, UilUsersAlt, UilFilter, UilCreateDashboard, } from '@iconscout/react-unicons'
import { useRecoilValue } from 'recoil';
import CustomerPayment from '../../components/CustomerPayments/CustomerPayment';
import SupplierPayment from '../../components/SupplierPayments/SupplierPayment';
import { supplierpaymentDataState } from '../../store/supplierpayments/supplierPaymentsAtom';
import { customerpaymentDataState } from '../../store/customerpayments/customerPaymentsAtom';

const Payments = () => {

    const supplierPaymentData = useRecoilValue(supplierpaymentDataState);
    const customerPaymentData = useRecoilValue(customerpaymentDataState);

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
                        key="customerpayments"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilUsersAlt />
                                <span>Customer payments</span>
                                <Chip size="sm" variant="light">{customerPaymentData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <CustomerPayment />
                    </Tab>

                    <Tab
                        key="supplierpayments"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilUsersAlt />
                                <span>Supplier payments</span>
                                <Chip size="sm" variant="light">{supplierPaymentData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <SupplierPayment />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Payments