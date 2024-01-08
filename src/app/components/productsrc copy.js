"use client";

import React, { useState } from "react";
import useSWR from "swr";
import api from "../../services/api";
import {
  Button,
  Divider,
  FormControl,
  Autocomplete,
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

export default function ProductSrch() {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [details, setDetails] = useState([]);
  const { data: data } = useSWR("/productSrc", api.get);

  const defaultProps = {
    options: data?.data ?? [],
    getOptionLabel: (option) => option.name,
  };

  const handleAddField = () => {
    if (!product) return;
    var newObj = {
      name: product.name,
      id: product.id,
      serial: "",
      source: "",
      count: 0,
    };

    const newArr = [...products, newObj];
    setProducts(newArr);
    setProduct(null);
  };

  return (
    <div>
      <div className="">
        <FormControl sx={{ width: "100%", paddingTop: "1.25rem" }}>
          <Autocomplete
            {...defaultProps}
            id="product-search-field"
            value={product}
            onChange={(event, newValue) => {
              setProduct(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Product"
                variant="standard"
              />
            )}
          />
        </FormControl>
        <Button
          onClick={() => {
            handleAddField();
          }}>
          Add
        </Button>
      </div>
      <div className="tabel">
        <div className="grid grid-cols-4">
          <div className="">Produk</div>
          <div className="">Jumlah</div>
          <div className="">Serial</div>
          <div className="">Sumber</div>
        </div>
        {products.map((x, idx) => (
          <div
            className="grid grid-cols-4"
            key={`product-stock-list${x + idx}`}>
            <div className="">{x.name}</div>
            <div className="">
              <TextField
                id="product-stock-count-field"
                label="Product Description"
                onChange={(e) =>
                  handleFieldChange("count", e.target.value, idx)
                }
              />
            </div>
            <div className="">
              <TextField
                id="product-stock-serial-field"
                label="Product Description"
                onChange={(e) =>
                  handleFieldChange("serial", e.target.value, idx)
                }
              />
            </div>
            <div className="">
              <TextField
                id="product-stock-source-field"
                label="Product Description"
                onChange={(e) =>
                  handleFieldChange("source", e.target.value, idx)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
