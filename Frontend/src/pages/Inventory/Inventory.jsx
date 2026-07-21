import React from 'react'
import './Inventory.css'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { FaCut } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { UilRuler,UilCube,UilArrowsHAlt , UilPalette, UilSlack, UilLightbulbAlt, UilCheckCircle, UilUsersAlt, UilFilter, UilCreateDashboard, } from '@iconscout/react-unicons'
import ProductPage from '../../components/ProductPage/ProductPage';
import Suppliers from '../../components/Suppliers/Suppliers';
import Categories from '../../components/Categories/Categories';
// import Quality from '../../components/Quality/Quality';
// import Design from '../../components/Design/Design';
// import FinishType from '../../components/Finish-Type/Finish-Type';
// import FeelType from '../../components/Feel-Type/Feel-Type';
// import Weave from '../../components/Weave/Weave';
// import Width from '../../components/Width/Width';
import Unit from '../../components/unit/Unit';
import Cut from '../../components/cut/Cut';
import { productsDataState } from '../../store/product/productAtom';
import { useRecoilValue } from 'recoil';
import { suppliersDataState } from '../../store/supplier/supplierAtom';
import { categoryDataState } from '../../store/category/category';
// import { qualityDataState } from '../../store/quality/qualityAtom';
// import { designDataState } from '../../store/design/designAtom';
// import { finishtypeDataState } from '../../store/finishtype/finishtypeAtom';
// import { feeltypeDataState } from '../../store/feeltype/feeltypeAtom';
// import { weaveDataState } from '../../store/weave/weaveAtom';
// import { widthDataState } from '../../store/width/widthAtom';
import { unitDataState } from '../../store/unit/unitAtom';
import { cutDataState } from '../../store/cut/cutAtom';

import { PiTreeStructureBold } from "react-icons/pi";
import { TbListTree } from "react-icons/tb";

import Attribute from '../../components/Attribute/Attribute';
import AttributeValue from '../../components/AttributeValue/AttributeValue';
import { attributeDataState } from '../../store/attribute/attributeAtom';
import { attributeValueDataState } from '../../store/attributevalue/attributevalueAtom';
import PaymentMode from '../../components/paymentmode/PaymentMode';
import { paymentModeState } from '../../store/paymentmode/paymentModeAtom';

const Inventory = () => {

    const productsData = useRecoilValue(productsDataState);
    const supplierData = useRecoilValue(suppliersDataState);
    const categoryData = useRecoilValue(categoryDataState);
    const attributeData = useRecoilValue(attributeDataState);
    const attributeValueData = useRecoilValue(attributeValueDataState);
    const unitData = useRecoilValue(unitDataState);
    const paymentModeData = useRecoilValue(paymentModeState);
    const cutData = useRecoilValue(unitDataState);



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
                        key="Products"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilCube />
                                <span>Products</span>
                                <Chip size="sm" variant="light">{productsData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <ProductPage />
                    </Tab>
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
                    >
                        <Suppliers />
                    </Tab>
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
                    >
                        <Categories />
                    </Tab>
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
                    >
                        <Attribute/>
                    </Tab>
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
                    >
                        <AttributeValue/>
                    </Tab>
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
                    >
                        <Unit />
                    </Tab>
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
                    >
                        <PaymentMode />
                    </Tab>
                    {/* <Tab
                        key="Quality"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilFilter />
                                <span>Quality</span>
                                <Chip size="sm" variant="light">{qualityData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <Quality />
                    </Tab>
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
                    >
                        <Design />
                    </Tab>
                    <Tab
                        key="Finsh-Type"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilCheckCircle />
                                <span>Finsh-Type</span>
                                <Chip size="sm" variant="light">{finishData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <FinishType />
                    </Tab>
                    <Tab
                        key="Feel-Type"
                        title={
                            <div className="flex items-center space-x-2 ">
                                <UilLightbulbAlt />
                                <span>Feel-Type</span>
                                <Chip size="sm" variant="light">{feelData?.length}</Chip>
                            </div>
                        }
                        className="max-h-max px-5 "
                    >
                        <FeelType />
                    </Tab>
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
                    >
                        <Weave />
                    </Tab>
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
                    >
                        <Width />
                    </Tab>
                    */}
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
                    >
                        <Cut />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default Inventory
