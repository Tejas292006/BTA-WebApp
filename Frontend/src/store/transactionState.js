import { atom, selector } from "recoil";
import apiClient from "../api/client";

const createSelector = (key, url, dataProp) =>
  selector({
    key,
    get: async () => {
      try {
        const res = await apiClient.get(url);
        return dataProp ? res.data[dataProp] : res.data;
      } catch {
        return [];
      }
    },
  });

export const productsDataState = atom({
  key: "productsData",
  default: createSelector("productAtomSelector", "/api/products/get-all-products", "products"),
});

export const getProductById = selector({
  key: "getProductById",
  get: ({ get }) => {
    const products = get(productsDataState);
    return (id) => products?.filter((product) => product?.supplierName?.id === id);
  },
});

export const customerDataState = atom({
  key: "customersDataState",
  default: createSelector("customerSelector", "/api/customer/get-all-customers", "customers"),
});

export const suppliersDataState = atom({
  key: "suppliersDataState",
  default: createSelector("supplierSelector", "/api/supplier/get-all-supplier", "suppliers"),
});

export const customerpaymentDataState = atom({
  key: "customerpaymentDataState",
  default: createSelector("customerpaymentSelector", "/api/customerpayment/get-all-customerpayments", "customerpayments"),
});

export const supplierpaymentDataState = atom({
  key: "supplierpaymentDataState",
  default: createSelector("supplierpaymentSelector", "/api/supplierpayment/get-all-supplierpayments", "supplierpayments"),
});

export const customerledgerDataState = atom({
  key: "customerledgerDataState",
  default: createSelector("customerledgerSelector", "/api/customerledger/get-customer-ledger", "customerledgers"),
});

export const supplierledgerDataState = atom({
  key: "supplierledgerDataState",
  default: createSelector("supplierledgerSelector", "/api/supplierledger/get-supplier-ledger", "supplierledgers"),
});

export const challanDataState = atom({
  key: "challanDataState",
  default: createSelector("challanSelector", "/api/challan/get-all-challan", "challans"),
});

export const quickchallanDataState = atom({
  key: "quickchallanDataState",
  default: createSelector("quickchallanSelector", "/api/quickchallan/get-all-quickchallan", "quickchallans"),
});

export const invoiceDataState = atom({
  key: "invoiceDataState",
  default: createSelector("invoiceSelector", "/api/invoice/get-all-invoice", "invoices"),
});
