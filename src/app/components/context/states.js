"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const PageStateContext = createContext({});

export const PageStateProvider = ({ children }) => {
  const [hideLoading, setHideLoading] = useState(true);
  const [hideSide, setHideSide] = useState(true);
  const [scrolledPage, setScrolledPage] = useState(true);

  return (
    <PageStateContext.Provider
      value={{
        hideLoading,
        setHideLoading,
        hideSide,
        setHideSide,
        scrolledPage,
        setScrolledPage,
      }}>
      {children}
    </PageStateContext.Provider>
  );
};

export const usePageState = () => useContext(PageStateContext);
