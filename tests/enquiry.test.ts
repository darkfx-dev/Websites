import { describe, expect, it } from "vitest";
import {
  enquirySchema,
  requiresStream,
  buildEnquiryMessage,
  buildWhatsAppUrl,
  normaliseMobile,
  type EnquiryData,
} from "../src/lib/enquiry";
import { school } from "../src/data/school";

const base: EnquiryData = {
  parentName: "Asha Patel",
  mobile: "98765 43210",
  studentName: "Dev Patel",
  standard: "4",
  stream: "",
  currentStandard: "Standard 3",
  enquiryType: "Admission",
  preferredContact: "WhatsApp",
  message: "Is there a mid-year intake?",
  consent: true,
};

describe("conditional stream logic", () => {
  it("does not require a stream for Standard 1–10", () => {
    for (const std of ["1", "5", "9", "10"] as const) {
      const result = enquirySchema.safeParse({ ...base, standard: std, stream: "" });
      expect(result.success, `Standard ${std} should not require a stream`).toBe(true);
    }
  });

  it("requires Science or Commerce for Standard 11 and 12", () => {
    for (const std of ["11", "12"] as const) {
      const missing = enquirySchema.safeParse({ ...base, standard: std, stream: "" });
      expect(missing.success).toBe(false);
      const withStream = enquirySchema.safeParse({
        ...base,
        standard: std,
        stream: "Science",
      });
      expect(withStream.success).toBe(true);
    }
  });

  it("requiresStream matches only 11 and 12", () => {
    expect(requiresStream("10")).toBe(false);
    expect(requiresStream("11")).toBe(true);
    expect(requiresStream("12")).toBe(true);
    expect(requiresStream("1")).toBe(false);
  });
});

describe("validation", () => {
  it("rejects missing consent", () => {
    expect(
      enquirySchema.safeParse({ ...base, consent: false }).success
    ).toBe(false);
  });

  it("accepts common Indian mobile formats", () => {
    for (const mobile of [
      "9876543210",
      "98765 43210",
      "+91 98765 43210",
      "+919876543210",
      "919876543210",
      "09876543210",
    ]) {
      expect(
        enquirySchema.safeParse({ ...base, mobile }).success,
        `should accept ${mobile}`
      ).toBe(true);
    }
  });

  it("rejects invalid mobiles", () => {
    for (const mobile of ["12345", "5555555555", "abcdefghij", ""]) {
      expect(
        enquirySchema.safeParse({ ...base, mobile }).success,
        `should reject ${mobile}`
      ).toBe(false);
    }
  });

  it("rejects empty names and over-long messages", () => {
    expect(enquirySchema.safeParse({ ...base, parentName: "" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, studentName: " " }).success).toBe(false);
    expect(
      enquirySchema.safeParse({ ...base, message: "x".repeat(401) }).success
    ).toBe(false);
  });
});

describe("WhatsApp message", () => {
  it("contains the required structure and disclaimer", () => {
    const msg = buildEnquiryMessage(base);
    expect(msg).toContain(
      "Hello St. Thomas School, Surat. I would like to make an admission enquiry."
    );
    expect(msg).toContain("Parent/Guardian: Asha Patel");
    expect(msg).toContain("Mobile: +91 98765 43210");
    expect(msg).toContain("Student: Dev Patel");
    expect(msg).toContain("Applying for: Standard 4");
    expect(msg).toContain("Enquiry about: Admission");
    expect(msg).toContain("Preferred contact: WhatsApp");
    expect(msg).toContain("Question: Is there a mid-year intake?");
    expect(msg).toContain("I understand that this enquiry does not confirm admission.");
  });

  it("omits the stream line below Standard 11 and includes it for 11–12", () => {
    expect(buildEnquiryMessage(base)).not.toContain("Stream:");
    const hs = buildEnquiryMessage({ ...base, standard: "12", stream: "Commerce" });
    expect(hs).toContain("Stream: Commerce");
  });

  it("uses fallbacks for optional fields", () => {
    const msg = buildEnquiryMessage({
      ...base,
      currentStandard: "",
      message: "",
    });
    expect(msg).toContain("Current standard: Not provided");
    expect(msg).toContain("Question: No additional question");
  });
});

describe("WhatsApp URL", () => {
  it("targets 917435975575 with no plus, spaces or formatting", () => {
    const url = buildWhatsAppUrl(base);
    expect(url.startsWith("https://wa.me/917435975575?text=")).toBe(true);
    const host = new URL(url);
    expect(host.pathname).toBe("/917435975575");
    expect(host.pathname).not.toContain("+");
    expect(host.pathname).not.toContain(" ");
  });

  it("URL-encodes the message so it round-trips exactly", () => {
    const url = buildWhatsAppUrl(base);
    const text = new URL(url).searchParams.get("text");
    expect(text).toBe(buildEnquiryMessage(base));
  });

  it("stays within a safe URL length", () => {
    const url = buildWhatsAppUrl({ ...base, message: "x".repeat(400) });
    expect(url.length).toBeLessThan(2000);
  });
});

describe("central contact configuration", () => {
  it("keeps supplied contact values exact", () => {
    expect(school.phoneDisplay).toBe("74359 75575");
    expect(school.phoneHref).toBe("tel:+917435975575");
    expect(school.whatsappBase).toBe("https://wa.me/917435975575");
    expect(school.instagramUrl).toBe(
      "https://www.instagram.com/st_thomas_school_surat?igsh=MW5zaDN5cDl2aHZybg=="
    );
    expect(school.directionsUrl).toContain(
      "https://www.google.com/maps/dir/?api=1&destination="
    );
  });

  it("normalises mobiles for display", () => {
    expect(normaliseMobile("9876543210")).toBe("+91 98765 43210");
    expect(normaliseMobile("+91 98765 43210")).toBe("+91 98765 43210");
    expect(normaliseMobile("09876543210")).toBe("+91 98765 43210");
  });
});
