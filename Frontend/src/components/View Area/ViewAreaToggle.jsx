import React from 'react'
import ViewArea from './ViewArea'
import { useDisclosure } from '@nextui-org/react'
import { useRecoilValue } from 'recoil';
import { categoryDataState } from '../../store/category/category';
import { unitDataState } from '../../store/unit/unitAtom';
import { suppliersDataState } from '../../store/supplier/supplierAtom';
import { attributeDataState } from '../../store/attribute/attributeAtom';
import { attributeValueDataState } from '../../store/attributevalue/attributevalueAtom';

const ViewAreaToggle = ({ section, id ,isOpen, onOpenChange, onClose }) => {
    
    const recoilStates = {
        attribute: useRecoilValue(attributeDataState),
        attributeValue: useRecoilValue(attributeValueDataState),
        category: useRecoilValue(categoryDataState),
        supplier : useRecoilValue(suppliersDataState),
        unit: useRecoilValue(unitDataState)
    };

    const [currentData, setCurrentData] = React.useState(recoilStates[section] || []);
    const [unitData,setUnitData] = React.useState([]);

    React.useEffect(() => {
        setCurrentData(recoilStates[section] || []);
    }, [section]);

    React.useEffect(()=>{
        const singleProductData = currentData.find((element) => element._id == id);
        setUnitData(singleProductData);
    },[currentData,id])

    // console.log(unitData)
    // console.log(isOpen)
    // console.log(onOpenChange)
    // console.log(isOpen)
    return (
        <div>
            <ViewArea isOpen={isOpen} onClose={onClose} section={section} onOpenChange={onOpenChange} data={unitData} />
        </div>
    )
}

export default ViewAreaToggle
