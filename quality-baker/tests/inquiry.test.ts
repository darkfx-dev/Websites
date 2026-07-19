/**
 * Run with: node --experimental-strip-types --test tests/inquiry.test.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildInquiryMessage, inquiryWhatsappHref } from "../lib/inquiry.ts";

test("full inquiry includes every provided field in order", () => {
  const msg = buildInquiryMessage({
    name: "Poonam",
    callback: "+91 90000 00000",
    occasion: "Birthday",
    date: "2026-07-25",
    style: "Photo cake",
    flavor: "Red Velvet",
    filling: "Chocolate ganache",
    shape: "Heart",
    weight: "1 kg",
    finish: "Fondant",
    colour: "Blush pink",
    inscription: "Happy 25th Poonam",
    fulfilment: "Collect from the shop",
    dietary: "Eggless please",
    notes: "Gold sprinkles if possible",
  });
  assert.match(msg, /^Hi Modi Bakers, I would like to check the availability and price of a custom cake\./);
  assert.match(msg, /Name: Poonam/);
  assert.match(msg, /Occasion: Birthday/);
  assert.match(msg, /Required date: 2026-07-25/);
  assert.match(msg, /Cake: Photo cake/);
  assert.match(msg, /Flavour: Red Velvet/);
  assert.match(msg, /Filling: Chocolate ganache/);
  assert.match(msg, /Shape: Heart/);
  assert.match(msg, /Weight: 1 kg/);
  assert.match(msg, /Finish and colour: Fondant, Blush pink/);
  assert.match(msg, /Cake inscription: "Happy 25th Poonam"/);
  assert.match(msg, /Collection or delivery: Collect from the shop/);
  assert.match(msg, /Dietary or allergy notes: Eggless please/);
  assert.match(msg, /Additional notes: Gold sprinkles if possible/);
  assert.match(
    msg,
    /Please confirm whether this order is available and share the final price\. Thank you\.$/
  );
});

test("empty optional fields are omitted entirely", () => {
  const msg = buildInquiryMessage({
    occasion: "Anniversary",
    flavor: "Vanilla",
    inscription: "   ",
    notes: "",
  });
  assert.doesNotMatch(msg, /Name:/);
  assert.doesNotMatch(msg, /Filling:/);
  assert.doesNotMatch(msg, /inscription/i);
  assert.doesNotMatch(msg, /Additional notes:/);
  assert.match(msg, /Occasion: Anniversary/);
  assert.match(msg, /Flavour: Vanilla/);
});

test("finish and colour merge into one line, either alone works", () => {
  assert.match(
    buildInquiryMessage({ finish: "Fresh cream" }),
    /Finish and colour: Fresh cream\n/
  );
  assert.match(
    buildInquiryMessage({ colour: "Ivory" }),
    /Finish and colour: Ivory\n/
  );
});

test("wa.me href targets the right number and encodes special characters", () => {
  const href = inquiryWhatsappHref({
    name: "A & B",
    inscription: 'Happy B\'day "Chotu" 100%',
    notes: "Line1\nLine2",
  });
  assert.ok(href.startsWith("https://wa.me/919426392062?text="));
  const decoded = decodeURIComponent(href.split("?text=")[1]);
  assert.match(decoded, /Name: A & B/);
  assert.match(decoded, /Happy B'day "Chotu" 100%/);
  assert.match(decoded, /Line1\nLine2/);
  // raw href must not contain unencoded separators
  assert.doesNotMatch(href.split("?text=")[1], /[&\n" ]/);
});
