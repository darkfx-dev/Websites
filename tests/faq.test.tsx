import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Faq } from "@/components/faq";
import { faqEntries } from "@/data/faq";
import { renderWithMotion } from "./render";

describe("FAQ accordion", () => {
  it("renders one real button per question, all collapsed", () => {
    renderWithMotion(<Faq />);

    for (const entry of faqEntries) {
      const button = screen.getByRole("button", { name: entry.question });
      expect(button).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("keeps collapsed answers out of the accessibility tree", () => {
    renderWithMotion(<Faq />);
    expect(screen.queryByText(faqEntries[0].answer)).not.toBeInTheDocument();
  });

  it("expands and collapses on activation", async () => {
    const user = userEvent.setup();
    renderWithMotion(<Faq />);

    const button = screen.getByRole("button", { name: faqEntries[0].question });

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText(faqEntries[0].answer)).toBeInTheDocument();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    await waitFor(() =>
      expect(screen.queryByText(faqEntries[0].answer)).not.toBeInTheDocument(),
    );
  });

  it("allows several answers open at once", async () => {
    const user = userEvent.setup();
    renderWithMotion(<Faq />);

    await user.click(screen.getByRole("button", { name: faqEntries[0].question }));
    await user.click(screen.getByRole("button", { name: faqEntries[1].question }));

    expect(await screen.findByText(faqEntries[0].answer)).toBeInTheDocument();
    expect(await screen.findByText(faqEntries[1].answer)).toBeInTheDocument();
  });

  it("is operable by keyboard", async () => {
    const user = userEvent.setup();
    renderWithMotion(<Faq />);

    const button = screen.getByRole("button", { name: faqEntries[0].question });
    button.focus();
    await user.keyboard("{Enter}");

    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("names its panel with the question that controls it", async () => {
    const user = userEvent.setup();
    renderWithMotion(<Faq />);

    const button = screen.getByRole("button", { name: faqEntries[0].question });
    await user.click(button);

    const panel = await screen.findByRole("region", { name: faqEntries[0].question });
    expect(button).toHaveAttribute("aria-controls", panel.id);
  });
});
