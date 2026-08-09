import { atom, selector } from "recoil";
import apiClient from "../api/client";

const createMasterDataSelector = (key, url, dataProp) =>
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

export const attributeDataState = atom({
  key: "attributeDataState",
  default: createMasterDataSelector("attributeSelector", "/api/attribute/get-all-attribute", "attributes"),
});

export const attributeValueDataState = atom({
  key: "attributeValueDataState",
  default: createMasterDataSelector("attributeValueSelector", "/api/attributeValue/get-all-attributevalue", "attributevalues"),
});

export const categoryDataState = atom({
  key: "categoriesDataState",
  default: createMasterDataSelector("categorySelector", "/api/category/get-all-category", "categories"),
});

export const cutDataState = atom({
  key: "cutsDataState",
  default: createMasterDataSelector("cutSelector", "/api/cut/get-all-cut", "cuts"),
});

export const designDataState = atom({
  key: "designDataState",
  default: createMasterDataSelector("designSelector", "/api/design/get-all-design", "designs"),
});

export const feeltypeDataState = atom({
  key: "feeltypeDataState",
  default: createMasterDataSelector("feeltypeSelector", "/api/feeltype/get-all-feeltype", "feeltypes"),
});

export const finishtypeDataState = atom({
  key: "finishtypeDataState",
  default: createMasterDataSelector("finishtypeSelector", "/api/finishtype/get-all-finishtype", "finishtypes"),
});

export const paymentModeState = atom({
  key: "paymentModeState",
  default: createMasterDataSelector("paymentModeSelector", "/api/paymentmode/get-all-paymentmode", "paymentmodes"),
});

export const qualityDataState = atom({
  key: "qualityDataState",
  default: createMasterDataSelector("qualitySelector", "/api/quality/get-all-quality", "qualities"),
});

export const transportDataState = atom({
  key: "transportDataState",
  default: createMasterDataSelector("transportSelector", "/api/transport/get-all-transport", "transports"),
});

export const unitDataState = atom({
  key: "unitDataState",
  default: createMasterDataSelector("unitSelector", "/api/unit/get-all-unit", "units"),
});

export const weaveDataState = atom({
  key: "weaveDataState",
  default: createMasterDataSelector("weaveSelector", "/api/weave/get-all-weave", "weaves"),
});

export const widthDataState = atom({
  key: "widthDataState",
  default: createMasterDataSelector("widthSelector", "/api/width/get-all-width", "widths"),
});
