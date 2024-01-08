"use client";
import React, { useState } from "react";
import ProductSrc from "./productsrc";
import {
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../../services/api";

export default function StockOutForm({ hide, setHide, update }) {
  const [items, setItems] = useState([]);
  const [productSelected, setProductSelected] = useState();
  const [selectedSerials, setSelectedSerials] = useState([]);

  const handleCloseBackdrop = () => {
    setHide(true);
  };
  const handleSelectProduct = (e, val) => {
    setProductSelected(val);
  };
  const handleAddProduct = () => {
    console.log(productSelected);
    // return;
    var itemObj = {
      pid: productSelected.id,
      product_id: productSelected.id,
      name: productSelected.name,
      stock: parseInt(productSelected.stock),
      count: 0,
      serial: "",
      type: "O",
      details: "",
      serials: productSelected?.stocks?.split(",") ?? [],
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
        if (tgt == "serial") {
          let oldVal = x[tgt];
          if (oldVal == "") {
            let found = selectedSerials.indexOf(val) >= 0;
            if (found) {
              val = "";
            } else {
              let lastArr = [].concat(selectedSerials);
              lastArr.push(val);
              setSelectedSerials(lastArr);
            }
          } else {
          }
        }
        if (tgt == "count") {
          if (val > x.stock) {
            val = x.stock;
          }
        }
        if (tgt == "count" && x.serial.length != 0) {
          val = 1;
          console.log(selectedSerials);
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
    // return;
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
            <p>Outbound Stock</p>
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
            {items.map((x, idx) => {
              return (
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
                      <FormControl sx={{ minWidth: "100%" }}>
                        <InputLabel
                          id="demo-simple-select-helper-label"
                          sx={{ marginTop: items[idx].serial ? 0 : -1 }}>
                          Serial
                        </InputLabel>
                        <Select
                          size="small"
                          fullWidth
                          labelId={`product-stock-serial-label${idx}`}
                          id={`product-stock-serial-field${idx}`}
                          value={items[idx].serialsel}
                          label="Serial"
                          disabled={
                            x.serials.filter(
                              (y) =>
                                selectedSerials.indexOf(y) < 0 || y == x.serial
                            ).length == 0
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            handleFieldChange("serial", e.target.value, idx)
                          }>
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {x.serials
                            .filter(
                              (y) =>
                                selectedSerials.indexOf(y) < 0 || y == x.serial
                            )
                            .map((serial, indx) => (
                              <MenuItem
                                key={`serialKeySelect${serial}${idx ^ indx}`}
                                value={serial}>
                                {serial}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="col-span-2">
                      <TextField
                        size="small"
                        id={`product-stock-details-field${idx}`}
                        label="Details"
                        value={items[idx].details}
                        onChange={(e) =>
                          handleFieldChange("details", e.target.value, idx)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="">
          <Button onClick={() => handleSubmit()}>Submit</Button>
        </div>
      </div>
    </div>
  );
}
