import React from 'react'
import { Input, Autocomplete, AutocompleteItem, Avatar, Button } from "@nextui-org/react";
import { UilPlus } from '@iconscout/react-unicons'

const AutoComplete = (props) => {
    // const updatedUsers = [...users];  // Create a copy of the array
    // updatedUsers.unshift({ "name": "N/A", "_id": null });
    const { users, placeholder, selectionChange, values, selectedKey, labelPlacement, label } = props;
    // console.log(props)
    console.log(selectedKey);
    return (
        <div className='flex items-center'>
            <Autocomplete
                labelPlacement={labelPlacement}
                label={label}
                selectedKey={selectedKey || values}
                onSelectionChange={selectionChange}
                classNames={{
                    base: " border border- bg-transparent",
                    listboxWrapper: "max-h-[320px]",
                    selectorButton: "text-default-500",
                }}
                defaultItems={users}
                inputProps={{
                    style: { textTransform: 'uppercase' },
                    classNames: {
                        input: "ml-1 text-[#000] font-font1 uppercase",
                        inputWrapper: "h-[20px]",
                        label: "font-[600] font-font1 uppercase",
                    },
                }}
                listboxProps={{
                    hideSelectedIcon: true,
                    itemClasses: {
                        base: [],
                    },
                }}
                aria-label="Select an option"
                placeholder={placeholder ? placeholder.toUpperCase() : ""}
                popoverProps={{
                    offset: 10,
                    shouldCloseOnInteractOutside: () => true,
                    classNames: {
                        base: "",
                        content: "p-1 border-default-100 uppercase",
                    },
                }}
                variant="flat"
            >
                {(item) => (
                    <AutocompleteItem key={item.id} textValue={item?.name ? item.name.toUpperCase() : ""}>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <div className="flex flex-col">
                                    <span className="text-small uppercase">{item?.name}</span>
                                </div>
                            </div>
                        </div>
                    </AutocompleteItem>
                )}
            </Autocomplete>
        </div>
    )
}

export default AutoComplete
