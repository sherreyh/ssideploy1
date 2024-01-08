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
  TextField,
  TableRow,
  Box,
  LinearProgress,
  Typography,
  TableSortLabel,
  InputAdornment,
  Skeleton,
  Alert,
  IconButton,
  Dialog,
  Popover,
  ListItemButton,
  List,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import api from "../../../services/api";
import visuallyHidden from "@mui/utils/visuallyHidden";
import axios from "axios";
import { useRouter } from "next/navigation";
import { crypt } from "../../../services/encrypturl";
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

/**
 *
 * Table Defaults
 */
const headCells = [
  {
    id: "product",
    numeric: false,
    disablePadding: true,
    label: "Product",
  },
  {
    id: "brand",
    numeric: false,
    disablePadding: false,
    label: "Brand",
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "stock",
    numeric: false,
    disablePadding: false,
    label: "Stock",
  },
  {
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "Price",
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

const FiltersWithData = ({
  filterBrand,
  filterCategory,
  handleFilterBrand,
  handleFilterCategory,
  brandMenu,
  categoryMenu,
}) => {
  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="filter-sector-label">Brand</InputLabel>
        <Select
          labelId="filter-brand-label"
          id="filter-brand-select"
          multiple
          value={filterBrand}
          onChange={handleFilterBrand}
          input={<OutlinedInput label="Brand" />}
          renderValue={(selected) =>
            selected
              .map((x) => {
                const srchIdx = brandMenu.findIndex((y) => y.id == x);
                return brandMenu[srchIdx].name;
              })
              .join(", ")
          }
          MenuProps={MenuProps}>
          {brandMenu.map((x) => (
            <MenuItem key={`filter${x.name}`} value={x.id}>
              <Checkbox checked={filterBrand.indexOf(x.name) > -1} />
              <ListItemText primary={x.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="filter-sector-label">Category</InputLabel>
        <Select
          labelId="filter-category-label"
          id="filter-category-select"
          multiple
          value={filterCategory}
          onChange={handleFilterCategory}
          input={<OutlinedInput label="Category" />}
          renderValue={(selected) =>
            selected
              .map((x) => {
                const srchIdx = categoryMenu.findIndex((y) => y.id == x);
                return categoryMenu[srchIdx].name;
              })
              .join(", ")
          }
          MenuProps={MenuProps}>
          {categoryMenu.map((x) => (
            <MenuItem key={`filter${x.name}`} value={x.id}>
              <Checkbox checked={filterCategory.indexOf(x.name) > -1} />
              <ListItemText primary={x.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

const StockBar = ({ value }) => {
  var desc =
    value == 0 ? "out of stock" : value > 10 ? "in stock" : "low stock";
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" value={value} />
      </Box>
      <Box>
        <Typography>{desc}</Typography>
      </Box>
    </Box>
  );
};

export default function ProductListPage() {
  /**
   * Filter States
   */

  const [brandMenu, setBrandMenu] = useState([]);
  const [filterBrand, setFilterBrand] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [categoryMenu, setCategoryMenu] = useState([]);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterCategory, setFilterCategory] = useState([]);

  /**
   * Table States
   */
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [popoverId, setPopoverId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [textDelDialog, setTextDelDialog] = useState(["single", null]);
  const [closeDelDialog, setCloseDelDialog] = useState(true);
  const [closeAlerts, setCloseAlerts] = useState(true);
  const [textAlerts, setTextAlerts] = useState("");
  const [severityAlerts, setSeverityAlerts] = useState("success");

  const [delId, setDelId] = useState(null);

  /**
   * Page Memo
   */
  const isSelected = (id) => selected.indexOf(id) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage) : 0;

  const router = useRouter();
  /**
   * Page Effects
   */

  useEffect(() => {
    getData(setBrandMenu, setCategoryMenu);
  }, []);

  /**
   * Data Fetching
   */
  const getData = async (setBrandMenu, setCategoryMenu) => {
    const initData = await axios
      .get("http://localhost:8000/api/v1/mproducts")
      .then((data) => {
        return data.data;
      });
    if (initData) {
      setBrandMenu(initData.brand);
      setCategoryMenu(initData.category);
    }
  };

  const { data: data, mutate } = useSWR(
    `/products?page=${page}${
      orderBy ? "&orderBy=" + orderBy + "&order=" + order : ""
    }${filterSearch ? "&search=" + filterSearch : ""}${
      filterCategory.length > 0
        ? "&filterCategory=" + filterCategory.join(",")
        : ""
    }${filterBrand.length > 0 ? "&filterBrand=" + filterBrand.join(",") : ""}${
      filterStatus ? "&filterStatus=" + filterStatus : ""
    }`,
    api.get
  );
  var pageData = data?.data;
  console.log(pageData);
  /**
   *
   * Filter Functions
   */
  const handleFilterBrand = (event) => {
    const {
      target: { value },
    } = event;
    setFilterBrand(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleFilterCategory = (event) => {
    const {
      target: { value },
    } = event;
    setFilterCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
  };
  const handleFilterSearch = (e) => {
    setFilterSearch(e.target.value);
  };
  const handleDeleteFilterBrand = (x) => {
    let oArr = [...filterBrand];
    let frsh = [];
    oArr.forEach((y, idx) => {
      if (idx != x) frsh.push(y);
    });
    setFilterBrand(frsh);
  };
  const handleDeleteFilterCategory = (x) => {
    let oArr = [...filterCategory];
    let frsh = [];
    oArr.forEach((y, idx) => {
      if (idx != x) frsh.push(y);
    });
    setFilterCategory(frsh);
  };
  const handleClearFilterClick = () => {
    setFilterStatus();
    setFilterBrand([]);
    setFilterCategory([]);
    setFilterSearch("");
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
      const newSelected = pageData.data.map((n) => n.id);
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

  const handlePopoverClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setPopoverId(id);
    console.log(event);
  };

  const handlePopoverClose = () => {
    setPopoverId(null);
    setAnchorEl(null);
  };

  const handlePopoverListClick = (tgt, id) => {
    handlePopoverClose();
    if (tgt == "view") {
      router.push(`/products/view/${crypt(id)}`);
    }
    if (tgt == "edit") {
      router.push(`/products/edit/${crypt(id)}`);
    }
    if (tgt == "delete") {
      setTextDelDialog(["single", id]);
      setDelId(id);
      setCloseDelDialog(false);
    }
    console.log(tgt, id);
  };
  const handleCloseDelDialog = () => {
    setCloseDelDialog(true);
    setDelId(null);
    setTextAlerts("Deleted Successfully !");
    setCloseAlerts(false);
  };
  const handleConfirmDelDialog = async () => {
    let res = await api
      .patch(`/products/${delId}`, { status: "deleted" })
      .then((r) => r);
    if (res.status == 200) {
      setCloseDelDialog(true);
      setSeverityAlerts("success");
      setTextAlerts("Deleted Successfully !");
      setCloseAlerts(false);
      mutate();
    } else {
      setCloseDelDialog(true);
      setSeverityAlerts("error");
      setTextAlerts("An Error Occured, Delete Attempt Failed !");
      setCloseAlerts(false);
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Slide in={!closeAlerts} direction="left">
          <Alert
            variant="filled"
            sx={{ width: 400 }}
            severity={severityAlerts}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setCloseAlerts(true);
                }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }>
            {textAlerts}
          </Alert>
        </Slide>
      </Box>
      <Dialog
        open={!closeDelDialog}
        onClose={handleCloseDelDialog}
        aria-labelledby="del-dialog-title"
        aria-describedby="del-dialog-description">
        <DialogTitle id="del-dialog-title">{`Delete`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="del-dialog-description">
            {textDelDialog[0] == "multiple"
              ? `Are you sure want to delete ${"10"} items?`
              : `Are you sure want to delete this item?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelDialog}>No</Button>
          <Button onClick={handleConfirmDelDialog} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <div className="flex justify-between">
          <div className="">
            <div className="text-2xl font-semibold">Lists</div>

            <div className="text-sm mt-4">Dashboard . Products . List</div>
          </div>
          <div className="flex items-center">
            <Link href={"/products/new"}>
              <Button variant="outlined">+ New Product</Button>
            </Link>
          </div>
        </div>
        <div className="border rounded-xl mt-10 mr-6">
          <div className="p-3 pt-4 ">
            <FormControl sx={{ m: 1, width: 300 }}>
              <TextField
                id="filter-search-field"
                label="Search Product"
                fullWidth
                value={filterSearch}
                onChange={(e) => handleFilterSearch(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FiltersWithData
              filterBrand={filterBrand}
              specific="all"
              handleFilterBrand={handleFilterBrand}
              filterCategory={filterCategory}
              handleFilterCategory={handleFilterCategory}
              brandMenu={brandMenu}
              categoryMenu={categoryMenu}
            />
            <FormControl sx={{ m: 1, width: 250, height: "100%" }}>
              <InputLabel id="filter-sector-label">Status</InputLabel>
              <Select
                labelId="filter-status-label"
                id="filter-status-select"
                value={filterStatus}
                onChange={handleFilterStatus}
                MenuProps={MenuProps}
                input={<OutlinedInput label="Status" />}>
                {["Draft", "Active"].map((x) => (
                  <MenuItem
                    key={`filter${x}`}
                    value={x}
                    sx={{ maxHeight: "100%" }}>
                    <ListItemText primary={x} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {filterBrand.length > 0 ||
          filterStatus ||
          filterCategory.length > 0 ? (
            <div className="p-5 pt-3 pb-2">
              <p className="text text-sm">
                <span className="font-semibold">{pageData?.total}</span> results
                found
              </p>
              <div className="flex items-center gap-3">
                {filterBrand.length > 0 ? (
                  <div className="p-2 pt-1 pb-1 flex gap-2 items-center border rounded-lg">
                    <p className="text-xs font-semibold">Brand:</p>
                    {filterBrand
                      .map((y) => {
                        let srcidx = brandMenu.findIndex((z) => z.id == y);
                        return brandMenu[srcidx].name;
                      })
                      .map((x, idx) => (
                        <Chip
                          label={x}
                          key={"fsk-" + idx}
                          variant="outlined"
                          onDelete={() => {
                            handleDeleteFilterBrand(idx);
                          }}
                        />
                      ))}
                  </div>
                ) : null}
                {filterCategory.length > 0 ? (
                  <div className="p-2 pt-1 pb-1 flex gap-2 items-center border rounded-lg">
                    <p className="text-xs font-semibold">Category:</p>
                    {filterCategory
                      .map((y) => {
                        let srcidx = categoryMenu.findIndex((z) => z.id == y);
                        return categoryMenu[srcidx].name;
                      })
                      .map((x, idx) => (
                        <Chip
                          label={x}
                          key={"fsk-" + idx}
                          variant="outlined"
                          onDelete={() => {
                            handleDeleteFilterCategory(idx);
                          }}
                        />
                      ))}
                  </div>
                ) : null}
                {filterStatus ? (
                  <div className="p-2 pt-1 pb-1 flex gap-2 items-center border rounded-lg">
                    <p className="text-xs font-semibold">Status:</p>
                    <Chip
                      label={filterStatus}
                      variant="outlined"
                      onDelete={() => setFilterStatus(null)}
                    />
                  </div>
                ) : null}
                <Button onClick={handleClearFilterClick}>Clear</Button>
              </div>
            </div>
          ) : null}
          <div className="data">
            <TableContainer style={{ maxHeight: 450 }}>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"small"}
                stickyHeader>
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={pageData?.total}
                />
                <TableBody sx={{ maxHeight: "40%" }}>
                  {pageData
                    ? pageData.data.map((x, idx) => {
                        const isItemSelected = isSelected(x.id);
                        const labelId = `enhanced-table-checkbox-${idx}`;
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, x.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            key={x.id}
                            selected={isItemSelected}
                            sx={{
                              cursor: "pointer",
                              marginTop: "1rem",
                              marginBottom: "1rem",
                            }}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell component="td" id={labelId} scope="row">
                              <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-xl bg-slate-400">
                                  {x?.defimg ? (
                                    <img
                                      className="w-full h-full object-fill rounded-2xl"
                                      src={`${
                                        "http://localhost:8000/storage/" +
                                        x.defimg
                                      }`}
                                      alt=""
                                    />
                                  ) : null}
                                </div>
                                <div className="">
                                  <p className="text-md font-bold">{x.name}</p>
                                  <p className="">{x.model ?? "-"}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell size="small" align="left">
                              {x.brand}
                            </TableCell>
                            <TableCell size="small" align="left">
                              {x.category}
                            </TableCell>
                            <TableCell
                              size="small"
                              align="left"
                              sx={{ width: 150 }}>
                              <StockBar value={x.stock} />
                            </TableCell>
                            <TableCell align="right">
                              <div className="flex justify-between">
                                <p>IDR</p>
                                <p>{x.price.toLocaleString("de-DE")}</p>
                              </div>
                            </TableCell>
                            <TableCell align="left">{x.status}</TableCell>
                            <TableCell align="center" sx={{ width: 50 }}>
                              <IconButton
                                onClick={(e) => handlePopoverClick(e, x.id)}
                                id={`popover${x.id}`}>
                                <MoreVertIcon />
                              </IconButton>
                              <Popover
                                id={`popover${x.id}`}
                                open={popoverId == x.id}
                                anchorEl={anchorEl}
                                onClose={handlePopoverClose}
                                anchorOrigin={{
                                  vertical: "center",
                                  horizontal: "left",
                                }}
                                transformOrigin={{
                                  vertical: "center",
                                  horizontal: "right",
                                }}>
                                <List>
                                  <ListItemButton
                                    sx={{
                                      paddingLeft: "2rem",
                                      paddingRight: "2rem",
                                    }}
                                    hover
                                    onClick={() =>
                                      handlePopoverListClick("view", x.id)
                                    }>
                                    <ListItemText primary="View" />
                                  </ListItemButton>
                                  <ListItemButton
                                    sx={{
                                      paddingLeft: "2rem",
                                      paddingRight: "2rem",
                                    }}
                                    hover
                                    onClick={() =>
                                      handlePopoverListClick("edit", x.id)
                                    }>
                                    <ListItemText primary="Edit" />
                                  </ListItemButton>
                                  <ListItemButton
                                    sx={{
                                      paddingLeft: "2rem",
                                      paddingRight: "2rem",
                                    }}
                                    hover
                                    onClick={() =>
                                      handlePopoverListClick("delete", x.id)
                                    }>
                                    <ListItemText primary="Delete" />
                                  </ListItemButton>
                                </List>
                              </Popover>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : [1, 1, 1, 1, 1].map((x) => {
                        return (
                          <TableRow key={`skeleton${Math.random() * 19}`}>
                            <TableCell padding="checkbox">
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={pageData?.total ?? 0}
              rowsPerPage={pageData?.per_page ?? 0}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      </div>
    </>
  );
}
