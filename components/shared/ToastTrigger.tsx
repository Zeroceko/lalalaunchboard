"use client";

import { useEffect, useRef } from "react";

import { useToast } from "@/components/shared/ToastProvider";

export function ToastTrigger({
  title,
  description,
  variant = "info",
  toastKey
}: {
  title: string;
  description?: string;
  variant?: "info" | "success" | "destructive";
  toastKey: string;
}) {
  const { pushToast } = useToast();
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastKeyRef.current === toastKey) {
      return;
    }

    lastKeyRef.current = toastKey;
    pushToast({
      title,
      description,
      variant
    });
  }, [description, pushToast, title, toastKey, variant]);

  return null;
}
