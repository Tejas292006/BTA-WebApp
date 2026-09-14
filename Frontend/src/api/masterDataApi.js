import apiClient from "./client";

const createMasterDataApi = (entity, entityPlural = entity) => ({
  create: async (payload) => {
    try {
      const response = await apiClient.post(`/api/${entity}/create-${entity}`, payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  },
  getAll: async () => {
    try {
      const response = await apiClient.get(`/api/${entity}/get-all-${entityPlural}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  },
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/${entity}/delete-${entity}/${id}`);
      return response.data;
    } catch (error) {
      return error.message;
    }
  },
  update: async (id, payload) => {
    try {
      const response = await apiClient.put(`/api/${entity}/update-${entity}/${id}`, payload);
      return response.data;
    } catch (error) {
      return error.message;
    }
  },
});

// Attribute
const attributeApi = createMasterDataApi("attribute");
export const Createattribute = attributeApi.create;
export const GetattributeData = attributeApi.getAll;
export const Deleteattribute = attributeApi.delete;
export const Updateattribute = attributeApi.update;

// Attribute Value (support both attributevalue and attributeValue)
const attributeValueApi = createMasterDataApi("attributevalue");
export const Createattributevalue = attributeValueApi.create;
export const GetattributevalueData = attributeValueApi.getAll;
export const Deleteattributevalue = attributeValueApi.delete;
export const Updateattributevalue = attributeValueApi.update;

export const CreateattributeValue = attributeValueApi.create;
export const GetattributeValueData = attributeValueApi.getAll;
export const DeleteattributeValue = attributeValueApi.delete;
export const UpdateattributeValue = attributeValueApi.update;

// Category - backend uses /api/category/create-category, /api/category/get-all-category, etc.
const categoryApi = {
  create: async (payload) => {
    try {
      const response = await apiClient.post(`/api/category/create-category`, payload);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },
  getAll: async () => {
    try {
      const response = await apiClient.get(`/api/category/get-all-category`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/category/delete-category/${id}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },
  update: async (id, payload) => {
    try {
      const response = await apiClient.put(`/api/category/update-category/${id}`, payload);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },
};
export const Createcategories = categoryApi.create;
export const GetcategoriesData = categoryApi.getAll;
export const Deletecategories = categoryApi.delete;
export const Updatecategories = categoryApi.update;
export const Createcategory = categoryApi.create;
export const GetcategoryData = categoryApi.getAll;
export const Deletecategory = categoryApi.delete;
export const Updatecategory = categoryApi.update;

// Cut
const cutApi = createMasterDataApi("cut", "cuts");
export const Createcut = cutApi.create;
export const Getcutdata = cutApi.getAll;
export const Deletecut = cutApi.delete;
export const Updatecut = cutApi.update;

// Design
const designApi = createMasterDataApi("design");
export const Createdesign = designApi.create;
export const GetdesignData = designApi.getAll;
export const Deletedesign = designApi.delete;
export const Updatedesign = designApi.update;

// FeelType
const feelTypeApi = createMasterDataApi("feeltype");
export const Createfeeltype = feelTypeApi.create;
export const GetfeeltypeData = feelTypeApi.getAll;
export const Deletefeeltype = feelTypeApi.delete;
export const Updatefeeltype = feelTypeApi.update;
export const CreatefeelType = feelTypeApi.create;
export const GetfeelTypeData = feelTypeApi.getAll;
export const DeletefeelType = feelTypeApi.delete;
export const UpdatefeelType = feelTypeApi.update;

// FinishType
const finishTypeApi = createMasterDataApi("finishtype");
export const Createfinishtype = finishTypeApi.create;
export const GetfinishtypeData = finishTypeApi.getAll;
export const Deletefinishtype = finishTypeApi.delete;
export const Updatefinishtype = finishTypeApi.update;
export const CreatefinishType = finishTypeApi.create;
export const GetfinishTypeData = finishTypeApi.getAll;
export const DeletefinishType = finishTypeApi.delete;
export const UpdatefinishType = finishTypeApi.update;

// PaymentMode
const paymentModeApi = createMasterDataApi("paymentmode");
export const Createpaymentmode = paymentModeApi.create;
export const GetpaymentmodeData = paymentModeApi.getAll;
export const Deletepaymentmode = paymentModeApi.delete;
export const Updatepaymentmode = paymentModeApi.update;
export const CreatepaymentMode = paymentModeApi.create;
export const GetpaymentModeData = paymentModeApi.getAll;
export const DeletepaymentMode = paymentModeApi.delete;
export const UpdatepaymentMode = paymentModeApi.update;

// Quality
const qualityApi = createMasterDataApi("quality");
export const Createquality = qualityApi.create;
export const GetqualityData = qualityApi.getAll;
export const Deletequality = qualityApi.delete;
export const Updatequality = qualityApi.update;

// Transport
const transportApi = createMasterDataApi("transport");
export const Createtransport = transportApi.create;
export const GettransportData = transportApi.getAll;
export const Deletetransport = transportApi.delete;
export const Updatetransport = transportApi.update;

// Unit
const unitApi = createMasterDataApi("unit");
export const Createunit = unitApi.create;
export const GetunitData = unitApi.getAll;
export const Deleteunit = unitApi.delete;
export const Updateunit = unitApi.update;
export const CreateUnit = unitApi.create;
export const GetUnitData = unitApi.getAll;
export const DeleteUnit = unitApi.delete;
export const UpdateUnit = unitApi.update;

// Weave
const weaveApi = createMasterDataApi("weave");
export const Createweave = weaveApi.create;
export const GetweaveData = weaveApi.getAll;
export const Deleteweave = weaveApi.delete;
export const Updateweave = weaveApi.update;

// Width
const widthApi = createMasterDataApi("width");
export const Createwidth = widthApi.create;
export const GetwidthData = widthApi.getAll;
export const Deletewidth = widthApi.delete;
export const Updatewidth = widthApi.update;
