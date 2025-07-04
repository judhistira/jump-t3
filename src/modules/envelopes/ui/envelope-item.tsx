"use client";

import type { Envelope } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

interface Props {
  envelope: Envelope;
}

export const EnvelopeItem = ({ envelope }: Props) => {
  const utils = api.useUtils();
  const addToEnvelope = api.envelope.addToEnvelope.useMutation({
    onSuccess: () => {
      toast.success("Added to envelope from income");
      void utils.envelope.getEnvelopes.invalidate();
      void utils.envelope.getIncome.invalidate();
    },
    onError: () => {
      toast.error("Amount exceeded income");
    },
  });

  const spendEnvelope = api.envelope.spendEnvelope.useMutation({
    onSuccess: () => {
      toast.success("Envelope spended");
      void utils.envelope.getEnvelopes.invalidate();
      void utils.envelope.getIncome.invalidate();
    },
  });

  const removeEnvelope = api.envelope.remove.useMutation({
    onSuccess: () => {
      toast.success("Envelope removed");
      void utils.envelope.getEnvelopes.invalidate();
      void utils.envelope.getIncome.invalidate();
    },
  });

  const [amount, setAmount] = useState(0);

  return (
    <div className="w-full rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Envelope #{envelope.id}</h2>
          <div className="mb-4 text-sm text-neutral-700">
            Amount: ${envelope.amount}
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-2">
          <input
            className="block w-24 rounded-lg border px-[1em] py-[0.5em] text-sm"
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(parseFloat(e.target.value));
            }}
          />
          <button
            type="button"
            className="cursor-pointer rounded-lg border bg-black px-[1em] py-[0.5em] text-sm font-semibold text-white"
            onClick={() => {
              addToEnvelope.mutate({
                id: envelope.id,
                amount: amount,
              });
            }}
          >
            Add
          </button>

          <button
            type="button"
            className="cursor-pointer rounded-lg border bg-black px-[1em] py-[0.5em] text-sm font-semibold text-white"
            onClick={() => {
              spendEnvelope.mutate({
                id: envelope.id,
                amount: amount,
              });
            }}
          >
            Spend
          </button>

          <button
            type="button"
            className="ml-4 cursor-pointer rounded-lg border bg-red-500 px-[1em] py-[0.5em] text-sm font-semibold text-white"
            onClick={() => {
              removeEnvelope.mutate({
                id: envelope.id,
              });
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
