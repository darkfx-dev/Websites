import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MenuExplorer } from "@/components/menu-explorer";
import { PRICE_DISCLAIMER, menuCategories, menuItems } from "@/data/menu";
import { renderWithMotion } from "./render";

/**
 * jsdom reports no match for the ring's `min-width: 1024px` query, so these
 * exercise the non-ring presentation — the same seven tab controls laid out
 * as a rail. That is deliberate: it is the presentation keyboard and
 * screen-reader users get, and the one that must stay correct.
 */
describe("menu explorer", () => {
  it("exposes one tab per category, with the first selected", () => {
    renderWithMotion(<MenuExplorer />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(menuCategories.length);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
  });

  /**
   * Every category is in the DOM so the board stays readable without
   * JavaScript; a `js`-gated CSS rule hides the unselected ones. jsdom loads
   * no stylesheet, so these assert the marker attribute that rule keys off.
   */
  const selectedGroup = (container: HTMLElement) =>
    container.querySelector("[data-menu-group-selected]") as HTMLElement;

  it("marks the selected category's group and only that one", () => {
    const { container } = renderWithMotion(<MenuExplorer />);

    const groups = container.querySelectorAll("[data-menu-group]");
    expect(groups).toHaveLength(menuCategories.length);
    expect(container.querySelectorAll("[data-menu-group-selected]")).toHaveLength(1);

    // Locho is selected by default.
    expect(within(selectedGroup(container)).getByText("Plain Locho")).toBeInTheDocument();
    expect(within(selectedGroup(container)).queryByText("Plain Khaman")).not.toBeInTheDocument();
  });

  it("keeps the whole board present for a visitor without JavaScript", () => {
    const { container } = renderWithMotion(<MenuExplorer />);
    for (const item of menuItems) {
      expect(within(container).getAllByText(item.name).length).toBeGreaterThan(0);
    }
  });

  it("renders board prices with their units", () => {
    const { container } = renderWithMotion(<MenuExplorer />);
    const group = selectedGroup(container);

    expect(within(group).getByText("₹120")).toBeInTheDocument();
    expect(within(group).getAllByText("per kg").length).toBeGreaterThan(0);
    // Oil Locho is the first item carrying both a kg and a plate figure.
    expect(within(group).getByText("₹30")).toBeInTheDocument();
    expect(within(group).getAllByText("per plate").length).toBeGreaterThan(0);
  });

  it("keeps the mandated price disclaimer on screen", () => {
    renderWithMotion(<MenuExplorer />);
    expect(screen.getByText(new RegExp(PRICE_DISCLAIMER.slice(0, 40)))).toBeInTheDocument();
  });

  it("switches category on click and moves the panel with it", async () => {
    const user = userEvent.setup();
    const { container } = renderWithMotion(<MenuExplorer />);
    await user.click(screen.getByRole("tab", { name: /Khaman & Khamani/ }));

    await waitFor(() =>
      expect(within(selectedGroup(container)).getByText("Plain Khaman")).toBeInTheDocument(),
    );
    expect(within(selectedGroup(container)).queryByText("Plain Locho")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Khaman & Khamani/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("moves selection with the arrow keys and wraps at the ends", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    const first = screen.getAllByRole("tab")[0];
    first.focus();

    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: /Khaman & Khamani/ })).toHaveAttribute(
        "aria-selected",
        "true",
      ),
    );

    await user.keyboard("{End}");
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: /Beverages/ })).toHaveAttribute(
        "aria-selected",
        "true",
      ),
    );

    // Wrapping past the last tab returns to the first.
    await user.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(screen.getByRole("tab", { name: /Locho/ })).toHaveAttribute("aria-selected", "true"),
    );
  });

  it("labels the panel with the tab that controls it", () => {
    renderWithMotion(<MenuExplorer />);

    const panel = screen.getByRole("tabpanel");
    const selected = screen.getAllByRole("tab").find((tab) => tab.getAttribute("aria-selected") === "true");
    expect(panel).toHaveAttribute("aria-labelledby", selected?.id);
  });

  it("announces the selection without reading the whole price list", () => {
    renderWithMotion(<MenuExplorer />);
    expect(screen.getByRole("status")).toHaveTextContent("Locho selected, 4 items");
  });

  it("searches across every category", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    await user.type(screen.getByLabelText("Search the menu"), "samosa");

    await waitFor(() => expect(screen.getByText("Raw Chana-dal Samosa")).toBeInTheDocument());
    // Search reaches beyond the selected category.
    expect(screen.getByText("Fried Cheese Paneer Samosa")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("items match samosa");
  });

  it("offers a static empty state with a way back", async () => {
    const user = userEvent.setup();
    renderWithMotion(<MenuExplorer />);

    await user.type(screen.getByLabelText("Search the menu"), "pizza");

    expect(await screen.findByText("No items match that search.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    await waitFor(() => expect(screen.getByText("Plain Locho")).toBeInTheDocument());
  });

  it("keeps Beverages separate from Sweets & Extras", async () => {
    const user = userEvent.setup();
    const { container } = renderWithMotion(<MenuExplorer />);

    await user.click(screen.getByRole("tab", { name: /Beverages/ }));
    await waitFor(() =>
      expect(within(selectedGroup(container)).getByText("Bottled Water")).toBeInTheDocument(),
    );
    expect(within(selectedGroup(container)).queryByText("Ghee Jalebi")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Sweets & Extras/ }));
    await waitFor(() =>
      expect(within(selectedGroup(container)).getByText("Ghee Jalebi")).toBeInTheDocument(),
    );
    expect(within(selectedGroup(container)).queryByText("Bottled Water")).not.toBeInTheDocument();
  });

  it("never offers an order or cart action", () => {
    const { container } = renderWithMotion(<MenuExplorer />);
    expect(container.textContent).not.toMatch(/add to cart|order now|buy|checkout/i);
  });

  it("accounts for every board item across the tabs", () => {
    const total = menuCategories.reduce(
      (sum, category) => sum + menuItems.filter((item) => item.category === category.label).length,
      0,
    );
    expect(total).toBe(menuItems.length);
  });
});
