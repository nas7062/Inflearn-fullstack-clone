"use client";

import { useApi } from "@/hooks/use-api";
import { useQuery } from "@tanstack/react-query";

export default function Client() {
  const api = useApi();
  const { data } = useQuery({
    queryKey: ["api-test"],
    queryFn: () => api.getUserTest(),
  });

  return <div>client API Result: {data}</div>;
}
