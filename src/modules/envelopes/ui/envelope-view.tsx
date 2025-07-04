"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import { EnvelopeItem } from "~/modules/envelopes/ui/envelope-item";
import { api } from "~/trpc/react";

const EnvelopeViewBoundary = () => {
  const utils = api.useUtils();

  const [envelopes] = api.envelope.getEnvelopes.useSuspenseQuery();
  const [income] = api.envelope.getIncome.useSuspenseQuery();

  const addIncome = api.envelope.addIncome.useMutation({
    onSuccess: () => {
      void utils.envelope.getIncome.invalidate();
      toast.success("Added income");
    },
  });

  const createEnvelope = api.envelope.createEnvelope.useMutation({
    onSuccess: () => {
      void utils.envelope.getEnvelopes.invalidate();
      void utils.envelope.getIncome.invalidate();

      toast.success("Created envelopes");
    },
    onError: () => {
      toast.error("Envelope amount exceed income");
    },
  });

  const [amount, setAmount] = useState(0);
  const [envelopeAmount, setEnvelopeAmount] = useState(0);

  const handleAddIncome = () => {
    addIncome.mutate({ amount: amount });
  };

  const handleCreateEnvelope = () => {
    createEnvelope.mutate({ amount: envelopeAmount });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto w-full max-w-[640px] rounded-xl border p-4 md:p-6">
        <h1 className="mb-4 text-2xl font-bold">Envelopes App</h1>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm">My income: ${income.amount}</p>

          <div className="flex items-center gap-x-2">
            <input
              className="block w-24 rounded-lg border px-[1em] py-[0.5em] text-sm"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(parseFloat(e.target.value));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddIncome();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddIncome}
              className="cursor-pointer rounded-lg border bg-black px-[1em] py-[0.5em] text-sm font-semibold text-white"
            >
              Add Income
            </button>
          </div>
        </div>

        <div className="my-4 space-y-4">
          {envelopes.map((env) => (
            <EnvelopeItem key={env.id} envelope={env} />
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm">Create New Envelope</p>

          <div className="flex items-center gap-x-2">
            <input
              className="block w-24 rounded-lg border px-[1em] py-[0.5em] text-sm"
              type="number"
              value={envelopeAmount}
              onChange={(e) => {
                setEnvelopeAmount(parseFloat(e.target.value));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateEnvelope();
                }
              }}
            />
            <button
              type="button"
              onClick={handleCreateEnvelope}
              className="cursor-pointer rounded-lg border bg-black px-[1em] py-[0.5em] text-sm font-semibold text-white"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EnvelopeView = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <ErrorBoundary fallback={"Something went wrong"}>
        <EnvelopeViewBoundary />
      </ErrorBoundary>
    </Suspense>
  );
};
