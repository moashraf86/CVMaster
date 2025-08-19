import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App";

const ReviewPage = lazy(() => import("./pages/ReviewPage"));

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/review"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <ReviewPage />
          </Suspense>
        }
      />
    </Routes>
  </BrowserRouter>
);
