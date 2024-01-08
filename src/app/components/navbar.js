"use client";
import React, { useEffect } from "react";
import { IconButton } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import { usePageState } from "./context/states";

// import { useUser,UserButton } from "@clerk/nextjs";

const sideVar = {
  hide: {
    width: 0,
    opacity: 0,
  },
  show: {
    width: "auto",
    opacity: 1,
  },
};
const bgVar = {
  hide: {
    opacity: 0,
  },
  show: {
    opacity: 1,
  },
};

export default function NavBar() {
  const { scrolledPage, setScrolledPage, hideSide, setHideSide } =
    usePageState();
  const handleCloseSide = () => {
    setHideSide(true);
  };
  const handleScroll = () => {
    if (
      (window.scrollY > 8 && scrolledPage) ||
      (window.scrollY <= 8 && !scrolledPage)
    ) {
      return;
    }
    // console.log(window.scrollY);
    if (window.scrollY > 8) setScrolledPage(true);
    if (window.scrollY <= 8) setScrolledPage(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
  return (
    <div
      className={`w-screen h-16   flex justify-between items-center pr-6 pl-6 fixed top-0 left-0 border ${
        scrolledPage ? "bg-glass backdrop-blur-md " : "bg-white"
      } border-b-black z-50`}>
      <div className="">
        <IconButton onClick={() => setHideSide((p) => !p)}>
          <SortIcon />
        </IconButton>
      </div>
    </div>
  );
}
