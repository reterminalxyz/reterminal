import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

const Home = lazy(() => import("@/pages/Home"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/activation">
        <Suspense fallback={<div style={{ background: "#FFFFFF", minHeight: "100vh" }} />}>
          <Home />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
