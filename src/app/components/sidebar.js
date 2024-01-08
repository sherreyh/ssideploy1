"use client";
import React, { useState, useEffect } from "react";
import {
  MenuList,
  MenuItem,
  Divider,
  Typography,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePageState } from "./context/states";

export default function SideBar({ display }) {
  const { hideLoading, hideSide } = usePageState();
  const [listExpand, setListExpand] = useState("");

  const expandVariant = {
    expand: {
      height: "fit-content",
      opacity: 1,
    },
    shrink: {
      height: 0,
      opacity: 0,
    },
  };
  const chevronVariant = {
    expand: {
      rotate: 90,
    },
    shrink: {
      rotate: 0,
    },
  };
  const containerVariants = {
    hidden: {
      width: 0,
      opacity: 0,
    },
    showed: {
      width: "auto",
      opacity: 1,
    },
  };

  const handleStrechMenu = () => {
    return <></>;
  };

  const handleExpand = (subj) => {
    if (listExpand != subj) {
      setListExpand(subj);
    } else {
      setListExpand("");
    }
  };

  return (
    <motion.div
      animate={hideSide ? "hidden" : "showed"}
      variants={containerVariants}
      className="border border-l-0 border-r-black h-full ">
      {/* Apps Menu */}
      <MenuList sx={{ paddingRight: "1rem" }}>
        <MenuItem sx={{ borderRadius: "0 1rem 1rem 0", width: "15.1rem" }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <Divider textAlign="left">
          <Typography variant="overline" display="block">
            Apps
          </Typography>
        </Divider>
        {/* Invoice Menus */}

        {/* <MenuItem
          onClick={() => handleExpand("invoice")}
          sx={{
            borderRadius: "0 1rem 1rem 0",
            width: "15.1rem",
            marginBottom: ".15rem",
            backgroundColor:
              listExpand == "invoice" ? "rgba(0,0,0,0.05)" : "none",
          }}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText>Invoice</ListItemText>
          <motion.div
            variants={chevronVariant}
            initial="shrink"
            animate={listExpand == "invoice" ? "expand" : "shrink"}>
            <KeyboardArrowRightIcon />
          </motion.div>
        </MenuItem>
        <motion.div
          variants={expandVariant}
          initial="shrink"
          animate={listExpand == "invoice" ? "expand" : "shrink"}>
          <Link href={"/invoices/lists"}>
            <MenuItem
              sx={{
                borderRadius: "0 1rem 1rem 0",
                width: "15.1rem",
                marginBottom: ".15rem",
              }}>
              <ListItemIcon>
                <RadioButtonUncheckedIcon fontSize="tiny" />
              </ListItemIcon>
              <ListItemText>List</ListItemText>
            </MenuItem>
          </Link>
          <Link href={"/invoices/new"}>
            <MenuItem
              sx={{
                borderRadius: "0 1rem 1rem 0",
                width: "15.1rem",
                marginBottom: ".15rem",
              }}>
              <ListItemIcon>
                <RadioButtonUncheckedIcon fontSize="tiny" />
              </ListItemIcon>
              <ListItemText>Add</ListItemText>
            </MenuItem>
          </Link>
        </motion.div> */}

        {/* Stock Control Menus */}
        <Link href={"/stocks"}>
          <MenuItem
            onClick={() => handleExpand("stock")}
            sx={{
              borderRadius: "0 1rem 1rem 0",
              width: "15.1rem",
              marginBottom: ".15rem",
              backgroundColor:
                listExpand == "stock" ? "rgba(0,0,0,0.05)" : "none",
            }}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText>Stock Control</ListItemText>
          </MenuItem>
        </Link>
        <Divider textAlign="left">
          <Typography variant="overline" display="block">
            Database
          </Typography>
        </Divider>
        {/* <MenuItem
          onClick={() => handleExpand("customers")}
          sx={{
            borderRadius: "0 1rem 1rem 0",
            width: "15.1rem",
            marginBottom: ".15rem",
            backgroundColor:
              listExpand == "customers" ? "rgba(0,0,0,0.05)" : "none",
          }}>
          <ListItemIcon>
            <PeopleAltRoundedIcon />
          </ListItemIcon>
          <ListItemText>Customers</ListItemText>
          <motion.div
            variants={chevronVariant}
            initial="shrink"
            animate={listExpand == "customers" ? "expand" : "shrink"}>
            <KeyboardArrowRightIcon />
          </motion.div>
        </MenuItem>
        <motion.div
          variants={expandVariant}
          initial="shrink"
          animate={listExpand == "customers" ? "expand" : "shrink"}>
          <Link href={"/customers/lists"}>
            <MenuItem
              sx={{
                borderRadius: "0 1rem 1rem 0",
                width: "15.1rem",
                marginBottom: ".15rem",
              }}>
              <ListItemIcon>
                <RadioButtonUncheckedIcon fontSize="tiny" />
              </ListItemIcon>
              <ListItemText>List</ListItemText>
            </MenuItem>
          </Link>
          <Link href={"/customers/new"}>
            <MenuItem
              sx={{
                borderRadius: "0 1rem 1rem 0",
                width: "15.1rem",
                marginBottom: ".15rem",
              }}>
              <ListItemIcon>
                <RadioButtonUncheckedIcon fontSize="tiny" />
              </ListItemIcon>
              <ListItemText>Add</ListItemText>
            </MenuItem>
          </Link>
        </motion.div> */}
        <MenuItem
          onClick={() => handleExpand("products")}
          sx={{
            borderRadius: "0 1rem 1rem 0",
            width: "15.1rem",
            marginBottom: ".15rem",
            backgroundColor:
              listExpand == "products" ? "rgba(0,0,0,0.05)" : "none",
          }}>
          <ListItemIcon>
            <CategoryRoundedIcon />
          </ListItemIcon>
          <ListItemText>Products</ListItemText>
          <motion.div
            variants={chevronVariant}
            initial="shrink"
            animate={listExpand == "products" ? "expand" : "shrink"}>
            <KeyboardArrowRightIcon />
          </motion.div>
        </MenuItem>
        <motion.div
          variants={expandVariant}
          initial="shrink"
          animate={listExpand == "products" ? "expand" : "shrink"}>
          <Link href={"/products/lists"}>
            <MenuItem
              sx={{
                borderRadius: "0 1rem 1rem 0",
                width: "15.1rem",
                marginBottom: ".15rem",
              }}>
              <ListItemIcon>
                <RadioButtonUncheckedIcon fontSize="tiny" />
              </ListItemIcon>
              <ListItemText>List</ListItemText>
            </MenuItem>
          </Link>
          <Link href={"/products/new"}>
            <MenuItem
              sx={{
                borderRadius: "0 1rem 1rem 0",
                width: "15.1rem",
                marginBottom: ".15rem",
              }}>
              <ListItemIcon>
                <RadioButtonUncheckedIcon fontSize="tiny" />
              </ListItemIcon>
              <ListItemText>Add</ListItemText>
            </MenuItem>
          </Link>
        </motion.div>
      </MenuList>
    </motion.div>
  );
}
