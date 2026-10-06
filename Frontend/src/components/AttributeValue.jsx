import React, { useEffect, useState } from "react";
import DataTableModel from "./DataTableModel";
import {
  Modal,
  Autocomplete,
  AutocompleteItem,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { globalLoaderAtom } from '../store';
import {
  CreateattributeValue,
  DeleteattributeValue,
  UpdateattributeValue,
} from '../api';
import { categoryDataState } from '../store';
import { attributeDataState } from '../store';
import { attributeValueDataState } from '../store';
import apiClient from '../api/client';


const AttributeValue = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const [attributeValueData, setattributeValueData] = useRecoilState(
    attributeValueDataState
  );
  const [updateId, setUpdateId] = useState(null);
  const [categoriesData, setCategoriesData] = useRecoilState(categoryDataState);
  const [attributeData, setattributeData] = useRecoilState(attributeDataState);
  const [refatt, setrefatt] = useState("");
  const [refattName, setrefattName] = useState("");
  const [categoryAndValueInputs, setcategoryAndValueInputs] = useState([
    {
      category: "",
      attributeValue: "",
      isNameNumerical: false
    },
  ]);

  // Data Format
  const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "attributeref", sortable: true },
    { name: "Linked Category", uid: "ref", sortable: true },
    { name: "isNameNumercal", uid: "isNameNumerical", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = [
    { name: "Disabled", uid: "true" },
    { name: "Active", uid: "false" },
  ];

  const INITIAL_VISIBLE_COLUMNS = ["id", "attributeref", "ref", "isNameNumerical", "actions"];

  const [isLoading, setIsLoading] = useRecoilState(globalLoaderAtom);
  // Function to add new category input
  const addcategoryAndValueInput = () => {
    setcategoryAndValueInputs([
      ...categoryAndValueInputs,
      {
        category: "",
        attributeValue: "",
      },
    ]);
  };

  // Function to remove categoryAndValue input
  const removecategoryAndValueInput = (index) => {
    const newInputs = [...categoryAndValueInputs];
    newInputs.splice(index, 1);
    setcategoryAndValueInputs(newInputs);
  };

  // Create The attributeValue
  const createattributeValue = async (values) => {
    try {
      values.attributeId = refatt;
      values.attributeRef = refatt;

      const categoryAndValueArray = [];
      categoryAndValueInputs.forEach((input) => {
        const { category, attributeValue, isNameNumerical } = input;
        categoryAndValueArray.push({ category, attributeValue, isNameNumerical });
      });

      const formData = {
        ...values,
        attributeId: refatt,
        attributeRef: refatt,
        valuesCombo: categoryAndValueArray,
      };

      setIsLoading(true);
      const response = await CreateattributeValue(formData);
      setIsLoading(false);

      if (response && response.success) {
        toast.success(response.message || "Created successfully");
        const doc = response.attributeValue || response.attributeValueDoc;
        if (doc) {
          setattributeValueData((prevData) => [...(prevData || []).filter(Boolean), doc]);
        }
        onOpenChange(false);
        setUpdateId(null);
      } else {
        throw new Error(response?.message || response?.error || "Creation failed");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  // Delete attributeValue
  const deleteItem = async (id) => {
    try {
      setIsLoading(true);
      const response = await DeleteattributeValue(id);
      setIsLoading(false);
      if (response && response.success) {
        toast.success(response.message);
        setattributeValueData((prevData) =>
          (prevData || []).filter((attributeValue) => attributeValue && attributeValue.id !== id && attributeValue._id !== id)
        );
      } else {
        throw new Error(response?.message || response?.error || "Delete failed");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const handleUpdate = (attributeValueId) => {
    try {
      const attributeValueDataexist = (attributeValueData || []).find(
        (element) => element && (element.id === attributeValueId || element._id === attributeValueId)
      );

      if (!attributeValueDataexist) {
        throw new Error("Attribute value data not found.");
      }

      const foundAttrId =
        attributeValueDataexist?.attribute?.id ||
        attributeValueDataexist?.attributeRef?.id ||
        attributeValueDataexist?.attributeId ||
        attributeValueDataexist?.attributeRef ||
        "";

      setrefatt(foundAttrId);

      const valuesCombo = attributeValueDataexist?.valuesCombo || [
        { category: "", attributeValue: "", isNameNumerical: false }
      ];
      setcategoryAndValueInputs(Array.isArray(valuesCombo) ? valuesCombo : []);

      const attributeRefData = attributeData.find((attr) => attr.id === foundAttrId);
      if (attributeRefData?.name === "cut") {
        setrefattName("cut");
      } else {
        setrefattName("");
      }

      setUpdateId(attributeValueId);
      onOpen();
    } catch (error) {
      console.error("Error updating attributeValue:", error.message);
      toast.error(error.message);
    }
  };

  // Handle update form submission
  const handleUpdateSubmit = async (values) => {
    try {
      values.attributeId = refatt;
      values.attributeRef = refatt;
      values.valuesCombo = categoryAndValueInputs;
      setIsLoading(true);

      const response = await UpdateattributeValue(updateId, values);
      setIsLoading(false);

      if (response && response.success) {
        toast.success(response.message);
        const updatedDoc = response.attributeValue || response.attributeValueDoc;

        const updatedattributeValues = (attributeValueData || []).map(
          (attributeValue) =>
            attributeValue && (attributeValue.id === updateId || attributeValue._id === updateId)
              ? (updatedDoc || attributeValue)
              : attributeValue
        );

        setattributeValueData(updatedattributeValues);
        onOpenChange(false);
        setrefatt("");
        setcategoryAndValueInputs([
          {
            category: "",
            attributeValue: "",
            isNameNumerical: false
          },
        ]);
        setUpdateId(null);
      } else {
        throw new Error(response?.message || response?.error || "Update failed");
      }
    } catch (error) {
      handleUpdateError(error);
    }
  };

  const handleUpdateError = (error) => {
    setIsLoading(false);
    console.error("Error updating attributeValue:", error.message);
    toast.error(error.message);
  };

  const formik = useFormik({
    initialValues: {
      attributeRef: "",
      valuesCombo: [{ category: "", attributeValue: "", isNameNumerical: false }],

    },
    onSubmit: async (values) => {
      if (updateId) {
        setIsLoading(true);
        await handleUpdateSubmit(values);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        await createattributeValue(values);
        setIsLoading(false);
      }
    },
  });
  const handleCloseModal = () => {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    onOpenChange(false);
    setUpdateId(null);
    setrefatt('');
    setcategoryAndValueInputs([
      {
        category: "",
        attributeValue: "",
        isNameNumerical: false
      },
    ]);
    setrefattName('');
    formik.resetForm();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalCloseCapture = (e) => {
      const closeBtn = e.target.closest(
        'button[aria-label="Close"], [data-slot="close-button"], [data-modal-close="true"], .close-modal-trigger'
      );
      if (closeBtn) {
        e.stopPropagation();
        e.preventDefault();
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        handleCloseModal();
      }
    };

    document.addEventListener('pointerdown', handleGlobalCloseCapture, true);
    return () => {
      document.removeEventListener('pointerdown', handleGlobalCloseCapture, true);
    };
  }, [isOpen]);

  const setUpdate = () => {
    setUpdateId(false);
    setrefatt(() => (''))
    setcategoryAndValueInputs([
      {
        category: "",
        attributeValue: "",
        isNameNumerical: false
      },
    ]);
    setrefattName('');
  };

  const handleOpenForCreate = () => {
    setUpdateId(null);
    setrefatt('');
    setcategoryAndValueInputs([
      {
        category: "",
        attributeValue: "",
        isNameNumerical: false
      },
    ]);
    setrefattName('');
    onOpen();
  };

  const refreshData = async () => {
    try {
      const res = await apiClient.get('/api/attributeValue/get-all-attributevalue');
      if (res.data && res.data.attributeValues) {
        setattributeValueData(res.data.attributeValues);
      }
    } catch (error) {
      console.error("Error refreshing attribute values:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Modal
          isOpen={isOpen}
          scrollBehavior={"inside"}
          size={"xl"}
          className="dark:bg-[#1e1d2e]"
          onOpenChange={(newState) => {
            onOpenChange(newState);
            if (!newState) {
              handleCloseModal();
            }
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                  {updateId ? "Update attributeValue" : "Create attributeValue"}
                </ModalHeader>
                <ModalBody>
                  <div className="max-w-full rounded-2xl bg-gray-50 dark:bg-[#1f1e30] border border-gray-200 dark:border-[#2b2a3f]">
                    <div className="flex flex-col gap-3 p-6">
                      <Autocomplete
                        classNames={{
                          base: "max-w-full",
                          listboxWrapper: "max-h-[320px]",
                          selectorButton: "text-gray-600 dark:text-gray-300",
                        }}
                        onSelectionChange={(selectedId) => {
                          const selectedItem = attributeData.find(item => (item.id === selectedId));
                          if (selectedItem) {
                            setrefatt(selectedItem.id)
                            setrefattName(selectedItem.name)
                          } else {
                            setrefattName("")
                            setrefatt("")
                          }
                        }}
                        items={Array.isArray(attributeData) ? attributeData : []}
                        selectedKey={refatt ? String(refatt) : null}
                        inputProps={{
                          classNames: {
                            input: "ml-1 text-gray-900 dark:text-white font-font1 font-medium",
                            inputWrapper: "h-[50px] bg-white dark:bg-[#232233] border border-gray-200 dark:border-[#3a3950]",
                            label: "text-gray-700 dark:text-gray-300 font-font1",
                          },
                        }}
                        listboxProps={{
                          hideSelectedIcon: false,
                          itemClasses: {
                            base: [
                              "rounded-medium",
                              "text-gray-900 dark:text-white",
                              "transition-opacity",
                              "data-[hover=true]:text-foreground",
                              "dark:data-[hover=true]:bg-default-50",
                              "data-[pressed=true]:opacity-70",
                              "data-[hover=true]:bg-default-200",
                              "data-[selectable=true]:focus:bg-default-100",
                              "data-[focus-visible=true]:ring-default-500",
                            ],
                          },
                        }}
                        aria-label="Select an Attribute"
                        placeholder="Enter an Attribute"
                        popoverProps={{
                          offset: 10,
                          shouldCloseOnInteractOutside: () => true,
                          classNames: {
                            base: "rounded-large",
                            content: "p-1 border border-gray-200 dark:border-[#3a3950] bg-white dark:bg-[#1e1d2e] shadow-lg",
                          },
                        }}
                        variant="bordered"
                      >
                        {(item) => (
                          <AutocompleteItem
                            key={String(item.id)}
                            textValue={item.name}
                          >
                            <div className="flex justify-between items-center text-gray-900 dark:text-white">
                              <span className="text-small font-font1">
                                {item.name}
                              </span>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                      {categoryAndValueInputs?.map((input, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Autocomplete
                              classNames={{
                                base: "max-w-full",
                                listboxWrapper: "max-h-[320px]",
                                selectorButton: "text-gray-600 dark:text-gray-300",
                              }}
                              onSelectionChange={(selectedItem) => {
                                const updatedInputs = [...categoryAndValueInputs];
                                updatedInputs[index].category = selectedItem ? String(selectedItem) : "";
                                setcategoryAndValueInputs(updatedInputs);
                              }}
                              items={Array.isArray(categoriesData) ? categoriesData : []}
                              selectedKey={input?.category ? String(input.category) : null}
                              inputProps={{
                                classNames: {
                                  input: "ml-1 text-gray-900 dark:text-white font-font1 font-medium",
                                  inputWrapper: "h-[50px] bg-white dark:bg-[#232233] border border-gray-200 dark:border-[#3a3950]",
                                  label: "text-gray-700 dark:text-gray-300 font-font1",
                                },
                              }}
                              listboxProps={{
                                hideSelectedIcon: false,
                                itemClasses: {
                                  base: [
                                    "rounded-medium",
                                    "text-gray-900 dark:text-white",
                                    "transition-opacity",
                                    "data-[hover=true]:text-foreground",
                                    "dark:data-[hover=true]:bg-default-50",
                                    "data-[pressed=true]:opacity-70",
                                    "data-[hover=true]:bg-default-200",
                                    "data-[selectable=true]:focus:bg-default-100",
                                    "data-[focus-visible=true]:ring-default-500",
                                  ],
                                },
                              }}
                              aria-label="Select a Category"
                              placeholder="Category"
                              popoverProps={{
                                offset: 10,
                                shouldCloseOnInteractOutside: () => true,
                                classNames: {
                                  base: "rounded-large",
                                  content: "p-1 border border-gray-200 dark:border-[#3a3950] bg-white dark:bg-[#1e1d2e] shadow-lg",
                                },
                              }}
                              variant="bordered"
                            >
                              {(item) => (
                                <AutocompleteItem
                                  key={String(item.id)}
                                  textValue={item.name}
                                >
                                  <div className="flex justify-between items-center text-gray-900 dark:text-white">
                                    <span className="text-small font-font1">
                                      {item.name}
                                    </span>
                                  </div>
                                </AutocompleteItem>
                              )}
                            </Autocomplete>
                            <input
                              autoFocus
                              onChange={(event) => {
                                const updatedInputs = [...categoryAndValueInputs];
                                updatedInputs[index] = {
                                  ...updatedInputs[index],
                                  attributeValue: event.target.value
                                };
                                setcategoryAndValueInputs(updatedInputs);
                              }}
                              value={categoryAndValueInputs[index]?.attributeValue}
                              className="bg-white dark:bg-[#232233] font-font2 font-[400] w-full rounded-xl border border-gray-200 dark:border-[#3a3950] px-4 py-3 text-gray-900 dark:text-[#f7f7f5] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d8f275] focus:border-transparent transition"
                              placeholder="Attribute value e.g. 60, Red, XL"
                            />
                            <Button
                              color="danger"
                              variant="light"
                              onClick={() => removecategoryAndValueInput(index)}
                            >
                              Remove
                            </Button>
                          </div>
                          {refattName === "cut" && (
                            <div className="flex">
                              <label className="flex cursor-pointer items-center justify-between p-1 text-gray-700 dark:text-gray-300 font-font1 font-semibold">
                                isNameNumerical
                                <div className="relative inline-block">
                                  <input
                                    onChange={(e) => {
                                      const updatedInputs = [...categoryAndValueInputs];
                                      updatedInputs[index] = {
                                        ...updatedInputs[index],
                                        isNameNumerical: e.target.checked
                                      };
                                      setcategoryAndValueInputs(updatedInputs);
                                    }}
                                    name="isNameNumercal"
                                    checked={input?.isNameNumerical}
                                    className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gray-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                    type="checkbox"
                                  />
                                  <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300" />
                                </div>
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                      <Button onClick={addcategoryAndValueInput}>
                        Add Category And Value
                      </Button>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="border-t border-gray-100 dark:border-[#2b2a3f]">
                  <Button
                    color="danger"
                    variant="light"
                    data-modal-close="true"
                    className="close-modal-trigger font-font1"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      handleCloseModal();
                    }}
                    onPress={handleCloseModal}
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-[#d8f275] text-[#1f1e30] font-font1 font-semibold hover:bg-[#c5e05c] transition"
                    onPress={formik.handleSubmit}
                  >
                    {updateId ? "Update" : "Save"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <DataTableModel
        visible_columns={INITIAL_VISIBLE_COLUMNS}
        deleteItem={deleteItem}
        update={handleUpdate}
        columns={columns}
        statusOptions={statusOptions}
        users={attributeValueData}
        onOpen={handleOpenForCreate}
        section={"attributeValue"}
        onRefresh={refreshData}
      />
    </>
  );
};

export default AttributeValue;
