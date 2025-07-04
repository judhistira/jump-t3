"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const JumpViewBoundary = () => {
  return "Jump";
};

export const JumpView = () => {
  return (
    <Suspense fallback="Loading...">
      <ErrorBoundary fallback="Something went wrong">
        <JumpViewBoundary />
      </ErrorBoundary>
    </Suspense>
  );
};
