"use client";
import { Provider as JotaiProvider } from "jotai";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </JotaiProvider>
  );
}
