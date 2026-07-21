import React, { useEffect, useState } from "react";
import DataTableModel from "../DataTableModel/DataTableModel";
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
import { globalLoaderAtom } from "../../store/GlobalLoader/globalLoaderAtom";
import {
  CreateattributeValue,
  DeleteattributeValue,
  UpdateattributeValue,
} from "../../apis/attributevalue";
import { categoryDataState } from "../../store/category/category";
import { attributeDataState } from "../../store/attribute/attributeAtom";
import { attributeValueDataState } from "../../store/attributevalue/attributevalueAtom";


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
    { name: "ID", uid: "_id", sortable: true },
    { name: "NAME", uid: "attributeref", sortable: true },
    { name: "Linked Category", uid: "ref", sortable: true },
    { name: "isNameNumercal", uid: "isNameNumerical", sortable: true },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = [
    { name: "Disabled", uid: "true" },
    { name: "Active", uid: "false" },
  ];

  const INITIAL_VISIBLE_COLUMNS = ["_id", "attributeref", "actions"];

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

    // if (newInputs.length === 0) {
    //     setShowcategoryAndValueInputs(false);
    // }
  };

  // Create The attributeValue
  const createattributeValue = async (values) => {
    try {

      //   const attributeRefData = attributeData.find((attr) => attr._id === refatt);
      // if (!attributeRefData) {
      //   throw new Error("Attribute reference data not found.");
      // }
      // console.log(attributeRefData,"refffffffffffffffffffffffffffff")
      values.attributeRef = refatt;
      // Initialize an array to store category and value data


      const categoryAndValueArray = [];
      categoryAndValueInputs.forEach((input) => {
        const { category, attributeValue, isNameNumerical } = input; // Assuming category and attribute value are separated by '-'

        // Add category and value to the array

        categoryAndValueArray.push({ category, attributeValue, isNameNumerical });
      });

      // Assign all form values including category and value data
      const formData = {
        ...values,
        valuesCombo: categoryAndValueArray,
      };

      setIsLoading(true);
      const response = await CreateattributeValue(formData);
      setIsLoading(false);

      if (response.success) {

        toast.success(response.message);
        navigate("/inventory");
        console.log(response.attributeValueDoc);

        setattributeValueData([
          ...attributeValueData,
          response.attributeValueDoc,
        ]);


        onOpenChange(false);
        setUpdateId(null); // Reset update ID when modal is closed
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // dispatch(SetLoader(false));
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  // Delete attributeValue
  const deleteItem = async (id) => {
    console.log(id);

    try {
      setIsLoading(true);
      const response = await DeleteattributeValue(id);
      setIsLoading(false);
      if (response.success) {
        toast.success(response.message);

        // Update local state based on the correct identifier (use _id instead of id)
        setattributeValueData((prevData) =>
          prevData.filter((attributeValue) => attributeValue._id !== id)
        );

        navigate("/inventory");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setIsLoading(false);

      toast.error(error.message);
    }
  };

  const handleUpdate = (attributeValueId) => {
    try {
      console.log(attributeValueData, 'valuessssssssssssssssssssssssss')
      const attributeValueDataexist = attributeValueData.find(
        (element) => element._id === attributeValueId
      );

      if (attributeValueDataexist?.attributeRef._id) {
        setrefatt(() => attributeValueDataexist?.attributeRef._id);
      } else {
        setrefatt(() => attributeValueDataexist?.attributeRef);
      }


      const valuesCombo = attributeValueDataexist?.valuesCombo; // Access the first element directly
      setcategoryAndValueInputs(() => (valuesCombo))
      let attributeRefData = null;
      if (attributeValueDataexist?.attributeRef._id) {
        attributeRefData = attributeData.find((attr) => attr._id === attributeValueDataexist?.attributeRef?._id);
      } else {
        attributeRefData = attributeData.find((attr) => attr._id === attributeValueDataexist?.attributeRef);
      }
      console.log(attributeRefData)
      console.log(attributeValueDataexist)
      console.log(valuesCombo)
      if (!attributeRefData) {
        throw new Error("Attribute reference data not found.");
      }
      // console.log(attributeRefData,"refffffffffffffffffffffffffffff")
      setrefattName("")
      if (attributeRefData?.name === "cut") {
        setrefattName(() => ("cut"));
      }
      else {
        setrefattName("")
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
      values.attributeRef = refatt;
      values.valuesCombo = categoryAndValueInputs
      setIsLoading(true);
      //   console.log(values, "fffffffffffffffffffffff");
      const response = await UpdateattributeValue(updateId, values);
      setIsLoading(false);

      if (response.success) {
        toast.success(response.message);
        console.log("Data update", response.attributeValue);

        // Optimistically update UI
        const updatedattributeValues = attributeValueData.map(
          (attributeValue) =>
            attributeValue._id === updateId
              ? response.attributeValue
              : attributeValue
        );

        setattributeValueData(() => (updatedattributeValues));
        console.log(attributeValueData, "attribute value data")
        // Close the modal and reset update ID
        onOpenChange(false);
        setrefatt(() => (''))
        setcategoryAndValueInputs([
          {
            category: "",
            attributeValue: "",
            isNameNumerical: false
          },
        ]);

        setUpdateId(null);
      } else {
        throw new Error(response.message);
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
  return (
    <>
      <div className="flex flex-col gap-2">
        <Modal
          isOpen={isOpen}
          scrollBehavior={"inside"}
          size={"xl"}
          onOpenChange={(newState) => {
            onOpenChange(newState);
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-[2rem] font-font1">
                  {updateId ? "Update attributeValue" : "Create attributeValue"}
                </ModalHeader>
                <ModalBody>
                  <div className="max-w-full rounded-2xl bg-[#1f1e30]">
                    <div className="flex flex-col gap-2 p-8">
                      <Autocomplete
                        classNames={{
                          base: "max-w-full border-[#fff] ",
                          listboxWrapper: "max-h-[320px]",
                          selectorButton: "text-[#fff]",
                        }}
                        onSelectionChange={(selectedId) => {
                          // Find the item in attributeData with the matching ID
                          const selectedItem = attributeData.find(item => (item._id === selectedId));
                          if (selectedItem) {
                            // If the item is found, set refatt to an object containing both ID and name
                            // setrefatt({ id: selectedId, name: selectedItem.name });
                            console.log(selectedItem, 'vvvvvvvvvvvvvv')
                            setrefatt(selectedItem._id)
                            setrefattName(selectedItem.name)
                          } else {
                            // Handle the case where the item is not found (optional)
                            setrefattName("")

                            console.error("Item not found in attributeData:", selectedItem);

                          }
                        }}
                        value={refatt}
                        defaultItems={attributeData}
                        selectedKey={refatt}
                        inputProps={{
                          classNames: {
                            input: "ml-1 text-[#fff] font-font1",
                            inputWrapper: "h-[50px]",
                            label: "text-[#fff]",
                          },
                        }}
                        listboxProps={{
                          hideSelectedIcon: true,
                          itemClasses: {
                            base: [
                              "rounded-medium",
                              "text-[#000]",
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
                          classNames: {
                            base: "rounded-large",
                            content: "p-1  border-none bg-background",
                          },
                        }}
                        startContent={
                          <svg
                            aria-hidden="true"
                            fill="none"
                            focusable="false"
                            height={20}
                            role="presentation"
                            viewBox="0 0 24 24"
                            attributeValue={20}
                            color={"#fff"}
                          >
                            <path
                              d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeattributeValue={2.5}
                            />
                            <path
                              d="M22 22L20 20"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeattributeValue={2.5}
                            />
                          </svg>
                        }
                        variant="bordered"
                      >
                        {(item) => (
                          <AutocompleteItem
                            key={item._id}
                            textValue={item.name}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <div className="flex flex-col">
                                  <span className="text-small">
                                    {item.name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                      {categoryAndValueInputs?.map((input, index) => (
                        <div key={index} className="flex flex-col  gap-2">
                          <div className="flex gap-2">
                            <Autocomplete
                              classNames={{
                                base: "max-w-full border-[#fff] ",
                                listboxWrapper: "max-h-[320px]",
                                selectorButton: "text-[#fff]",
                              }}
                              onSelectionChange={(selectedItem) => {
                                // Update the category for the corresponding input
                                const updatedInputs = [...categoryAndValueInputs];
                                updatedInputs[index].category = selectedItem;
                                setcategoryAndValueInputs(() => (updatedInputs))
                              }}
                              value={categoryAndValueInputs[index].category}
                              defaultItems={categoriesData}
                              selectedKey={categoryAndValueInputs[index].category}
                              inputProps={{
                                classNames: {
                                  input: "ml-1 text-[#fff] font-font1",
                                  inputWrapper: "h-[50px]",
                                  label: "text-[#fff]",
                                },
                              }}
                              listboxProps={{
                                hideSelectedIcon: true,
                                itemClasses: {
                                  base: [
                                    "rounded-medium",
                                    "text-[#000]",
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
                              aria-label="Select an Category"
                              placeholder="Category"
                              popoverProps={{
                                offset: 10,
                                classNames: {
                                  base: "rounded-large",
                                  content: "p-1  border-none bg-background",
                                },
                              }}
                              startContent={
                                <svg
                                  aria-hidden="true"
                                  fill="none"
                                  focusable="false"
                                  height={20}
                                  role="presentation"
                                  viewBox="0 0 24 24"
                                  attributeValue={20}
                                  color={"#fff"}
                                >
                                  <path
                                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeattributeValue={2.5}
                                  />
                                  <path
                                    d="M22 22L20 20"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeattributeValue={2.5}
                                  />
                                </svg>
                              }
                              variant="bordered"
                            >
                              {(item) => (
                                <AutocompleteItem
                                  key={item._id}
                                  textValue={item.name}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                      <div className="flex flex-col">
                                        <span className="text-small">
                                          {item.name}
                                        </span>
                                      </div>
                                    </div>
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
                                setcategoryAndValueInputs(() => (updatedInputs))
                                // formik.setFieldValue(
                                //   "attributeValue",
                                //   event.target.value
                                // );
                              }}
                              value={categoryAndValueInputs[index]?.attributeValue}
                              className="bg-slate-900 font-font2 font-[400] w-full rounded-lg border border-gray-300 px-4 py-3  text-[#fff]"
                              placeholder="attributeValue"
                            />
                            <Button
                              color="danger"
                              variant="light"
                              onClick={() => removecategoryAndValueInput(index)}
                            >
                              Remove
                            </Button>
                          </div>
                          {/* Button to remove category input */}
                          {refattName === "cut" && (
                            <div className="flex">
                              <label className="flex cursor-pointer items-center justify-between p-1 text-[#fff]">
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
                                    name="isNameNumercal" // Associate the input with the form field 'verified'
                                    checked={input?.isNameNumerical} // Set the checked state from formik values
                                    className="peer h-6 w-12 cursor-pointer appearance-none rounded-full border border-gray-300 bg-gary-400 checked:border-green-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                                    type="checkbox"
                                  />
                                  <span className="pointer-events-none absolute left-1 top-1 block h-4 w-4 rounded-full bg-slate-600 transition-all duration-200 peer-checked:left-7 peer-checked:bg-green-300" />
                                </div>
                              </label>

                            </div>)}
                        </div>
                      ))}
                      {/* Button to add new categoryAndValue input */}

                      <Button onClick={addcategoryAndValueInput}>
                        Add Category And Value
                      </Button>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    onClick={setUpdate}
                  >
                    Close
                  </Button>
                  <Button
                    color="primary"
                    className="bg-foreground text-background font-font1"
                    onClick={formik.handleSubmit}
                  >
                    {updateId ? "Update" : "Create "}
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
        onOpen={onOpen}
        section={"attributeValue"}
      />
    </>
  );
};

export default AttributeValue;
