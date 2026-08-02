import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MobileNav } from "@/components/mobile-nav";
import { renderWithMotion } from "./render";

describe("mobile navigation sheet", () => {
  it("reports its state on the trigger", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MobileNav />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("exposes a modal dialog with the navigation and both contact actions", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MobileNav />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");

    for (const label of ["Menu", "About", "Location", "FAQ"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /Ask on WhatsApp/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Call the Outlet/ })).toBeInTheDocument();
  });

  it("moves focus into the sheet on open", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MobileNav />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement);
    });
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MobileNav />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("closes when a navigation link is chosen", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MobileNav />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("link", { name: "Menu" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("locks body scroll only while open", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MobileNav />);

    expect(document.body.style.overflow).toBe("");

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });
});
