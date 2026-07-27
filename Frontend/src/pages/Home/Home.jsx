import React from 'react'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../../store/user/userAtom'
import { productsDataState } from '../../store/product/productAtom'
import { suppliersDataState } from '../../store/supplier/supplierAtom'
import { customerDataState } from '../../store/customer/customerAtom'
import { challanDataState } from '../../store/challan/challan'
import { invoiceDataState } from '../../store/invoice/invoiceAtom'
import { quickchallanDataState } from '../../store/quickchallan/quickChallanAtom'
import { categoryDataState } from '../../store/category/category'
import { Link } from 'react-router-dom'

const Home = () => {
  const user = useRecoilValue(userAtom)
  const productsData = useRecoilValue(productsDataState)
  const suppliersData = useRecoilValue(suppliersDataState)
  const customerData = useRecoilValue(customerDataState)
  const challansData = useRecoilValue(challanDataState)
  const invoiceData = useRecoilValue(invoiceDataState)
  const quickChallansData = useRecoilValue(quickchallanDataState)
  const categoryData = useRecoilValue(categoryDataState)

  const cards = [
    { title: 'Products', count: productsData?.length || 0, href: '/inventory', color: 'bg-blue-500' },
    { title: 'Suppliers', count: suppliersData?.length || 0, href: '/inventory', color: 'bg-purple-500' },
    { title: 'Customers', count: customerData?.length || 0, href: '/customers', color: 'bg-green-500' },
    { title: 'Categories', count: categoryData?.length || 0, href: '/inventory', color: 'bg-orange-500' },
    { title: 'Challans', count: challansData?.length || 0, href: '/challan', color: 'bg-red-500' },
    { title: 'Quick Challans', count: quickChallansData?.length || 0, href: '/quick-challan', color: 'bg-yellow-500' },
    { title: 'Invoices', count: invoiceData?.length || 0, href: '/invoice', color: 'bg-indigo-500' },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-font2 text-gray-800">
          Welcome back, {user?.username} &#128075;
        </h1>
        <p className="text-gray-500 mt-2 font-font1">Here is an overview of your textile business</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-font1 uppercase tracking-wide">{card.title}</p>
                <p className="text-3xl font-bold mt-2 font-font2 text-gray-800">{card.count}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white text-xl font-bold opacity-80 group-hover:opacity-100 transition-opacity`}>
                {card.count}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <span className="text-sm text-blue-500 font-font1 group-hover:text-blue-700 transition-colors">
                View {card.title.toLowerCase()} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold font-font2 text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/challan" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
              <span className="text-2xl">&#128196;</span>
              <span className="font-font1 text-sm font-medium">New Challan</span>
            </Link>
            <Link to="/quick-challan" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
              <span className="text-2xl">&#9889;</span>
              <span className="font-font1 text-sm font-medium">Quick Challan</span>
            </Link>
            <Link to="/invoice" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
              <span className="text-2xl">&#128179;</span>
              <span className="font-font1 text-sm font-medium">Generate Invoice</span>
            </Link>
            <Link to="/payments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
              <span className="text-2xl">&#128176;</span>
              <span className="font-font1 text-sm font-medium">Record Payment</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold font-font2 text-gray-800 mb-4">Business Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600 font-font1">Total Challans</span>
              <span className="font-bold font-font2">{(challansData?.length || 0) + (quickChallansData?.length || 0)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600 font-font1">Total Invoices</span>
              <span className="font-bold font-font2">{invoiceData?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600 font-font1">Active Suppliers</span>
              <span className="font-bold font-font2">{suppliersData?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600 font-font1">Active Customers</span>
              <span className="font-bold font-font2">{customerData?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
