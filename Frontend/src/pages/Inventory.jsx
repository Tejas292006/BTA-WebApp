import React, { useRef, useState, useEffect } from 'react'
import './Inventory.css'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { FaCut } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { UilRuler,UilCube,UilArrowsHAlt , UilPalette, UilSlack, UilLightbulbAlt, UilCheckCircle, UilUsersAlt, UilFilter, UilCreateDashboard, UilAngleLeft, UilAngleRight } from '@iconscout/react-unicons'
import ProductPage from '../components/ProductPage';
import Suppliers from '../components/Suppliers';
import Categories from '../components/Categories';
import Quality from '../components/Quality';
import Design from '../components/Design';
import FinishType from '../components/Finish-Type';
import FeelType from '../components/Feel-Type';
import Weave from '../components/Weave';
import Width from '../components/Width';
import Unit from '../components/Unit';
import Cut from '../components/Cut';
import { waitForAll, useRecoilValue } from 'recoil';
import { productsDataState } from '../store';
import { suppliersDataState } from '../store';
import { categoryDataState } from '../store';
import { qualityDataState } from '../store';
import { designDataState } from '../store';
import { finishtypeDataState } from '../store';
import { feeltypeDataState } from '../store';
import { weaveDataState } from '../store';
import { widthDataState } from '../store';
import { unitDataState } from '../store';
import { cutDataState } from '../store';

import { PiTreeStructureBold } from "react-icons/pi";
import { TbListTree } from "react-icons/tb";

import Attribute from '../components/Attribute';
import AttributeValue from '../components/AttributeValue';
import { attributeDataState } from '../store';
import { attributeValueDataState } from '../store';
import PaymentMode from '../components/PaymentMode';
import { paymentModeState } from '../store';

const Inventory = () => {

    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [activeTab, setActiveTab] = useState("Products");

    useRecoilValue(waitForAll([
        productsDataState,
        suppliersDataState,
        categoryDataState,
        attributeDataState,
        attributeValueDataState,
        unitDataState,
        paymentModeState,
        cutDataState,
        qualityDataState,
        designDataState,
        finishtypeDataState,
        feeltypeDataState,
        weaveDataState,
        widthDataState
    ]));

    const productsData = useRecoilValue(productsDataState);
    const supplierData = useRecoilValue(suppliersDataState);
    const categoryData = useRecoilValue(categoryDataState);
    const attributeData = useRecoilValue(attributeDataState);
    const attributeValueData = useRecoilValue(attributeValueDataState);
    const unitData = useRecoilValue(unitDataState);
    const paymentModeData = useRecoilValue(paymentModeState);
    const cutData = useRecoilValue(cutDataState);
    const qualityData = useRecoilValue(qualityDataState);
    const designData = useRecoilValue(designDataState);
    const finishtypeData = useRecoilValue(finishtypeDataState);
    const feeltypeData = useRecoilValue(feeltypeDataState);
    const weaveData = useRecoilValue(weaveDataState);
    const widthData = useRecoilValue(widthDataState);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (el) {
            setShowLeftArrow(el.scrollLeft > 5);
            setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (el) el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const scrollTabs = (direction) => {
        const el = scrollRef.current;
        if (el) {
            el.scrollBy({ left: direction * 250, behavior: 'smooth' });
        }
    };

    const tabContent = {
        Products: <ProductPage />,
        Suppliers: <Suppliers />,
        Category: <Categories />,
        Attributes: <Attribute />,
        AttributeValues: <AttributeValue />,
        Unit: <Unit />,
        PaymentMode: <PaymentMode />,
        Quality: <Quality />,
        Design: <Design />,
        "Finsh-Type": <FinishType />,
        "Feel-Type": <FeelType />,
        Weave: <Weave />,
        Width: <Width />,
        Cut: <Cut />,
    };

    return (
        <div className='inventory-main'>
            <div className="w-full mt-2 relative">
                {showLeftArrow && (
                    <button
                        onClick={() => scrollTabs(-1)}
                        className="absolute left-0 top-0 z-20 h-12 w-10 bg-gradient-to-r from-white via-white/90 to-transparent flex items-center justify-start pl-1 cursor-pointer"
                    >
                        <UilAngleLeft className="h-6 w-6 text-gray-700" />
                    </button>
                )}
                <div
                    ref={scrollRef}
                    className="overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <Tabs
                        aria-label="Options"
                        color="secondary"
                        variant="underlined"
                        selectedKey={activeTab}
                        onSelectionChange={setActiveTab}
                        classNames={{
                            tabList: "gap-6 w-max ml-3 relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-[#000]",
                            tab: "max-w-fit px-0 h-12 font-font1",
                            tabContent: "group-data-[selected=true]:text-[#000]"
                        }}
                    >
                        <Tab
                            key="Products"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilCube />
                                    <span>Products</span>
                                    <Chip size="sm" variant="light">{productsData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Suppliers"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilUsersAlt />
                                    <span>Suppliers</span>
                                    <Chip size="sm" variant="light">{supplierData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Category"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilCreateDashboard />
                                    <span>Categories</span>
                                    <Chip size="sm" variant="light">{categoryData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Attributes"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <PiTreeStructureBold style={{ fontSize: '23px' }}/>
                                    <span>Attributes</span>
                                    <Chip size="sm" variant="light">{attributeData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="AttributeValues"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <TbListTree style={{ fontSize: '23px' }}/>
                                    <span>AttributeValues</span>
                                    <Chip size="sm" variant="light">{attributeValueData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Unit"
                            title={
                                <div className="flex items-center space-x-2 ">
                                  <UilRuler/>
                                    <span>Unit</span>
                                    <Chip size="sm" variant="light">{unitData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="PaymentMode"
                            title={
                                <div className="flex items-center space-x-2 ">
                                <GrTransaction/>
                                    <span>Payment Mode</span>
                                    <Chip size="sm" variant="light">{paymentModeData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Quality"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilFilter />
                                    <span>Quality</span>
                                    <Chip size="sm" variant="light">{qualityData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Design"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilPalette />
                                    <span>Design</span>
                                    <Chip size="sm" variant="light">{designData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Finsh-Type"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilCheckCircle />
                                    <span>Finsh-Type</span>
                                    <Chip size="sm" variant="light">{finishtypeData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Feel-Type"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilLightbulbAlt />
                                    <span>Feel-Type</span>
                                    <Chip size="sm" variant="light">{feeltypeData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Weave"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilSlack />
                                    <span>Weave</span>
                                    <Chip size="sm" variant="light">{weaveData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Width"
                            title={
                                <div className="flex items-center space-x-2 ">
                                    <UilArrowsHAlt  />
                                    <span>Width</span>
                                    <Chip size="sm" variant="light">{widthData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                        <Tab
                            key="Cut"
                            title={
                                <div className="flex items-center space-x-2 ">
                                  <FaCut/>
                                    <span>Cut</span>
                                    <Chip size="sm" variant="light">{cutData?.length}</Chip>
                                </div>
                            }
                            className="max-h-max px-5 "
                        />
                    </Tabs>
                </div>
                {showRightArrow && (
                    <button
                        onClick={() => scrollTabs(1)}
                        className="absolute right-0 top-0 z-20 h-12 w-10 bg-gradient-to-l from-white via-white/90 to-transparent flex items-center justify-end pr-1 cursor-pointer"
                    >
                        <UilAngleRight className="h-6 w-6 text-gray-700" />
                    </button>
                )}
            </div>
            <div className="mt-1">
                {tabContent[activeTab]}
            </div>
        </div>
    )
}

export default Inventory
