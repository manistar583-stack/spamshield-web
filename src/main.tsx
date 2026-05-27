import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";
import { Layout } from "./components/layout";
import { Dashboard } from "./pages/Dashboard";
import { Checker } from "./pages/Checker";
import { Bomber } from "./pages/Bomber";
import { Community } from "./pages/Community";

import { Protection } from "./pages/Protection";
import { Admin } from "./pages/Admin";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="checker" element={<Checker />} />
            <Route path="bomber" element={<Bomber />} />
            <Route path="community" element={<Community />} />
            <Route path="protection" element={<Protection />} />
            <Route path="admin" element={<Admin />} />
            <Route path="*" element={<div className="text-zinc-500">Feature Coming Soon</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" />
    </QueryClientProvider>
  </StrictMode>
);
