import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MenuExplorer } from "@/components/menu-explorer";
import { PRICE_DISCLAIMER, menuItems } from "@/data/menu";
import { renderWithMotion } from "./render";

describe("menu explorer", () => {
  it("renders every board item by default", () => {
    renderWithMotion(<MenuExplorer />);
    for (const item of menuItems) {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    }
  });

  it("shows the transcribed prices with their unit labels", () => {
    renderWithMotion(<MenuExplorer />);

    const row = screen.getByText("Amul Cheese Butter Locho").closest("li")!;
    expect(within(row).getByText("₹500")).toBeInTheDocument();
    expect(within(row).getByText("per kg")).toBeInTheDocument();
    expect(within(row).getByText("₹80")).toBeInTheDocument();
    expect(within(row).getByText("per plate")).toBeInTheDocument();
  });

  it("never invents a unit the board does not list", () => {
    renderWithMotion(<MenuExplorer />);

    const row = screen.getByText("Plain Locho").closest("li")!;
    expect(within(row).getByText("₹120")).toBeInTheDocument();
    expect(within(row).getByText("per kg")).toBeInTheDocument();
    expect(within(row).queryByText("per plate")).not.toBeInTheDocument();
  });

  it("keeps the price disclaimer adjacent to the prices", () => {
    const { container } = renderWithMotion(<MenuExplorer />);
    expect(container.textContent).toContain(PRICE_DISCLAIMER);
  });

  it("publishes no ordering action, because no destination is verified", () => {
    renderWithMotion(<MenuExplorer />);
    expect(screen.queryByRole("link", { name: /order/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /order|add to/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /whatsapp/i })).not.toBeInTheDocument();
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

  it("groups Beverages separately from Sweets & Extras", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    await user.click(screen.getByRole("button", { name: "Beverages" }));

    const heading = await screen.findByRole("heading", { name: "Beverages", level: 3 });
    expect(heading).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Ghee Jalebi")).not.toBeInTheDocument());
    expect(screen.getByText("Bottled Water")).toBeInTheDocument();
  });
});
