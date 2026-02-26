import { lazy, Suspense, useState, useEffect, useCallback } from "react";
import { Switch, Route, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import { LoadingScreen, onLoadingDone, resetLoadingScreen } from "@/components/LoadingScreen";

const Home = lazy(() => import("@/pages/Home"));

function ActivationOverlay() {
  const [match] = useRoute("/activation");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (match) {
      resetLoadingScreen();
      setVisible(true);
    }
  }, [match]);

  useEffect(() => {
    if (!visible) return;
    const unsub = onLoadingDone(() => setVisible(false));
    return unsub;
  }, [visible]);

  if (!visible) return null;
  return <LoadingScreen />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/activation">
        <Suspense fallback={null}>
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
        <ActivationOverlay />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
