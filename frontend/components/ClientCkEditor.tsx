"use client";

import dynamic from "next/dynamic";

const ClientSideCustomEditor = dynamic(() => import("./CkEditor"), {
  ssr: false,
});

export default ClientSideCustomEditor;
