import React from 'react'
import ViewArea from './ViewArea'
import { useDisclosure } from '@nextui-org/react'
import { useRecoilValue } from 'recoil';
import { categoryDataState } from '../store';
import { unitDataState } from '../store';
import { suppliersDataState } from '../store';
import { attributeDataState } from '../store';
import { attributeValueDataState } from '../store';

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
        const singleProductData = currentData.find((element) => element.id == id);
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
