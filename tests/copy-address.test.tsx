import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CopyAddress } from "@/components/copy-address";
import { outlet } from "@/data/outlet";
import { renderWithMotion } from "./render";

/**
 * `userEvent.setup()` installs its own clipboard stub, so the spy has to be
 * attached afterwards or it gets replaced.
 */
describe("copy address", () => {
  it("copies the display address and confirms it in a live region", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);

    renderWithMotion(<CopyAddress address={outlet.address.display} />);

    await user.click(screen.getByRole("button", { name: "Copy address" }));

    expect(writeText).toHaveBeenCalledWith(outlet.address.display);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Address copied" })).toBeInTheDocument(),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Address copied");
  });

  it("reports failure instead of claiming success", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));

    renderWithMotion(<CopyAddress address={outlet.address.display} />);

    await user.click(screen.getByRole("button", { name: "Copy address" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Copy failed/ })).toBeInTheDocument(),
    );
    expect(screen.queryByRole("button", { name: "Address copied" })).not.toBeInTheDocument();
  });

  it("keeps focus on the button", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);

    renderWithMotion(<CopyAddress address={outlet.address.display} />);

    const button = screen.getByRole("button", { name: "Copy address" });
    await user.click(button);

    await waitFor(() => expect(button).toHaveFocus());
  });
});
