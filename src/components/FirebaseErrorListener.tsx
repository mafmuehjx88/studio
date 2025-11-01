
"use client";

import { useEffect, useState } from "react";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

/**
 * A client-side component that listens for Firestore permission errors
 * and throws them to be caught by the Next.js error overlay.
 * This is intended for use in development only.
 */
export function FirebaseErrorListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (e: FirestorePermissionError) => {
      setError(e);
    };

    errorEmitter.on("permission-error", handleError);

    return () => {
      errorEmitter.off("permission-error", handleError);
    };
  }, []);

  if (error) {
    throw error;
  }

  return <>{children}</>;
}
