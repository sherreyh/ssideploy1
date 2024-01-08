"use client";
import {
  Button,
  IconButton,
  Popover,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Icon,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import useSWR, { mutate } from "swr";
import { decrypt, storagepath } from "../../../../services/encrypturl";
import api from "../../../../services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const DetailsMenu = ["Details", "Statistics"];

const DetailsContent = ({ selected, details }) => {
  const parser = new DOMParser();
  if (selected == "Details") {
    return (
      <div className="w-full min-h-20" key={"sekdet"}>
        <div className="w-full border rounded-2xl">
          {details ? (
            <div dangerouslySetInnerHTML={{ __html: details }}></div>
          ) : (
            <p>No Data</p>
          )}
        </div>
      </div>
    );
  }
  return <></>;
};

const bottomLineVariants = {
  shrink: { width: 0 },
  expand: { width: "fit-content" },
};
const bottomLineSpcVariants = {
  shrink: { width: 0 },
  expand: { width: 16 },
};

export default function ViewProductPage({ params }) {
  const [closePopover, setClosePopover] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState("Details");
  const [images, setImages] = useState([]);
  const [imgSelected, setImgSelected] = useState(null);
  const [carWidth, setCarWidth] = useState(0);
  const router = useRouter();
  const carousel = useRef();
  const id = router.query;

  useEffect(() => {
    setCarWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
  }, []);
  const {
    data: data,
    mutate,
    isLoading,
  } = useSWR(`/products/${decrypt(params?.id)}`, api.get);
  var pageData = data?.data;
  useEffect(() => {
    if (pageData) {
      setImages(pageData?.images?.split(","));
    }
  }, [pageData]);

  const handlePopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
    setClosePopover(false);
  };

  const handlePopoverClose = () => {
    setClosePopover(true);
    setAnchorEl(null);
  };

  const handlePopoverListClick = async (tgt) => {
    handlePopoverClose();
    let res;
    if (tgt == "publish") {
      if (pageData.status == "active") {
        return;
      }
      res = await api.patch(`/products/${decrypt(params.id)}`, {
        status: "active",
      });
    }
    if (tgt == "draft") {
      if (pageData.status == "draft") {
        return;
      }
      res = await api.patch(`/products/${decrypt(params.id)}`, {
        status: "draft",
      });
    }
    if (res.status == 200) mutate();
  };
  const handleSelectDetails = (val) => {
    setSelectedDetails(val);
  };
  const handleSetImgDefault = async (img) => {
    let res = await api
      .patch(`/products/${decrypt(params.id)}`, JSON.stringify({ defimg: img }))
      .then((r) => r);
    if (res.status == 200) {
      mutate();
    } else {
    }
  };
  return (
    <div>
      <div className="grid  grid-cols-9 pl-6 pr-7 pt-4 pb-6">
        <div className="col-span-1">
          <Link href={"/products/lists"}>
            <Button variant="outlined" startIcon={<ChevronLeftIcon />}>
              Back
            </Button>
          </Link>
        </div>
        <div className="col-span-6"></div>
        <div className="col-span-2 flex justify-end gap-6">
          <div className="">
            <Link href={`/products/edit/${params.id}`}>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Link>
          </div>
          <div className="">
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ExpandMoreIcon />}
              onClick={(e) => handlePopoverClick(e)}>
              {pageData?.status == "active" ? "Published" : "Draft"}
            </Button>
            <Popover
              id={`ProductStatusPopover`}
              open={!closePopover}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "left",
              }}>
              <List>
                <ListItemButton
                  sx={{
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                  }}
                  onClick={() => handlePopoverListClick("publish")}>
                  <ListItemText primary="Publish" />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                  }}
                  onClick={() => handlePopoverListClick("draft")}>
                  <ListItemText primary="Draft" />
                </ListItemButton>
              </List>
            </Popover>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-5 gap-8 pr-10">
        <div className="col-span-2 h-full">
          <div className="w-full">
            <div className="w-full h-96 flex justify-center items-center">
              {pageData ? (
                <img
                  className="h-full w-full max-h-96 rounded-xl pointer-events-none object-contain"
                  src={
                    imgSelected
                      ? storagepath() + imgSelected
                      : storagepath() + pageData?.defimg
                  }
                  alt=""
                />
              ) : (
                <Skeleton height="40rem" sx={{ width: "100%" }}></Skeleton>
              )}
            </div>
            <div
              className="w-full h-24  cursor-grab overflow-hidden"
              ref={carousel}>
              <motion.div
                className="flex items-center gap-4"
                drag="x"
                dragConstraints={{ right: 0, left: -carWidth }}>
                {pageData ? (
                  images?.length > 0 ? (
                    images?.map((x, idx) => (
                      <motion.div
                        className="h-20 w-auto flex justify-end pt-4"
                        onClick={() => {
                          setImgSelected(x);
                        }}
                        key={`imageKey${idx}`}>
                        <img
                          className="h-full w-full rounded-xl pointer-events-none"
                          src={storagepath() + x}
                          alt=""
                        />
                        <div className="-ml-8 ">
                          <IconButton
                            size="small"
                            onClick={() => handleSetImgDefault(x)}>
                            <StarIcon
                              color={
                                pageData.defimg == x ? "primary" : "disabled"
                              }
                            />
                          </IconButton>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <></>
                  )
                ) : (
                  [1, 1, 1, 1].map((x, idx) => (
                    <Skeleton
                      height="7rem"
                      sx={{ width: "13rem" }}
                      key={`sklimg${idx}`}
                    />
                  ))
                )}
              </motion.div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          {pageData ? (
            <p
              className={`font-semibold text-sm ${
                pageData.stock == 0
                  ? "text-red-500"
                  : pageData.stock > 10
                  ? "text-green-500"
                  : "text-yellow-500"
              }`}>{`( ${pageData.stock} ) ${
              pageData.stock == 0
                ? "Out of Stock"
                : pageData.stock > 10
                ? "In Stock"
                : "Low of Stock"
            }`}</p>
          ) : (
            <Skeleton />
          )}
          {pageData ? (
            <p
              className={`font-semibold text-2xl pt-4 pb-4 `}>{` ${pageData.name} `}</p>
          ) : (
            <Skeleton />
          )}
          {pageData ? (
            <p className={`font-semibold text-md pb-4 `}>
              {pageData.brand}
              <span
                className={`font-semibold text-md text-slate-400 pt-4 pb-4 `}>
                {pageData.model}
              </span>
            </p>
          ) : (
            <Skeleton />
          )}
          {pageData ? (
            <p className={`text-2xl font-semibold pb-4`}>
              {"IDR   " + pageData.price.toLocaleString("de-DE")}
            </p>
          ) : (
            <Skeleton />
          )}
          {pageData ? (
            <p className={`pb-4`}>{pageData.description}</p>
          ) : (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
          {pageData ? (
            <div className="flex justify-between pb-2">
              <p
                className={`font-semibold text-slate-800`}>{`Dimensions (L x W x H)`}</p>
              <p className={`font-semibold text-slate-600`}>
                {pageData.width
                  ? `${pageData.width} x ${pageData.width} x ${pageData.height} (cm)`
                  : "No Data"}
              </p>
            </div>
          ) : (
            <Skeleton />
          )}
          {pageData ? (
            <div className="flex justify-between">
              <p className={`font-semibold text-slate-800`}>{`Weight (g)`}</p>
              <p className={`font-semibold text-slate-600`}>
                {pageData.weight ? `${pageData.weight}` : "No Data"}
              </p>
            </div>
          ) : (
            <Skeleton />
          )}
          {pageData ? (
            <div className="mt-10">
              <div className="flex">
                {DetailsMenu.map((x) => (
                  <p
                    onClick={() => handleSelectDetails(x)}
                    key={`detsel${x}`}
                    className="text-md font-medium cursor-pointer pr-4">
                    {x}
                  </p>
                ))}
              </div>
              <div className="flex h-10 ">
                {DetailsMenu.map((x, idx) => {
                  return (
                    <>
                      <motion.p
                        variants={bottomLineVariants}
                        key={`details${x + idx}`}
                        animate={
                          idx >= DetailsMenu.indexOf(selectedDetails)
                            ? "shrink"
                            : "expand"
                        }
                        className={`text-md font-medium h-full overflow-hidden text-transparent  ${
                          idx > DetailsMenu.indexOf(selectedDetails)
                            ? "w-0"
                            : ""
                        }`}>
                        {x}
                      </motion.p>
                      <motion.div
                        className=""
                        key={`detailsbot${idx}`}
                        variants={bottomLineSpcVariants}
                        animate={
                          idx >= DetailsMenu.indexOf(selectedDetails)
                            ? "shrink"
                            : "expand"
                        }></motion.div>
                    </>
                  );
                })}
                <p className="text-md font-medium text-transparent pointer-events-none border-t-2 border-black">
                  {selectedDetails}
                </p>
              </div>
              <div className="">
                <DetailsContent
                  selected={selectedDetails}
                  details={pageData?.content}
                />
              </div>
            </div>
          ) : (
            <>
              {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((x, idx) => (
                <Skeleton key={`sklet${idx}`} />
              ))}
            </>
          )}
          <p></p>
        </div>
      </div>
    </div>
  );
}
