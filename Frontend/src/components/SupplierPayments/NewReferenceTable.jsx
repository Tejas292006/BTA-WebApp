import axios from 'axios';
import { IndianRupee } from 'lucide-react';
import React, { useEffect, useState } from 'react'

export default function NewReferenceTable({ customerData, balanceUsed, currentBalance, setCurrentBalance, newTotalAmountEntered, setCustomerData, newRefData, setNewRefData, setNewTotalAmountEntered, currentSupplierId, currentCustomerId, onAdjustChange }) {
  const [adjustAmount, setAdjustAmount] = useState(0);
  const [supplierBalanceExists, setSupplierBalanceExists] = useState(null);

  useEffect(() => {
    if (currentSupplierId || currentCustomerId) {
      const currentCustomer = customerData?.find(customer => customer._id === currentCustomerId);
      if (currentCustomer) {
        const supplierBalance = currentCustomer.supplierBalances.find(
          sb => sb.supplier.toString() === currentSupplierId
        );
        console.log(supplierBalance)

        const existingBalance = supplierBalance?.balance
        if (supplierBalance) {
          setCurrentBalance(supplierBalance.balance);
          // if (balanceUsed && existingBalance >= 0 ) {
          //   setCurrentBalance(0);
          // }
          console.log(supplierBalance);
          setSupplierBalanceExists(true);
        } else {
          setCurrentBalance(0);
          setSupplierBalanceExists(false);
          handleInitialize();
        }
      }
    } else {
      console.log('supplier id not defined')
    }
  }, [customerData, currentSupplierId, currentCustomerId]);

  // const handleNewRefAdjustChange = (value) => {
  //   const adjustValue = parseFloat(value) || 0;
  //   setAdjustAmount(adjustValue);
  //   onAdjustChange(adjustValue);
  // };

  const handleNewRefAdjustChange = (value) => {
    const adjustValue = parseFloat(value) || 0;
    const prevAdjust = newRefData.prevAdjust;

    // Calculate the difference between the new and previous adjustment
    const adjustDifference = adjustValue - prevAdjust;

    // Update newTotalAmountEntered
    setNewTotalAmountEntered(prev => prev - adjustDifference);

    // Update newRefData with new adjust value and store the current adjust as prevAdjust
    // Update newRefData
    const updatedNewRefData = {
      adjust: adjustValue,
      prevAdjust: adjustValue,
      currentBalance: currentBalance,
      newBalance: currentBalance + adjustValue
    };
    setNewRefData(updatedNewRefData);

    // setNewRefData({ adjust: adjustValue, prevAdjust: adjustValue });
  };

  const handleInitialize = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER}/api/customer/initialize-balance`, {
        customerId: currentCustomerId,
        supplierId: currentSupplierId,
      });

      if (response.status === 200) {
        const updatedCustomer = response.data;
        setCustomerData(prevData =>
          prevData.map(customer =>
            customer._id === updatedCustomer._id ? updatedCustomer : customer
          )
        );
        setSupplierBalanceExists(true);
      }
    } catch (error) {
      console.error('Error initializing balance:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const newBalance = currentBalance + newRefData.adjust;
  // if (!supplierBalanceExists) {
  //   return (
  //     <button
  //       onClick={handleInitialize}
  //       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  //     >
  //       Initialize Balance for This Supplier
  //     </button>
  //   );
  // }
  return (
    <div className="container mx-auto py-6 px-4">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjust</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
              {currentBalance}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded"
                value={newRefData.adjust === 0 ? '' : newRefData.adjust}
                onChange={(e) => handleNewRefAdjustChange(e.target.value)}
              />
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">
              {newBalance}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
