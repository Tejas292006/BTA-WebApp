import axios from "axios";
import { atom, selector } from "recoil";

export const productsDataState = atom({
  key: "productsData",
  default: selector({
    key: "productAtomSelector",
    get: async () => {
      const res = await axios.get(`${import.meta.env.VITE_SERVER || 'http://localhost:5000'}/api/products/get-all-products`);
      return res.data.products;
    }
  })
})


export const getProductById = selector({
  key: "getProductById",
  get: ({ get }) => {
    const products = get(productsDataState);
    return (id) => {
      // Efficiently filter products using find or findIndex
      const foundProduct = products.filter(product => product?.supplierName?._id === id);
      return foundProduct;
    };
  }
});

