"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import StockInForm from "../components/stockin";
import {
  Button,
  FormControl,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  TableRow,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { Input } from "@mui/icons-material";

import SearchIcon from "@mui/icons-material/Search";
import { FiltersWithData } from "../components/datafilters";
import axios from "axios";
import useSWR from "swr";
import api from "../../services/api";
import StockOutForm from "../components/stockout";

export default function ViewProductPage() {
  const [brandMenu, setBrandMenu] = useState([]);
  const [filterBrand, setFilterBrand] = useState([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hideOut, setHideOut] = useState(true);
  const [hideIn, setHideIn] = useState(true);
  /**
   * Page Memo
   */
  const isSelected = (id) => selected.indexOf(id) !== -1;
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage) : null;
  /**
   * Page Effects
   */

  useEffect(() => {
    getData(setBrandMenu);
  });

  const pageRef = useRef();
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
    }
  };
  const { data: data, mutate } = useSWR(
    `/products?page=${page}${filterSearch ? "&search=" + filterSearch : ""}${
      filterBrand.length > 0
        ? "&filterBrand=" + filterBrand.join(",")
        : "&stockControl=TRUE"
    }`,
    api.get
  );

  var pageData = data?.data[0];
  // console.log(pageData);

  const headCells = [
    {
      id: "product",
      numeric: false,
      disablePadding: true,
      label: "Product",
    },
    {
      id: "stock",
      numeric: false,
      disablePadding: false,
      label: "Stock",
    },
  ];
  const historyHeadCells = [
    {
      id: "product",
      numeric: false,
      disablePadding: true,
      label: "Product",
    },
    {
      id: "type",
      numeric: false,
      disablePadding: false,
      label: "Type",
    },
    {
      id: "count",
      numeric: false,
      disablePadding: false,
      label: "Count",
    },
    {
      id: "date",
      numeric: false,
      disablePadding: false,
      label: "Date",
    },
    {
      id: "pic",
      numeric: false,
      disablePadding: false,
      label: "PIC",
    },
  ];

  const handleFilterSearch = (e) => {
    setFilterSearch(e.target.value);
  };
  const handleFilterBrand = (event) => {
    const {
      target: { value },
    } = event;
    setFilterBrand(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleDeleteFilterBrand = (x) => {
    let oArr = [...filterBrand];
    let frsh = [];
    oArr.forEach((y, idx) => {
      if (idx != x) frsh.push(y);
    });
    setFilterBrand(frsh);
  };
  const handleClearFilterClick = () => {
    setFilterBrand([]);
    setFilterSearch("");
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

  const handleNewStock = (type) => {
    if (type == "in") setHideIn((p) => !p);
    if (type == "out") setHideOut((p) => !p);
  };

  return (
    <>
      <StockInForm hide={hideIn} setHide={setHideIn} update={mutate} />
      <StockOutForm hide={hideOut} setHide={setHideOut} update={mutate} />
      <div className={`h-full pl-5 md:pl-0 pb-5 md:pb-0 z-0 `} ref={pageRef}>
        <div className="flex justify-between flex-wrap ">
          <div className="">
            <div className="text-2xl font-semibold">Stocks</div>

            <div className="text-sm mt-4">Dashboard . Stock</div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outlined" onClick={() => handleNewStock("in")}>
              + In
            </Button>
            <Button variant="outlined" onClick={() => handleNewStock("out")}>
              + Out
            </Button>
          </div>
        </div>
        <div className="border rounded-xl mt-10 mr-6">
          <div className="p-3 pt-4 flex items-end flex-wrap">
            <FormControl>
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
              specific="brand"
              handleFilterBrand={handleFilterBrand}
              brandMenu={brandMenu}
            />
            {filterBrand.length > 0 ? (
              <div className="p-5 pt-3 pb-2">
                <p className="text text-sm">
                  <span className="font-semibold">{pageData?.total ?? 0}</span>{" "}
                  results found
                </p>
                <div className="flex items-center gap-3">
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

                  <Button onClick={handleClearFilterClick}>Clear</Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="md:grid md:grid-cols-9 mt-4 mr-6">
          <div className="w-full col-span-5 p-3">
            <div className="">
              <p className="text-md font-semibold">List</p>
            </div>
            <TableContainer sx={{ minHeight: 400, zIndex: 0 }}>
              <Table sx={{ minWidth: 300 }} aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow>
                    {headCells.map((headCell, idx) => (
                      <TableCell
                        key={`${headCell.id}${idx}`}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}>
                        <p className="text-md font-semibold">
                          {headCell.label}
                        </p>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ maxHeight: "40%", maxWidth: "100%" }}>
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
                            key={`tablestock${x.id}${idx}`}
                            selected={isItemSelected}
                            sx={{
                              cursor: "pointer",
                              marginTop: "1rem",
                              marginBottom: "1rem",
                            }}>
                            <TableCell component="td" id={labelId} scope="row">
                              <div className="flex items-center gap-5">
                                <div className="w-12 h-auto rounded-xl bg-slate-400">
                                  <img
                                    className="w-full h-full object-fill rounded-2xl"
                                    src={`${
                                      "http://localhost:8000/storage/" +
                                      x.defimg
                                    }`}
                                    alt=""
                                  />
                                </div>
                                <div className="">
                                  <p className="text-md font-bold">{x.name}</p>
                                  <p className="text-md font-medium">
                                    {x.brand ?? "-"}
                                  </p>
                                  <p className="">{x.model ?? "-"}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell size="small" align="left">
                              {x.stock}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : [1, 1, 1, 1, 1].map((x, indx) => {
                        return (
                          <TableRow key={`skeleton-row${indx}`}>
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
          </div>
          <div className="w-full col-span-4 p-3 border-black border rounded-xl">
            <div className="">
              <p className="text-md font-semibold">History</p>
            </div>
            <div className="p-1">
              <TableContainer style={{ minHeight: 400 }}>
                <Table
                  sx={{ minWidth: 400 }}
                  aria-labelledby="tableTitle"
                  stickyHeader>
                  <TableHead sx={{ zIndex: 0 }}>
                    <TableRow>
                      {historyHeadCells.map((headCell, idx) => (
                        <TableCell
                          key={`tablehist${headCell.id}${idx}`}
                          align={headCell.numeric ? "right" : "left"}
                          padding={headCell.disablePadding ? "none" : "normal"}>
                          <p className="text-sm font-semibold">
                            {headCell.label}
                          </p>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ maxHeight: "40%" }}>
                    {pageData
                      ? data?.data[1].map((x, idx) => {
                          const isItemSelected = isSelected(x.id);
                          const labelId = `enhanced-table-checkbox-${idx}`;
                          const dateCr = new Date(x.created_at);
                          const formatter = new Intl.DateTimeFormat("en-US", {
                            dateStyle: "long",
                          });
                          const formattedDate = formatter.format(dateCr);

                          return (
                            <TableRow
                              hover
                              onClick={(event) => handleClick(event, x.id)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              key={`${x.id}tablerow${idx}`}
                              selected={isItemSelected}
                              sx={{
                                cursor: "pointer",
                                marginTop: "0.5rem",
                                marginBottom: "0.5rem",
                                alignItems: "center",
                              }}>
                              <TableCell
                                component="td"
                                id={labelId}
                                scope="row">
                                <div className="text-sm">
                                  <p className="text-md font-bold">{x.name}</p>
                                  <p className="">{x.model ?? "-"}</p>
                                </div>
                              </TableCell>
                              <TableCell size="small" align="left">
                                <p className="text-sm">
                                  {x.type == "I"
                                    ? "Inbound"
                                    : x.type == "O"
                                    ? "Outbound"
                                    : "Checking"}
                                </p>
                              </TableCell>
                              <TableCell size="small" align="left">
                                <p className="text-sm">{x.count}</p>
                              </TableCell>
                              <TableCell size="small" align="left">
                                <p className="text-sm">{formattedDate}</p>
                              </TableCell>
                              <TableCell size="small" align="left">
                                <p className="text-sm">{x.pic}</p>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      : [1, 1, 1, 1, 1].map((x) => {
                          return (
                            <TableRow key={`skeletonRow${Math.random() * 32}`}>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
