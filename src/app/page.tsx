import { JumpView } from "~/modules/jump/ui/jump-view";
import { HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

const JumpPage = () => {
  return (
    <HydrateClient>
      <JumpView />
    </HydrateClient>
  );
};

export default JumpPage;
