"use client";
import {
  Button,
  Divider,
  FormControl,
  Chip,
  Select,
  InputLabel,
  MenuItem,
  Table,
  Checkbox,
  OutlinedInput,
  ListItemText,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Box,
  TableSortLabel,
} from "@mui/material";
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import visuallyHidden from "@mui/utils/visuallyHidden";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ["Government", "University", "Private Company", "Individual"];

const statusFilterW = {
  all: "1rem",
  pending: "1rem",
  paid: "1rem",
  overdue: "1rem",
  draft: "1rem",
};

const statusULVariant = {
  all: {
    width: "0.75rem",
  },
  paid: {
    width: "6rem",
  },
  pending: {
    width: "12rem",
  },
  overdue: {
    width: "20rem",
  },
  draft: {
    width: "28rem",
  },
};
const statusUSVariant = {
  all: {
    width: "3rem",
  },
  paid: {
    width: "4rem",
  },
  pending: {
    width: "6rem",
  },
  overdue: {
    width: "6rem",
  },
  draft: {
    width: "4.5rem",
  },
};

/**
 *
 * Table Defaults
 */
function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}
const rows = [
  createData(1, "Cupcake", 305, 3.7, 67, 4.3),
  createData(2, "Donut", 452, 25.0, 51, 4.9),
  createData(3, "Eclair", 262, 16.0, 24, 6.0),
  createData(4, "Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9),
  createData(6, "Honeycomb", 408, 3.2, 87, 6.5),
  createData(7, "Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData(8, "Jelly Bean", 375, 0.0, 94, 0.0),
  createData(9, "KitKat", 518, 26.0, 65, 7.0),
  createData(10, "Lollipop", 392, 0.2, 98, 0.0),
  createData(11, "Marshmallow", 318, 0, 81, 2.0),
  createData(12, "Nougat", 360, 19.0, 9, 37.0),
  createData(13, "Oreo", 437, 18.0, 63, 4.0),
];
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "customers",
    numeric: false,
    disablePadding: true,
    label: "Customers",
  },
  {
    id: "created",
    numeric: false,
    disablePadding: false,
    label: "Created",
  },
  {
    id: "due",
    numeric: false,
    disablePadding: false,
    label: "Due",
  },
  {
    id: "amount",
    numeric: true,
    disablePadding: false,
    label: "Amount",
  },
  {
    id: "sent",
    numeric: true,
    disablePadding: false,
    label: "Sent",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function InvoiceList() {
  /**
   * Filter States
   */
  const [statusFilter, setStatusFilter] = useState(null);
  const [filterSector, setFilterSector] = useState([]);
  const [filterDstart, setFilterDstart] = useState("");
  const [filterDend, setFilterDend] = useState("");
  /**
   * Table States
   */
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  /**
   *
   * Filter Functions
   */
  const handleFilterSector = (event) => {
    const {
      target: { value },
    } = event;
    setFilterSector(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleStatusFilter = (item) => {
    setStatusFilter(item);
  };
  const handleDeleteFilterSector = (x) => {
    let oArr = [...filterSector];
    let nArr = oArr.splice(oArr.indexOf(x), 1);
    setFilterSector(oArr);
  };
  const handleClearFilterClick = () => {
    setStatusFilter();
    setFilterSector([]);
    setFilterDstart("");
    setFilterDend("");
  };
  /**
   * Table Functions
   */
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <div className="flex justify-between">
          <div className="">
            <div className="text-2xl font-semibold">Lists</div>

            <div className="text-sm mt-4">Dashboard . Invoice . List</div>
          </div>
          <div className="flex items-center">
            <Button variant="outlined">+ New Invoice</Button>
          </div>
        </div>
        <div className="w-full border p-4 pr-8 pl-8 rounded-xl flex justify-between mt-8">
          <div className="flex items-center gap-1">
            <div className="w-16 h-16 bg-black"></div>
            <div className="">
              <div className="text-md font-medium ">Total</div>
              <div className="text-sm font-medium text-slate-400 pt-1 pb-1">
                162 Invoices
              </div>
              <div className="text-sm font-medium ">IDR 4.322,23 M</div>
            </div>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="flex items-center gap-1">
            <div className="w-16 h-16 bg-black"></div>
            <div className="">
              <div className="text-md font-medium ">Total</div>
              <div className="text-sm font-medium text-slate-400 pt-1 pb-1">
                162 Invoices
              </div>
              <div className="text-sm font-medium ">IDR 4.322,23 M</div>
            </div>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="flex items-center gap-1">
            <div className="w-16 h-16 bg-black"></div>
            <div className="">
              <div className="text-md font-medium ">Total</div>
              <div className="text-sm font-medium text-slate-400 pt-1 pb-1">
                162 Invoices
              </div>
              <div className="text-sm font-medium ">IDR 4.322,23 M</div>
            </div>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="flex items-center gap-1">
            <div className="w-16 h-16 bg-black"></div>
            <div className="">
              <div className="text-md font-medium ">Total</div>
              <div className="text-sm font-medium text-slate-400 pt-1 pb-1">
                162 Invoices
              </div>
              <div className="text-sm font-medium ">IDR 4.322,23 M</div>
            </div>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="flex items-center gap-1">
            <div className="w-16 h-16 bg-black"></div>
            <div className="">
              <div className="text-md font-medium ">Total</div>
              <div className="text-sm font-medium text-slate-400 pt-1 pb-1">
                162 Invoices
              </div>
              <div className="text-sm font-medium ">IDR 4.322,23 M</div>
            </div>
          </div>
        </div>
        <div className="border rounded-xl mt-10">
          <div className="p-3 flex gap-8">
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => handleStatusFilter(null)}>
              <div className="text-md font-semibold text-slate-500">
                <p className={statusFilter == null ? "text-slate-800" : null}>
                  All
                </p>
              </div>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-md ${
                  statusFilter == null
                    ? "text-white bg-black"
                    : "bg-black text-white"
                }`}>
                <p className="text-xs font-semibold">20</p>
              </div>
            </div>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => handleStatusFilter("paid")}>
              <div className="text-md font-semibold text-slate-500">
                <p className={statusFilter == "paid" ? "text-slate-800" : null}>
                  Paid
                </p>
              </div>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-md ${
                  statusFilter == "paid"
                    ? "text-white bg-green-600"
                    : "bg-green-100 text-green-600"
                }`}>
                <p className="text-xs font-semibold">20</p>
              </div>
            </div>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => handleStatusFilter("pending")}>
              <div className="text-md font-semibold text-slate-500">
                <p
                  className={
                    statusFilter == "pending" ? "text-slate-800" : null
                  }>
                  Pending
                </p>
              </div>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-md ${
                  statusFilter == "pending"
                    ? "text-white bg-yellow-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                <p className="text-xs font-semibold">20</p>
              </div>
            </div>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => handleStatusFilter("overdue")}>
              <div className="text-md font-semibold text-slate-500">
                <p
                  className={
                    statusFilter == "overdue" ? "text-slate-800" : null
                  }>
                  Overdue
                </p>
              </div>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-md ${
                  statusFilter == "overdue"
                    ? "text-white bg-red-600"
                    : "bg-red-100 text-red-600"
                }`}>
                <p className="text-xs font-semibold">20</p>
              </div>
            </div>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => handleStatusFilter("draft")}>
              <div className="text-md font-semibold text-slate-500">
                <p
                  className={statusFilter == "draft" ? "text-slate-800" : null}>
                  Draft
                </p>
              </div>
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-md ${
                  statusFilter == "draft"
                    ? "text-white bg-slate-600"
                    : "bg-slate-100 text-slate-600"
                }`}>
                <p className="text-xs font-semibold">20</p>
              </div>
            </div>
          </div>
          <div className="flex">
            <motion.div
              className=""
              variants={statusULVariant}
              animate={statusFilter ?? "all"}></motion.div>
            <motion.div
              className="h-1 bg-black -mb-1"
              variants={statusUSVariant}
              animate={statusFilter ?? "all"}></motion.div>
          </div>
          <Divider />
          <div className="p-3 pt-4">
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="filter-sector-label">Sector</InputLabel>
              <Select
                labelId="filter-sector-label"
                id="filter-sector-select"
                multiple
                value={filterSector}
                onChange={handleFilterSector}
                input={<OutlinedInput label="Sector" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}>
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={filterSector.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 200 }}>
              <DatePicker
                label="Date Start"
                value={filterDstart}
                maxDate={filterDend ? dayjs(filterDend) : null}
                onChange={(x) => setFilterDstart(x)}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: 200 }}>
              <DatePicker
                label="Date End"
                value={filterDend}
                minDate={filterDstart ? dayjs(filterDstart) : null}
                onChange={(x) => {
                  setFilterDend(x);
                }}
              />
            </FormControl>
          </div>
          {filterSector.length > 0 ||
          statusFilter ||
          (filterDstart && filterDend) ? (
            <div className="p-5 pt-3 pb-2">
              <p className="text text-sm">
                <span className="font-semibold">10</span> results found
              </p>
              <div className="flex items-center gap-3">
                {filterSector.length > 0 ? (
                  <div className="p-2 pt-1 pb-1 flex gap-2 items-center border rounded-lg">
                    <p className="text-xs font-semibold">Sector:</p>
                    {filterSector.map((x, idx) => (
                      <Chip
                        label={x}
                        key={"fsk-" + idx}
                        variant="outlined"
                        onDelete={() => {
                          handleDeleteFilterSector(x);
                        }}
                      />
                    ))}
                  </div>
                ) : null}
                {statusFilter ? (
                  <div className="p-2 pt-1 pb-1 flex gap-2 items-center border rounded-lg">
                    <p className="text-xs font-semibold">Status:</p>
                    <Chip
                      label={statusFilter}
                      variant="outlined"
                      onDelete={() => setStatusFilter(null)}
                    />
                  </div>
                ) : null}
                {filterDstart && filterDend ? (
                  <div className="p-2 pt-1 pb-1 flex gap-2 items-center border rounded-lg">
                    <p className="text-xs font-semibold">Date:</p>
                    <Chip
                      label={
                        dayjs(filterDstart).format("DD MMM YY").toString() +
                        " - " +
                        dayjs(filterDend).format("DD MMM YY").toString()
                      }
                      variant="outlined"
                      onDelete={() => {
                        setFilterDend(null);
                        setFilterDstart(null);
                      }}
                    />
                  </div>
                ) : null}
                <Button onClick={handleClearFilterClick}>Clear</Button>
              </div>
            </div>
          ) : null}
          <div className="data">
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"small"}>
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none">
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}
