"use client";

import { useState, useTransition } from "react";

import { useToast } from "@/components/shared/ToastProvider";
import { deliverableMessages } from "@/lib/deliverables/messages";
import { getMaxDeliverableFileSize } from "@/lib/deliverables/validation";
import { cn } from "@/lib/utils";
import type {
  Deliverable,
  DeliverableActionResult,
  DeliverableType
} from "@/types";

interface DeliverableFormProps {
  appId: string;
  itemId: string;
  onCreated?: (deliverable: Deliverable) => void;
}

type FormState = {
  type: DeliverableType;
  content: string;
  file: File | null;
};

const initialState: FormState = {
  type: "link",
  content: "",
  file: null
};

const deliverableTypes: Array<{
  type: DeliverableType;
  label: string;
  description: string;
}> = [
  {
    type: "link",
    label: "Link",
    description: "Store listing, doc veya canli kaynak bagla"
  },
  {
    type: "note",
    label: "Note",
    description: "Kisa karar, aciklama veya teslim notu ekle"
  },
  {
    type: "file",
    label: "File",
    description: "Gorsel, dokuman veya varlik yukle"
  }
];

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function DeliverableForm({
  appId,
  itemId,
  onCreated
}: DeliverableFormProps) {
  const { pushToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(initialState);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<
    DeliverableActionResult["fieldErrors"]
  >({});
  const [contentTouched, setContentTouched] = useState(false);
  const maxFileSize = getMaxDeliverableFileSize();

  const linkValidationMessage =
    form.type === "link" &&
    form.content.trim().length > 0 &&
    !form.content.trim().startsWith("https://")
      ? "https:// ile başlamalı"
      : null;
  const fileValidationMessage =
    form.type === "file" && form.file && form.file.size > maxFileSize
      ? "Maksimum dosya boyutu aşıldı"
      : null;

  function setType(type: DeliverableType) {
    setForm((current) => ({
      ...current,
      type,
      file: type === "file" ? current.file : null
    }));
    if (type !== "file") {
      setFileInputKey((current) => current + 1);
    }
    setStatusMessage(null);
    setFieldErrors({});
    setContentTouched(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});
    setContentTouched(true);

    if (linkValidationMessage) {
      setFieldErrors({
        content: linkValidationMessage
      });
      return;
    }

    if (fileValidationMessage) {
      setFieldErrors({
        file: fileValidationMessage
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let response: Response;

      if (form.type === "file") {
        const body = new FormData();
        body.set("type", "file");

        if (form.file) {
          body.set("file", form.file);
        }

        response = await fetch(
          `/api/apps/${appId}/checklist/${itemId}/deliverables`,
          {
            method: "POST",
            body
          }
        );
      } else {
        response = await fetch(
          `/api/apps/${appId}/checklist/${itemId}/deliverables`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              type: form.type,
              content: form.content
            })
          }
        );
      }

      const result = (await response.json()) as DeliverableActionResult;

      if (!response.ok || !result.ok) {
        const message = result.message ?? deliverableMessages.genericError;
        setStatusMessage(message);
        setFieldErrors(result.fieldErrors ?? {});
        pushToast({
          title: "Deliverable eklenemedi",
          description: message,
          variant: "destructive"
        });
        return;
      }

      setForm(initialState);
      setFileInputKey((current) => current + 1);
      setContentTouched(false);
      pushToast({
        title: "Deliverable eklendi",
        description: "Checklist item'i icin yeni bir cikti kaydedildi.",
        variant: "success"
      });
      const createdDeliverable = result.deliverable;

      if (createdDeliverable) {
        startTransition(() => {
          onCreated?.(createdDeliverable);
        });
      }
    } catch {
      setStatusMessage(deliverableMessages.genericError);
      pushToast({
        title: "Deliverable eklenemedi",
        description: deliverableMessages.genericError,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const submitLabel =
    form.type === "link"
      ? "Link'i kaydet"
      : form.type === "note"
        ? "Notu kaydet"
        : "Dosyayi yukle";

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-2 lg:grid-cols-3">
        {deliverableTypes.map((option) => (
          <button
            key={option.type}
            type="button"
            onClick={() => setType(option.type)}
            className={cn(
              "rounded-[1.35rem] border px-4 py-4 text-left transition",
              form.type === option.type
                ? "border-primary/20 bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(30,64,175,0.18)]"
                : "border-foreground/10 bg-secondary/35 text-foreground hover:bg-secondary/55"
            )}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em]">
              {option.label}
            </p>
            <p
              className={cn(
                "mt-2 text-sm leading-6",
                form.type === option.type
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              )}
            >
              {option.description}
            </p>
          </button>
        ))}
      </div>

      {form.type === "file" ? (
        <label className="block space-y-3">
          <span className="text-sm font-semibold text-foreground">
            Dosya yukle
          </span>
          <div className="rounded-[1.5rem] border border-dashed border-foreground/15 bg-secondary/22 p-4">
            <input
              key={fileInputKey}
              type="file"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setForm((current) => ({
                  ...current,
                  file: nextFile
                }));
                setFieldErrors((current) => ({
                  ...current,
                  file:
                    nextFile && nextFile.size > maxFileSize
                      ? "Maksimum dosya boyutu aşıldı"
                      : undefined
                }));
              }}
              className="block w-full rounded-[1rem] border border-foreground/10 bg-white px-4 py-3 text-sm"
            />
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Maksimum dosya boyutu 10 MB. Gorsel, dokuman veya cikti varligi yukleyebilirsin.
            </p>
            {form.file ? (
              <div className="mt-4 rounded-[1.2rem] border border-foreground/10 bg-white px-4 py-3 text-sm">
                <p className="font-semibold text-foreground">
                  {form.file.name}
                </p>
                <p className="mt-1 text-muted-foreground">
                  {formatFileSize(form.file.size)}
                </p>
              </div>
            ) : null}
          </div>
          {fileValidationMessage || fieldErrors?.file ? (
            <p className="text-sm text-destructive">
              {fileValidationMessage ?? fieldErrors?.file}
            </p>
          ) : null}
        </label>
      ) : (
        <label className="block space-y-3">
          <span className="text-sm font-semibold text-foreground">
            {form.type === "link" ? "Link" : "Not"}
          </span>
          {form.type === "link" ? (
            <input
              type="url"
              value={form.content}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  content: event.target.value
                }))
              }
              onBlur={() => setContentTouched(true)}
              placeholder="https://example.com"
              className="w-full rounded-[1.4rem] border border-foreground/10 bg-white px-4 py-3.5 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          ) : (
            <textarea
              value={form.content}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  content: event.target.value
                }))
              }
              onBlur={() => setContentTouched(true)}
              placeholder="Bu item icin onemli notlarini buraya ekle"
              rows={5}
              className="w-full rounded-[1.4rem] border border-foreground/10 bg-white px-4 py-3.5 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          )}
          <p className="text-xs leading-6 text-muted-foreground">
            {form.type === "link"
              ? "Dis kaynaga acilan, paylasilabilir ve gecerli bir URL kaydet."
              : "Bu deliverable'a bagli karar, not veya teslim baglamini ekle."}
          </p>
          {((contentTouched && linkValidationMessage) || fieldErrors?.content) ? (
            <p className="text-sm text-destructive">
              {(contentTouched && linkValidationMessage) ?? fieldErrors?.content}
            </p>
          ) : null}
        </label>
      )}

      {statusMessage ? (
        <div className="rounded-[1.4rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {statusMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          isPending ||
          Boolean(linkValidationMessage) ||
          Boolean(fileValidationMessage)
        }
        className="w-full rounded-[1.4rem] bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting || isPending ? "Kaydediliyor..." : submitLabel}
      </button>
    </form>
  );
}
