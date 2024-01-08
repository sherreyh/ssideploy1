"use client";
import React, { useState, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { usePageState } from "./context/states";

export default function LoadingPage() {
  const { hideLoading, setHideLoading } = usePageState();

  const handleClose = () => {
    setHideLoading(true);
  };
  const handleOpen = () => {
    setHideLoading(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full ">
      <Button onClick={handleOpen}>Show backdrop</Button>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={hideLoading}
        onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
