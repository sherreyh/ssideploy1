"use client";

import React, { useState } from "react";
import useSWR from "swr";
import api from "../../services/api";
import { FormControl, Autocomplete, TextField, Skeleton } from "@mui/material";
const defData = [
  {
    id: 31089,
    name: "",
  },
];
export default function ProductSrch({ value, changeHandler, inStock }) {
  const { data: data } = useSWR(`/productSrc?inStock=${inStock}`, api.get);

  const defaultProps = {
    options: data?.data,
    getOptionLabel: (option) => option?.name,
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      {data ? (
        <Autocomplete
          {...defaultProps}
          id="product-search-field"
          value={value}
          onChange={changeHandler}
          renderInput={(params) => (
            <TextField {...params} label="Search Product" variant="standard" />
          )}
        />
      ) : (
        <Skeleton />
      )}
    </FormControl>
  );
}
