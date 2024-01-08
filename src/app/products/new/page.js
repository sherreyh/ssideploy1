"use client";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Button,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, { useState, useRef, useEffect, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import api from "../../../services/api";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import ClearIcon from "@mui/icons-material/Clear";
import { useCurrentEditor, useEditor } from "@tiptap/react";
import { crypt } from "../../../services/encrypturl";
import { usePageState } from "../../components/context/states";

export default function NewProductPage() {
  const { setHideSide } = usePageState();
  /**
   * Page State
   */
  const [nameField, setNameField] = useState("");
  const [descField, setDescField] = useState("");
  const [brandField, setBrandField] = useState("");
  const [modelField, setModelField] = useState("");
  const [categoryField, setCategoryField] = useState("");
  const [widthField, setWidthField] = useState("");
  const [longField, setLongField] = useState("");
  const [heightField, setHeightField] = useState("");
  const [weightField, setWeightField] = useState("");
  const [regpriceField, setRegpriceField] = useState("");
  const [govpriceField, setGovpriceField] = useState("");
  const [files, setFiles] = useState([]);

  const [requiredErrors, setRequiredErrors] = useState([]);

  const [productId, setProductId] = useState(null);

  const [closeDialog, setCloseDialog] = useState(true);

  const router = useRouter();

  /* Page Refs */
  const rteRef = useRef(null);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "image/*": [],
      },
      multiple: true,
      onDrop: (acceptedFiles) => {
        setFiles(
          files.concat(
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            )
          )
        );
      },
    });

  /* Page Effects */
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  /* Fetch Initial Data */
  const { data: data } = useSWR("/mproducts", api.get);
  if (!data) return <></>;
  var pageData = data.data;

  /* Page Function */
  const handleFieldChange = (tgt, val) => {
    if (tgt == "name") {
      setNameField(val);
    } else if (tgt == "desc") {
      setDescField(val);
    } else if (tgt == "brand") {
      setBrandField(val);
    } else if (tgt == "category") {
      setCategoryField(val);
    } else if (tgt == "model") {
      setModelField(val);
    } else if (tgt == "width") {
      if (val < 0) val = 0;
      setWidthField(val);
    } else if (tgt == "long") {
      if (val < 0) val = 0;
      setLongField(val);
    } else if (tgt == "height") {
      if (val < 0) val = 0;
      setHeightField(val);
    } else if (tgt == "weight") {
      if (val < 0) val = 0;
      setWeightField(val);
    } else if (tgt == "regprice") {
      if (val < 0) val = 0;
      setRegpriceField(val);
    } else if (tgt == "govprice") {
      if (val < 0) val = 0;
      setGovpriceField(val);
    }
  };
  const handleDeleteImage = (tgt) => {
    console.log(tgt);
  };

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="inline-flex rounded-2xl mb-0.5 mr-0.5 w-full h-24 p-0.5 box-border">
      <div className="flex min-w-0 overflow-hidden">
        <img
          className="block h-full w-auto"
          src={file.preview}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
        <div className="h-full flex justify-start items-start -ml-8 ">
          <IconButton size="small" onClick={() => handleDeleteImage(file)}>
            <ClearIcon />
          </IconButton>
        </div>
      </div>
    </div>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault;

    var initData = {
      name: "draft",
      brand_id: 1,
      category_id: 1,
      regprice: 1,
      status: "draft",
    };
    var productId = await api.post("products", JSON.stringify(initData));
    console.log(productId, files);

    var fileStored = [];

    for (const file of files) {
      let formData = new FormData();
      formData.append("image", file);
      formData.append("id", productId.data);
      var imgName = await api.post(`/productImages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(imgName);
      fileStored.push(imgName.data);
    }
    // checking entries
    // checking required fields
    var reqErr = [];
    if (!nameField) reqErr.push("name");
    if (!brandField) reqErr.push("brand");
    if (!categoryField) reqErr.push("category");
    if (!regpriceField || regpriceField == 0) reqErr.push("regprice");
    if (reqErr.length > 0) {
      setRequiredErrors(reqErr);
      return;
    }
    let def;
    if (fileStored.length > 0) {
      def = 0;
    }
    // register input
    var postData = {
      name: nameField,
      desc: descField,
      brand_id: brandField,
      model: modelField,
      content: rteRef.current?.editor?.getHTML(),
      category_id: categoryField,
      width: widthField,
      long: longField,
      images: fileStored.join(","),
      defimg: fileStored[def],
      height: heightField,
      weight: weightField,
      regprice: regpriceField,
      govprice: govpriceField,
      status: "active",
    };
    console.log(productId.data);
    var res = await api
      .put(`/products/${productId.data}`, postData)
      .then((r) => r);

    if (res.status == 200) {
      let encId = crypt(res.data);
      setCloseDialog(false);
      setProductId(encId);
    } else {
      console.log(res);
    }
  };

  const handleDialogClick = (dest) => {
    if (dest == "list") {
      //navigate to product list
      router.push(`/products/lists`);
    } else if (dest == "product") {
      //navigate to product details
      router.push(`/products/view/${productId}`);
    }
  };

  return (
    <>
      <Dialog
        open={!closeDialog}
        onClose={() => handleDialogClick("list")}
        aria-labelledby="nprd-dialog-title"
        aria-describedby="nprd-dialog-description">
        <DialogTitle id="nprd-dialog-title">
          {"New Product Has Been Registered"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="nprd-dialog-description">
            Product has been successfully registered, go to product view to edit
            or modify product
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClick("list")}>Close</Button>

          <Button onClick={() => handleDialogClick("product")} autoFocus>
            View Product
          </Button>
        </DialogActions>
      </Dialog>

      <div className="pb-8">
        <div className="">
          <div className="text-2xl font-semibold">Create New Products</div>
          <div className="text-sm mt-4">Dashboard . Products . New</div>
        </div>
        <div className="grid w-full grid-cols-9 pl-6 pr-7 pt-4">
          <div className="col-span-3">
            <div className="">
              <p>Details</p>
              <p>Title, short description, image...</p>
            </div>
          </div>
          <div className="col-span-6 border rounded-xl p-5 pt-0">
            <FormControl sx={{ width: "100%", paddingTop: "1.25rem" }}>
              <TextField
                id="nprd-name-field"
                label="Product Name"
                fullWidth
                error={requiredErrors.indexOf("name") != -1}
                helperText={
                  requiredErrors.indexOf("name") != -1
                    ? "Product Name Cannot be Empty."
                    : null
                }
                value={nameField}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </FormControl>
            <FormControl sx={{ width: "100%", paddingTop: "1.25rem" }}>
              <TextField
                id="nprd-desc-field"
                label="Product Description"
                fullWidth
                value={descField}
                multiline
                rows={4}
                onChange={(e) => handleFieldChange("desc", e.target.value)}
              />
            </FormControl>
            <div className="w-full pt-5">
              <p>Content</p>
              <div className="pt-2">
                <RichTextEditor
                  ref={rteRef}
                  extensions={[StarterKit]} // Or any Tiptap extensions you wish!
                  // Optionally include `renderControls` for a menu-bar atop the editor:
                  renderControls={() => (
                    <MenuControlsContainer>
                      <MenuSelectHeading />
                      <MenuDivider />
                      <MenuButtonBold />
                      <MenuButtonItalic />
                      {/* Add more controls of your choosing here */}
                    </MenuControlsContainer>
                  )}
                />
              </div>
            </div>
            <div className="w-full pt-5">
              <p>Images</p>
              <div className="pt-2 w-full border">
                <div
                  className={`flex flex-1 flex-col items-center p-6 border border-1 ${
                    isFocused
                      ? "border-blue-400"
                      : isDragAccept
                      ? "border-green-400"
                      : isDragReject
                      ? "border-red-400"
                      : "border-slate-400"
                  } border-dashed bg-slate-200`}
                  {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag drop some files here, or click to select files</p>
                </div>
                <div className="grid grid-cols-6 pt-4 mt-4">{thumbs}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-9 pl-6 pr-7 pt-4">
          <div className="col-span-3">
            <div className="">
              <p>Properties</p>
              <p>Product attribute details...</p>
            </div>
          </div>
          <div className="border rounded-xl grid grid-cols-6 col-span-6 gap-5 p-5 pt-0">
            <div className="pt-5 col-span-3">
              <FormControl
                sx={{ width: "100%" }}
                error={requiredErrors.indexOf("brand") != -1}>
                <InputLabel id="nprd-brand-label">Brand</InputLabel>
                <Select
                  labelId="nprd-brand-label"
                  id="nprd-brand-field"
                  onChange={(e) => handleFieldChange("brand", e.target.value)}
                  sx={{ maxHeight: "100%" }}
                  value={brandField ?? ""}
                  input={<OutlinedInput label="Brand" />}>
                  {pageData.brand.map((x) => (
                    <MenuItem key={`brandsel${x.id}`} value={x.id}>
                      {x.name.charAt(0).toUpperCase() + x.name.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {requiredErrors.indexOf("brand") != -1 ? (
                  <FormHelperText>
                    {`Please Select Brand or Unbranded (if no brand attached).`}
                  </FormHelperText>
                ) : (
                  <></>
                )}
              </FormControl>
            </div>
            <div className="pt-5 col-span-3">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  id="nprd-model-field"
                  label="Model Number"
                  fullWidth
                  value={modelField}
                  onChange={(e) => handleFieldChange("model", e.target.value)}
                />
              </FormControl>
            </div>
            <div className="pt-5 col-span-3">
              <FormControl
                sx={{ width: "100%" }}
                error={requiredErrors.indexOf("category") != -1}>
                <InputLabel id="nprd-category-label">Category</InputLabel>
                <Select
                  labelId="nprd-category-label"
                  id="nprd-category-field"
                  onChange={(e) =>
                    handleFieldChange("category", e.target.value)
                  }
                  sx={{ maxHeight: "100%" }}
                  value={categoryField ?? ""}
                  input={<OutlinedInput label="Category" />}>
                  {pageData.category?.map((x) => (
                    <MenuItem key={`categorysel${x.id}`} value={x.id}>
                      {x.name.charAt(0).toUpperCase() + x.name.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                {requiredErrors.indexOf("category") != -1 ? (
                  <FormHelperText>
                    {`Please Select Suitable Category or 'Supporting Product' (if no suitable category present).`}
                  </FormHelperText>
                ) : (
                  <></>
                )}
              </FormControl>
            </div>
            <div className="pt-5 col-span-3">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  id="nprd-weight-field"
                  label="Weight (gr)"
                  type="number"
                  fullWidth
                  value={weightField}
                  onChange={(e) => handleFieldChange("weight", e.target.value)}
                />
              </FormControl>
            </div>
            <div className="pt-5 col-span-2">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  id="nprd-long-field"
                  label="Long (cm)"
                  type="number"
                  fullWidth
                  value={longField}
                  onChange={(e) => handleFieldChange("long", e.target.value)}
                />
              </FormControl>
            </div>
            <div className="pt-5 col-span-2">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  id="nprd-width-field"
                  label="Width (cm)"
                  type="number"
                  fullWidth
                  value={widthField}
                  onChange={(e) => handleFieldChange("width", e.target.value)}
                />
              </FormControl>
            </div>
            <div className="pt-5 col-span-2">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  id="nprd-height-field"
                  label="Height (cm)"
                  type="number"
                  fullWidth
                  value={heightField}
                  onChange={(e) => handleFieldChange("height", e.target.value)}
                />
              </FormControl>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-9 pl-6 pr-7 pt-4">
          <div className="col-span-3">
            <div className="">
              <p>Pricing</p>
              <p>Price Settings</p>
            </div>
          </div>
          <div className="border rounded-xl grid grid-cols-6 col-span-6 gap-5 p-5 pt-0">
            <div className="pt-5 col-span-6">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  id="nprd-regprice-field"
                  label="Regular Price"
                  fullWidth
                  required
                  error={requiredErrors.indexOf("regprice") != -1}
                  helperText={
                    requiredErrors.indexOf("regprice") != -1
                      ? "Regular Price Cannot be Empty or Zero."
                      : null
                  }
                  value={regpriceField}
                  onChange={(e) =>
                    handleFieldChange("regprice", e.target.value)
                  }
                />
              </FormControl>
            </div>
            <div className="pt-5 col-span-6">
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  id="nprd-govprice-field"
                  label="Government Price"
                  fullWidth
                  value={govpriceField}
                  onChange={(e) =>
                    handleFieldChange("govprice", e.target.value)
                  }
                />
              </FormControl>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-9 pl-6 pr-7 pt-4">
          <div className="col-span-8"></div>
          <div className="col-span-1">
            <Button fullWidth onClick={(e) => handleSubmit(e)}>
              Save Product
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
