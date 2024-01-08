"use client";
import React, { useState, useEffect } from "react";
import ProductSrc from "../components/productsrc";
import {
  Button,
  Divider,
  FormControl,
  Chip,
  Select,
  InputLabel,
  Backdrop,
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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../../services/api";

export default function StockInForm({ hide, setHide, update }) {
  const [items, setItems] = useState([]);
  const [productSelected, setProductSelected] = useState();
  const handleCloseBackdrop = () => {
    setHide(true);
  };
  const handleSelectProduct = (e, val) => {
    setProductSelected(val);
  };
  const handleAddProduct = () => {
    var itemObj = {
      pid: productSelected.id,
      product_id: productSelected.id,
      name: productSelected.name,
      count: 0,
      type: "I",
      serial: "",
      source: "",
    };
    setItems((p) => [...p, itemObj]);
  };
  const handleFieldChange = (tgt, val, idx) => {
    var newArr = [];
    var lastData = [].concat(items);
    lastData.forEach((x, index) => {
      if (index == idx) {
        if (tgt == "serial" && x.count != 1) {
          x.count = 1;
        }
        if (tgt == "count" && x.serial.length != 0) {
          val = 1;
        }
        x[tgt] = val;
      }
      newArr.push(x);
    });
    setItems(lastData);
  };
  const handleDeleteProduct = (idx) => {
    var lastData = [].concat(items).filter((x, indx) => idx != indx);
    setItems(lastData);
  };
  const handleSubmit = async () => {
    console.log(items);
    const postDatas = [].concat(items);
    console.log(postDatas);

    const res = await api
      .post("/stocks", JSON.stringify({ datas: postDatas }))
      .then((data) => data);

    if (res.status == 200) {
      setItems([]);
      setHide(true);
      update();
    }
  };
  return (
    <div
      className={`w-screen h-screen grid-cols-5 fixed top-0 left-0 z-50 ${
        hide ? "hidden" : "grid"
      } bg-backdrop`}>
      <div
        onClick={() => handleCloseBackdrop()}
        className="md:col-span-3 col-span-1"></div>
      <div
        className={`md:col-span-2 col-span-4 h-screen bg-white p-6 flex  flex-col justify-between`}>
        <div className="">
          <div className="pb-6">
            <p>Register New Stock</p>
          </div>
          <div className="grid grid-cols-4 gap-4 ">
            <div className="col-span-4 md:col-span-3 flex items-center">
              <ProductSrc
                value={productSelected}
                changeHandler={handleSelectProduct}
              />
            </div>
            <div className="col-span-4 md:col-span-1 flex items-center">
              <Button
                component="label"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleAddProduct()}>
                Add Product
              </Button>
            </div>
          </div>
          <div className="">
            {items?.map((x, idx) => (
              <div
                className=" items-center mt-3 border rounded-xl border-slate-600 p-2"
                key={`itemstockin${idx}xxx`}>
                <div className="grid grid-cols-5 gap-2 border-b-slate-600 border-b-2 items-center">
                  <div className="col-span-4 items-end">
                    <p>{x.name}</p>
                  </div>
                  <div className="col-span-1">
                    <IconButton onClick={() => handleDeleteProduct(idx)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 mt-3">
                  <div className="col-span-2">
                    <TextField
                      size="small"
                      id={`product-stock-count-field${idx}`}
                      label="Qty"
                      value={items[idx].count}
                      type="number"
                      onChange={(e) =>
                        handleFieldChange("count", e.target.value, idx)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <TextField
                      size="small"
                      id={`product-stock-serial-field${idx}`}
                      label="Serial"
                      value={items[idx].serial}
                      onChange={(e) =>
                        handleFieldChange("serial", e.target.value, idx)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <TextField
                      size="small"
                      id={`product-stock-source-field${idx}`}
                      label="Source"
                      value={items[idx].source}
                      onChange={(e) =>
                        handleFieldChange("source", e.target.value, idx)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <Button onClick={() => handleSubmit()}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
