import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MenuExplorer } from "@/components/menu-explorer";
import { menuItems } from "@/data/menu";
import { renderWithMotion } from "./render";

describe("menu explorer", () => {
  it("renders every board item by default", () => {
    renderWithMotion(<MenuExplorer />);

    for (const item of menuItems) {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    }
  });

  it("shows no price anywhere in the rendered output", () => {
    const { container } = renderWithMotion(<MenuExplorer />);

    expect(container.textContent).not.toMatch(/₹/);
    // No bare 2–4 digit run that could read as a price.
    expect(container.textContent).not.toMatch(/\b\d{3,4}\b/);
    expect(screen.getAllByText("Price on request").length).toBe(menuItems.length);
  });

  it("announces the result count in a live region", () => {
    renderWithMotion(<MenuExplorer />);

    expect(screen.getByRole("status")).toHaveTextContent("Showing 29 of 29 items.");
  });

  it("filters by category and updates the announcement", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    await user.click(screen.getByRole("button", { name: "Locho" }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Showing 4 of 29 items in Locho."),
    );
    // The previous list stays mounted while it crossfades out (101).
    await waitFor(() => expect(screen.queryByText("Sev Khamani")).not.toBeInTheDocument());
    expect(screen.getByText("Plain Locho")).toBeInTheDocument();
  });

  it("marks the active category with aria-pressed rather than colour alone", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    const all = screen.getByRole("button", { name: "All items" });
    const locho = screen.getByRole("button", { name: "Locho" });

    expect(all).toHaveAttribute("aria-pressed", "true");
    await user.click(locho);
    expect(locho).toHaveAttribute("aria-pressed", "true");
    expect(all).toHaveAttribute("aria-pressed", "false");
  });

  it("searches by name", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    await user.type(screen.getByLabelText("Search the menu"), "jalebi");

    await waitFor(() => expect(screen.getByText("Ghee Jalebi")).toBeInTheDocument());
    expect(screen.queryByText("Plain Locho")).not.toBeInTheDocument();
  });

  it("shows a static empty state with a way out", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    await user.type(screen.getByLabelText("Search the menu"), "pizza");

    expect(await screen.findByText("No items match that search.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    await waitFor(() => expect(screen.getByText("Plain Locho")).toBeInTheDocument());
  });

  it("gives each category one WhatsApp inquiry action carrying the approved number", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    await user.click(screen.getByRole("button", { name: "Locho" }));

    await waitFor(() =>
      expect(screen.getAllByRole("link", { name: /Ask current price on WhatsApp/ })).toHaveLength(1),
    );

    const [link] = screen.getAllByRole("link", { name: /Ask current price on WhatsApp/ });
    expect(link).toHaveAttribute(
      "href",
      expect.stringContaining("https://wa.me/919924666000?text="),
    );
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain("Locho");
  });

  it("keeps every item inside a list under its category heading", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    await user.click(screen.getByRole("button", { name: "Pattice" }));

    const heading = await screen.findByRole("heading", { name: "Pattice", level: 3 });
    const list = heading.closest("div")?.parentElement?.querySelector("ul");
    expect(list).not.toBeNull();
    expect(within(list as HTMLElement).getAllByRole("listitem")).toHaveLength(2);
  });
});
