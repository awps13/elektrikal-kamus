"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteQuizResult } from "../actions/guru";
import type { FormState } from "../lib/definitions";

export default function DeleteQuizResultButton({
  resultId,
  studentName,
}: {
  resultId: string;
  studentName: string;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(deleteQuizResult, undefined);

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Hapus data hasil ujian ${studentName}?`)) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-start gap-1"
    >
      <input type="hidden" name="resultId" value={resultId} />
      <button
        type="submit"
        disabled={pending}
        aria-label={`Hapus data hasil ujian ${studentName}`}
        title="Hapus data"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
      {state?.message && !state.ok ? (
        <span className="max-w-28 text-xs font-medium text-rose-600">{state.message}</span>
      ) : null}
    </form>
  );
}
