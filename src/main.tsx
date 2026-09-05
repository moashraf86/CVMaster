import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App";
import { AppLoader } from "./components/core/AppLoader";
import { ErrorBoundary } from "./components/core/ErrorBoundary";

const ReviewPage = lazy(() => {
  return new Promise((resolve) => setTimeout(resolve, 500)).then(
    () => import("./pages/ReviewPage")
  );
});

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/review"
          element={
            <Suspense fallback={<AppLoader message="Loading Review..." />}>
              <ReviewPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);
