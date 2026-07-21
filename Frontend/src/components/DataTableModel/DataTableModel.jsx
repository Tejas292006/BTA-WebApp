import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    useDisclosure,
} from "@nextui-org/react";
import { UilAngleDown, UilPlus, UilEllipsisV } from '@iconscout/react-unicons'
import { useNavigate } from "react-router-dom";
import { capitalize } from "../../utils/capitalize";
import { suppliersDataState } from "../../store/supplier/supplierAtom";
import { useRecoilState } from "recoil";
import { customerDataState } from "../../store/customer/customerAtom";

import ViewAreaToggle from "../View Area/ViewAreaToggle";
import { attributeDataState } from "../../store/attribute/attributeAtom";





const statusColorMap = {
    true: "success",
    false: "danger",
};


export default function DataTableModel({ columns, update, deleteItem, users, statusOptions, visible_columns, section, onOpen, filltername }) {

    // console.log(users, "TableData");
    const [filterValue, setFilterValue] = React.useState("");
    const { isOpen, onOpenChange, onClose } = useDisclosure();
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(visible_columns));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const navigate = useNavigate()
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const [suppliersData, setSuppliersData] = useRecoilState(suppliersDataState)
    const [customerData, setcustomerData] = useRecoilState(customerDataState)
    const [attributeData, setattributeData] = useRecoilState(attributeDataState)

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) => {
                if (filltername) {
                    console.log(user[filltername], "search");
                    // Accessing property dynamically using square brackets
                    return user[filltername]?.toLowerCase().includes(filterValue.toLowerCase());
                } else {
                    return user?.name?.toLowerCase().includes(filterValue.toLowerCase())
                }
            });
        }
        if (statusFilter !== "all" && Array.from(statusFilter)?.length !== statusOptions?.length) {
            filteredUsers = filteredUsers.filter((user) =>
                user.verified == Boolean(statusFilter.currentKey),
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);


    const handleEditForSection = async (id) => {
        navigate(`/${section}/${id}`);
    }
    const [sectionClickedID, setSectionClickedID] = React.useState(null);
    const [viewAreaToggle, setViewAreaToggle] = React.useState(null);
    const openViewAreaToggle = (id) => {
        setViewAreaToggle(true);
        setSectionClickedID(id);
        onOpenChange(true);
    }

    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: user?.avatar }}
                        name={cellValue}
                    >
                        {user?.name}
                    </User>
                );

            case "attributeref":
                return (
                    <div className="flex flex-col">
                        {/* <p className="text-bold text-tiny capitalize text-default-900">{attributeData.find(supplier => supplier?._id === user?.attributeRef)?.name}</p> */}
                        <p className="text-bold text-tiny capitalize text-default-900">
                            {user?.attributeRef._id ? user.attributeRef?.name : attributeData.find(supplier => supplier?._id === user?.attributeRef)?.name}
                        </p>
                    </div>
                );


                case "customer":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-tiny capitalize text-default-900">{user?.customer?.name}</p>
                        </div>
                    );
                case "supplier":
                    return (
                        <div className="flex flex-col">
                            <p className="text-bold text-tiny capitalize text-default-900">{user?.supplier?.name}</p>
                        </div>
                    );
                    case "customerName":
                        return (
                            <div className="flex flex-col">
                                <p className="text-bold text-tiny capitalize text-default-900">{user?.challanRef?.[0]?.customer?.name}</p>
                            </div>
                        );
                    case "supplierName":
                        return (
                            <div className="flex flex-col">
                                <p className="text-bold text-tiny capitalize text-default-900">{user?.challanRef?.[0]?.supplier?.name}</p>
                            </div>
                        );
            case "products":
                return (
                    <div className="flex max-w-max ml-2 items-center ">
                        <p className="text-bold text-tiny capitalize text-default-800">{user?.products?.length} Order</p>
                    </div>
                );
            case "ref":
                return (
                    <div className="flex max-w-max ml-2 items-center ">
                        <p className="text-bold text-tiny capitalize text-default-800">{user?.ref?.name}</p>
                    </div>
                );
            case "brand":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{user?.brand}</p>
                    </div>
                );
            case "challanRef":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{user?.challanRef?.customer?.name}</p>
                    </div>
                );
            case "products.due":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{user?.products?.reduce((acc, currVal) =>  acc + currVal.due , 0)}</p>
                    </div>
                );
            case "products.received":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{user?.products?.reduce((acc, currVal) =>  acc + currVal.received , 0)}</p>
                    </div>
                );
            case "verified":
                return (
                    <Chip className="capitalize" color={statusColorMap[user?.verified]} size="sm" variant="flat">
                        {cellValue ? "Active" : "Disabled"}
                    </Chip>
                );
            case "isNameNumerical":
                return (
                    <Chip className="capitalize" color={statusColorMap[user?.isNameNumerical]} size="sm" variant="flat">
                        {cellValue ? "Active" : "Disabled"}
                    </Chip>
                );
            case "experienced":
                return (
                    <Chip className="capitalize" color={statusColorMap[user?.experienced]} size="sm" variant="flat">
                        {cellValue ? "True" : "False"}
                    </Chip>
                );
            case "address":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-400">{user?.address}</p>
                    </div>
                );
            case "actions":
                return (
                    <div className="relative flex  items-center gap-2 ">
                        <Dropdown className="bg-background border-1 border-default-200">
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <UilEllipsisV className="text-[#000]" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu className='font-2 font-medium text-[#000]'>
                                <DropdownItem onClick={() => openViewAreaToggle(user._id)}>View</DropdownItem>
                                {section === "invoice" &&<DropdownItem onClick={() => navigate(`/invoice-preview/${user._id}`)}>Preview</DropdownItem>}
                                <DropdownItem onClick={() => update(user._id)}>Edit</DropdownItem>
                                <DropdownItem onClick={() => deleteItem(user._id) || alert(user._id)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return <div className="flex max-w-max ml-2 items-center ">
                    <p className="text-bold text-tiny capitalize text-default-800">{cellValue}</p>
                </div>
        }
    }

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{
                            base: "w-full sm:max-w-[44%]",
                            inputWrapper: "border-1 font-font1",
                        }}
                        size="sm"
                        placeholder="Search by name..."
                        // startContent={<SearchIcon />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<UilAngleDown className="h-5 w-5" />}
                                    variant="flat"
                                    className="font-font1"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<UilAngleDown className="h-5 w-5" />}
                                    variant="flat"
                                    className="font-font1"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary"
                            className="bg-foreground text-background font-font1"
                            endContent={<UilPlus className="h-5 w-5" />}
                            onClick={onOpen}
                        >
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        users.length,
        onSearchChange,
        hasSearchFilter,
    ]);


    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        base: "bg-[#f7f7f5] max-h-[5rem] dark:bg-[#000] dark:text-white",
                        cursor: "bg-foreground text-background",
                    }}
                    color="default"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    console.log(headerColumns, "User")

    return (
        <>
            <ViewAreaToggle section={section} isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} id={sectionClickedID} />
            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                    th: ["font-font1 font-[400]"],
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No users found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item._id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>

    );
}
