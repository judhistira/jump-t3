import { EnvelopeView } from "~/modules/envelopes/ui/envelope-view";
import { HydrateClient, api } from "~/trpc/server";

export const dynamic = "force-dynamic";

const EnvelopePage = () => {
  void api.envelope.getEnvelopes.prefetch();
  void api.envelope.getIncome.prefetch();

  return (
    <HydrateClient>
      <EnvelopeView />
    </HydrateClient>
  );
};

export default EnvelopePage;
