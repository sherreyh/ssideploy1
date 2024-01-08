"use client";
import React, { useState } from "react";
import api from "../../../services/api";
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  Dialog,
  MenuItem,
  DialogActions,
  OutlinedInput,
  DialogContent,
  Select,
  DialogContentText,
  TextField,
  DialogTitle,
  Typography,
  Autocomplete,
  InputAdornment,
  MenuList,
  ListItemIcon,
  Container,
  CircularProgress,
} from "@mui/material";
import { customerData } from "../../../datas/mockCustomer";
import useSWR from "swr";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
    />
  );
});
const AccountingFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="IDR"
    />
  );
});

const itemsMockData = {
  1: {
    product: "Universal Oven",
    brand: "Memmert",
    type: "UN55",
    price: {
      government: 100000000,
      standard: 50000000,
      custom: 100000000,
    },
  },
  2: {
    product: "Incubator",
    brand: "Memmert",
    type: "IN20",
    price: {
      government: 25000000,
      standard: 10000000,
      custom: 100000000,
    },
  },
};

export default function NewInvoicePage() {
  const [dateIssue, setDateIssue] = useState("");
  const [dateDue, setDateDue] = useState("");
  const [invStatus, setInvStatus] = useState("");
  const [invFranco, setInvFranco] = useState(0);
  const [invDiscount, setInvDiscount] = useState(0);
  const [invTax, setInvTax] = useState(true);
  const [hideCustomerDialog, setHideCustomerDialog] = useState(true);
  const [custSearch, setCustSearch] = useState("");
  const [custOption, setCustOption] = useState([]);
  const [itemList, setItemList] = useState([
    {
      product_id: 1,
      pricing: "standard",
      qty: 1,
      discount: 0,
      price: 50000000,
    },
    {
      product_id: 2,
      pricing: "standard",
      qty: 1,
      discount: 0,
      price: 10000000,
    },
    {
      product_id: 2,
      pricing: "government",
      qty: 1,
      discount: 0,
      price: 25000000,
    },
  ]);
  const { data, isLoading, isValidating } = useSWR(
    `/customers?search=${custSearch}`,
    api.get
  );

  const handleItemEdit = (tgt, sub, val) => {
    var newx = itemList[tgt];
    if (sub === "pricing") {
      newx.pricing = val;
      newx.price = itemsMockData[`${newx.product_id}`].price[`${newx.pricing}`];
    } else if (sub === "qty") {
      let newval = parseInt(val);
      newx.qty = newval < 1 ? 1 : newval;
    } else if (sub === "discount") {
      let newval = parseInt(val);
      newval = newval < 0 ? 0 : newval;
      newval = newval > 70 ? 70 : newval;
      newx.discount = newval;
    }
    var newList = [...itemList].map((x, idx) => (idx === tgt ? newx : x));
    setItemList(newList);
  };
  const handleItemPriceEdit = (tgt, val) => {
    var newx = itemList[tgt];
    if (newx.pricing === "custom") {
      newx.price = parseInt(val);
    }
    var newList = [...itemList].map((x, idx) => (idx === tgt ? newx : x));
    setItemList(newList);
  };
  const handleItemRemove = (tgt) => {
    var newList = [];
    var oldList = [...itemList];
    oldList.forEach((x, idx) => {
      if (tgt !== idx) {
        newList.push(x);
      }
    });
    setItemList(newList);
  };
  const handleItemAdd = () => {
    let newArr = [...itemList];
    newArr.push({
      product_id: 1,
      pricing: "standard",
      qty: 1,
      discount: 0,
      price: 100000000,
    });
    setItemList(newArr);
  };
  const handleOpenCustDialog = () => {
    setHideCustomerDialog(false);
  };
  const handleCloseCustDialog = () => {
    setHideCustomerDialog(true);
  };

  var itemSum =
    itemList.length <= 0
      ? 0
      : itemList.reduce((y, z) => {
          let a =
            (parseInt(z.price) -
              parseInt(z.price) * (parseInt(z.discount) / 100)) *
            z.qty;
          return y + a;
        }, 0);
  var dispDiscount = Math.floor(itemSum * (parseInt(invDiscount) / 100));
  var dispTax = (itemSum - dispDiscount) * (invTax ? 0.11 : 0);
  var dispSubtotal = itemSum - dispDiscount + parseInt(invFranco);
  var dispAmount = dispSubtotal + dispTax;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={!hideCustomerDialog}
        onClose={handleCloseCustDialog}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>
          <p>Customers</p>
          <TextField
            id="customer-search-field"
            placeholder="Search Customers"
            fullWidth
            value={custSearch}
            onChange={(e) => setCustSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            className="mt-3 mb-3"
          />
          <Divider />
        </DialogTitle>
        <DialogContent>
          <MenuList>
            {data ? (
              data.data.data.map((x) => (
                <MenuItem
                  sx={{ borderRadius: ".5rem", marginTop: ".5rem" }}
                  key={`dialogMenuListKey${x.name + x.company}`}
                  selected>
                  <div className="p-2 w-24">
                    <p className="text-sm font-medium">{x.name}</p>
                    <p className="text-xs font-medium pt-3 pb-3">{x.company}</p>
                    <p className="text-sm font-medium text-slate-600">
                      {x.address}
                    </p>
                  </div>
                </MenuItem>
              ))
            ) : (
              <MenuItem sx={{ borderRadius: "0 1rem 1rem 0", width: "5rem" }}>
                <CircularProgress />
              </MenuItem>
            )}
          </MenuList>
        </DialogContent>
      </Dialog>
      <div>
        <div className="">
          <div className="text-2xl font-semibold">Lists</div>
          <div className="text-sm mt-4">Dashboard . Invoice . New Invoice</div>
        </div>
        <div className="w-full border-slate-400 border rounded-lg mt-10  pt-2">
          <div className="flex justify-between items-start gap-6 p-4 pr-6 pl-6">
            <div className="">
              <div className="flex justify-between items-start w-full">
                <p className="text-lg font-semibold text-slate-500 pt-1">To:</p>
                <IconButton onClick={handleOpenCustDialog}>
                  <ModeEditRoundedIcon fontSize="small" />
                </IconButton>
              </div>
              <div className="">
                <p className="text p-1 pr-0 pl-0 text-sm text-black font-bold">
                  Unselected
                </p>
                <p className="text p-1 pr-0 pl-0 text-sm text-slate-700 ">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Quaerat officiis blanditiis dolores.
                </p>
                <p className="text p-1 pr-0 pl-0 text-sm text-slate-700 ">
                  0251 9230-12302
                </p>
              </div>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="flex justify-between w-1/2">
              <p className="text-lg font-semibold text-slate-500">To:</p>
              <IconButton>
                <ModeEditRoundedIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
          <div className="flex justify-between items-start gap-6 p-4 pr-6 pl-6 bg-slate-100">
            <div className="grid grid-cols-4 w-full gap-6">
              <FormControl>
                <TextField
                  id="inv-number-field"
                  label="Invoice Number"
                  value={"SSI.I2309.0021"}
                  disabled
                />
              </FormControl>
              <FormControl sx={{ width: "100%", height: "100%" }}>
                <InputLabel id="invoice-status-label">Status</InputLabel>
                <Select
                  labelId="invoice-status-label"
                  id="invoice-status-select"
                  onChange={(x) => setInvStatus(x)}
                  sx={{ maxHeight: "100%" }}
                  input={<OutlinedInput label="Status" />}>
                  {["paid", "draft", "overdue", "pending"].map((name) => (
                    <MenuItem key={name} value={name}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: "100%", height: "100%" }}>
                <DatePicker
                  label="Date Issue"
                  value={dateIssue}
                  maxDate={dateDue ? dayjs(dateDue) : null}
                  onChange={(x) => setDateIssue(x)}
                />
              </FormControl>
              <FormControl sx={{ width: "100%", height: "100%" }}>
                <DatePicker
                  label="Date Due"
                  value={dateDue}
                  minDate={dateIssue ? dayjs(dateIssue) : null}
                  onChange={(x) => {
                    setDateDue(x);
                  }}
                />
              </FormControl>
            </div>
          </div>
          <div className=" gap-6 p-4 pr-6 pl-6">
            <div className="pb-8">
              <p className="text-lg font-semibold text-slate-500 pt-1">
                Items:
              </p>
            </div>
            {itemList.map((x, idx) => {
              let prd = itemsMockData[`${x.product_id}`];
              let prc =
                x.pricing == "custom"
                  ? parseInt(x.price)
                  : prd.price[`${x.pricing}`];
              let ptot = (prc - prc * (x.discount / 100)) * x.qty;

              return (
                <div className="" key={`itemListMap${idx}`}>
                  <div className="">
                    <div className="grid grid-cols-12 gap-4">
                      <FormControl className="col-span-4">
                        <TextField
                          id="invoice-item-name-1"
                          label="Product"
                          size="small"
                          value={prd.product}
                          disabled
                        />
                      </FormControl>
                      <FormControl
                        className="col-span-2"
                        sx={{ width: "100%", height: "100%" }}>
                        <InputLabel id="invoice-item-pricing-label-1">
                          Pricing
                        </InputLabel>
                        <Select
                          labelId="invoice-item-pricing-label-1"
                          id="invoice-item-pricing-1"
                          size="small"
                          defaultValue={"standard"}
                          onChange={(e) =>
                            handleItemEdit(idx, "pricing", e.target.value)
                          }
                          input={<OutlinedInput label="Pricing" />}>
                          {["government", "standard", "custom"].map((x) => (
                            <MenuItem key={x} value={x}>
                              {x.charAt(0).toUpperCase() + x.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl className="col-span-1">
                        <TextField
                          label="Qty"
                          type="number"
                          value={x.qty}
                          onChange={(e) =>
                            handleItemEdit(idx, "qty", e.target.value)
                          }
                          name="numberformat"
                          id="invoice-item-qty-1"
                          size="small"
                        />
                      </FormControl>
                      <FormControl className="col-span-2">
                        <TextField
                          label="Price"
                          value={prc}
                          onChange={(e) =>
                            handleItemPriceEdit(idx, e.target.value)
                          }
                          disabled={x.pricing !== "custom"}
                          name="invoice-item-price-1"
                          id="invoice-item-price-1"
                          InputProps={{
                            inputComponent: AccountingFormatCustom,
                          }}
                          size="small"
                        />
                      </FormControl>
                      <FormControl className="col-span-1">
                        <TextField
                          label="Discount"
                          value={x.discount}
                          onChange={(e) =>
                            handleItemEdit(idx, "discount", e.target.value)
                          }
                          name="invoice-item-discount-1"
                          id="invoice-item-discount-1"
                          type="number"
                          size="small"
                        />
                      </FormControl>
                      <FormControl className="col-span-2">
                        <TextField
                          label="Total"
                          value={ptot}
                          // onChange={handleChange}
                          name="invoice-item-total-1"
                          id="invoice-item-total-1"
                          InputProps={{
                            inputComponent: AccountingFormatCustom,
                          }}
                          disabled
                          size="small"
                        />
                      </FormControl>
                    </div>
                    <div className="flex justify-between">
                      <div className=""></div>
                      <div className="">
                        <Button
                          onClick={() => handleItemRemove(idx)}
                          size="small"
                          color="error"
                          startIcon={<DeleteRoundedIcon />}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className=" gap-6 p-4 pt-0 pr-6 pl-6">
            <Divider />
            <div className="flex justify-between pt-6">
              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={handleItemAdd}>
                Add Item
              </Button>
              <div className="flex gap-3">
                <FormControl sx={{ width: "10rem" }}>
                  <TextField
                    label="Franco"
                    value={invFranco}
                    onChange={(e) => setInvFranco(e.target.value)}
                    name="invoice-franco-field"
                    id="invoice-franco-field"
                    type="number"
                    size="small"
                  />
                </FormControl>
                <FormControl sx={{ width: "10rem" }}>
                  <TextField
                    label="Discount"
                    value={invDiscount}
                    onChange={(e) => setInvDiscount(e.target.value)}
                    name="invoice-discount-field"
                    id="invoice-discount-field"
                    type="number"
                    size="small"
                  />
                </FormControl>
                <FormControl sx={{ width: "10rem" }}>
                  <InputLabel id="invoice-item-pricing-label-1">
                    {`Tax (11%)`}
                  </InputLabel>
                  <Select
                    labelId="invoice-tax-label"
                    id="invoice-tax-pricing"
                    size="small"
                    defaultValue={1}
                    onChange={(e) => setInvTax(e.target.value)}
                    input={<OutlinedInput label={`Tax (11%)`} />}>
                    {[1, 0].map((x) => (
                      <MenuItem key={x} value={x}>
                        {x == 1 ? "Yes" : "No"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end flex-col gap-2 p-4 pt-0 pr-6 pl-6 text-sm">
            <div className="w-full flex justify-end ">
              <p>{`Sub-Total (IDR)`}</p>
              <p className="w-40 flex justify-end">
                {itemSum.toLocaleString("de-DE")}
              </p>
            </div>
            <div className="w-full flex justify-end">
              <p>{`Franco (IDR)`}</p>
              <p className="w-40 flex justify-end">
                {invFranco ? invFranco.toLocaleString("de-DE") : "-"}
              </p>
            </div>
            <div className="w-full flex justify-end">
              <p>{`Discount (IDR)`}</p>
              <p className="w-40 flex justify-end">
                {dispDiscount.toLocaleString("de-DE")}
              </p>
            </div>
            <Divider />
            <div className="w-full flex justify-end font-bold">
              <p>{`Subtotal Amount (IDR)`}</p>
              <p className="w-40 flex justify-end">
                {dispSubtotal.toLocaleString("de-DE")}
              </p>
            </div>
            <div className="w-full flex justify-end">
              <p>{`Tax 11% (IDR)`}</p>
              <p className="w-40 flex justify-end">
                {dispTax.toLocaleString("de-DE")}
              </p>
            </div>
            <div className="w-full flex justify-end font-bold">
              <p>{`Total Amount (IDR)`}</p>
              <p className="w-40 flex justify-end">
                {dispAmount.toLocaleString("de-DE")}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button>Save as Draft</Button>
          <Button>Create & Send</Button>
        </div>
      </div>
    </LocalizationProvider>
  );
}
