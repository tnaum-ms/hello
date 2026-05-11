#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// ---------------------------------------------------------------------------
// Pixel font — each character is a 5-row × variable-width binary grid
// 1 = lit pixel, 0 = dark pixel
// Most letters are 3 wide; some (M, W) are 5 wide
// ---------------------------------------------------------------------------

const FONT = {
  A: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  B: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
  ],
  C: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  D: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
  ],
  E: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  F: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  G: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  H: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  J: [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  K: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
  ],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  N: [
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  O: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  P: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],
  Q: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
  ],
  R: [
    [1, 1, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
  ],
  S: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  U: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  V: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  X: [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
    [1, 0, 1],
  ],
  Y: [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  Z: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  0: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  1: [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  2: [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  3: [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  4: [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  5: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  6: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  7: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  8: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  9: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  " ": [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  "!": [
    [1],
    [1],
    [1],
    [0],
    [1],
  ],
  ">": [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],
  "<": [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  ":": [
    [0],
    [1],
    [0],
    [1],
    [0],
  ],
  "_": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [1, 1, 1],
  ],
  "-": [
    [0, 0, 0],
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  ".": [
    [0],
    [0],
    [0],
    [0],
    [1],
  ],
  "/": [
    [0, 0, 1],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  "(": [
    [0, 1],
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 1],
  ],
  ")": [
    [1, 0],
    [0, 1],
    [0, 1],
    [0, 1],
    [1, 0],
  ],
  ";": [
    [0],
    [1],
    [0],
    [1],
    [1],
  ],
};

// ---------------------------------------------------------------------------
// Large pixel font — 7 rows tall, 5 cols wide, bolder
// Uses all 7 grid rows (Sun through Sat)
// ---------------------------------------------------------------------------

const FONT_LARGE = {
  A: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  B: [
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
  ],
  C: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  D: [
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  F: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
  ],
  G: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  H: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  I: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  J: [
    [0, 0, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  K: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  L: [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  M: [
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  N: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  P: [
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
  ],
  Q: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 1],
  ],
  R: [
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  S: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  V: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  X: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  Y: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  Z: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  0: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  1: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  2: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  3: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  4: [
    [0, 0, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0],
  ],
  5: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  6: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  7: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  8: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  9: [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  "!": [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
  ],
  ">":[
    [1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 0, 0],
  ],
  "<": [
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
  ],
  ":": [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "_": [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  "-": [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  ".": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  "/": [
    [0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1],
    [0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
  ],
  "(": [
    [0, 0, 1],
    [0, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  ")": [
    [1, 0, 0],
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],
  ";": [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 0, 0],
  ],
};

// ---------------------------------------------------------------------------
// Grid / date math
// ---------------------------------------------------------------------------

const ROWS = 7; // Sun=0 .. Sat=6
const TOTAL_COLS = 53;
const BUFFER_START = 4; // skip first 4 weeks
const BUFFER_END = 4; // skip last 4 weeks
const USABLE_START = BUFFER_START;
const USABLE_END = TOTAL_COLS - BUFFER_END - 1; // 48
const USABLE_COLS = USABLE_END - USABLE_START + 1; // 45

const DEFAULT_COMMITS_PER_PIXEL = 30;

/**
 * Compute the Sunday that is the top-left corner of the contribution graph.
 * GitHub shows ~52 full weeks ending on the current day's week-column.
 * The graph starts on the Sunday of the week containing (today - 52 weeks).
 */
function getGraphStartSunday(today = new Date()) {
  // GitHub graph: the rightmost column contains "today".
  // The grid is 53 columns (weeks) wide.
  // The top-left cell is the Sunday that starts the oldest week shown.
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayOfWeek = t.getDay(); // 0=Sun
  // Go back 52 weeks from today's week-start (Sunday)
  const thisSunday = new Date(t);
  thisSunday.setDate(t.getDate() - dayOfWeek);
  const startSunday = new Date(thisSunday);
  startSunday.setDate(thisSunday.getDate() - 52 * 7);
  return startSunday;
}

/**
 * Convert a grid position (col, row) to a calendar date.
 */
function gridToDate(col, row, startSunday) {
  const d = new Date(startSunday);
  d.setDate(d.getDate() + col * 7 + row);
  return d;
}

/**
 * Format a Date as "YYYY-MM-DD HH:MM:SS" for git date env vars.
 */
function formatGitDate(date, hour, minute) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}:00`;
}

/**
 * Format a Date as "YYYY-MM-DD" for display.
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ---------------------------------------------------------------------------
// Text → grid mapping
// ---------------------------------------------------------------------------

/**
 * Convert a text string to an array of { col, row } grid positions
 * representing which cells should be "lit" on the contribution graph.
 *
 * Returns null and prints an error if text doesn't fit.
 */
function textToGrid(text, large = false) {
  const font = large ? FONT_LARGE : FONT;
  const fontHeight = large ? 7 : 5;
  const upper = text.toUpperCase();

  // First pass: compute total width
  let totalWidth = 0;
  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i];
    const glyph = font[ch];
    if (!glyph) {
      console.error(`Unsupported character: '${ch}'`);
      return null;
    }
    const charWidth = glyph[0].length;
    totalWidth += charWidth;
    if (i < upper.length - 1) totalWidth += 1; // 1-col gap between chars
  }

  if (totalWidth > USABLE_COLS) {
    console.error(
      `Text "${text}" is ${totalWidth} columns wide but only ${USABLE_COLS} are available.`
    );
    console.error("Try shorter text or fewer characters.");
    return null;
  }

  // Center horizontally within usable zone
  const offsetCol = USABLE_START + Math.floor((USABLE_COLS - totalWidth) / 2);
  // Center vertically: large font uses all 7 rows (offset 0), small uses 5 (offset 1)
  const offsetRow = large ? 0 : 1;

  const pixels = [];
  let curCol = offsetCol;

  for (let i = 0; i < upper.length; i++) {
    const glyph = font[upper[i]];
    const charWidth = glyph[0].length;

    for (let r = 0; r < fontHeight; r++) {
      for (let c = 0; c < charWidth; c++) {
        if (glyph[r][c]) {
          pixels.push({ col: curCol + c, row: offsetRow + r });
        }
      }
    }

    curCol += charWidth + 1; // +1 for gap
  }

  return pixels;
}

// ---------------------------------------------------------------------------
// ASCII preview
// ---------------------------------------------------------------------------

function printPreview(pixels, startSunday, commitsPerPixel) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const set = new Set(pixels.map((p) => `${p.col},${p.row}`));

  console.log("\n  Contribution graph preview:\n");

  for (let row = 0; row < ROWS; row++) {
    let line = `  ${dayNames[row]} `;
    for (let col = 0; col < TOTAL_COLS; col++) {
      if (col < USABLE_START || col > USABLE_END) {
        line += "· ";
      } else if (set.has(`${col},${row}`)) {
        line += "█ ";
      } else {
        line += "· ";
      }
    }
    console.log(line);
  }

  console.log();

  // Date range info
  const firstPixel = pixels.reduce(
    (a, b) => (a.col * 7 + a.row < b.col * 7 + b.row ? a : b),
    pixels[0]
  );
  const lastPixel = pixels.reduce(
    (a, b) => (a.col * 7 + a.row > b.col * 7 + b.row ? a : b),
    pixels[0]
  );
  const firstDate = gridToDate(firstPixel.col, firstPixel.row, startSunday);
  const lastDate = gridToDate(lastPixel.col, lastPixel.row, startSunday);

  console.log(`  Lit pixels:     ${pixels.length}`);
  console.log(`  Commits/pixel:  ${commitsPerPixel}`);
  console.log(`  Total commits:  ${pixels.length * commitsPerPixel}`);
  console.log(
    `  Date range:     ${formatDate(firstDate)} → ${formatDate(lastDate)}`
  );
  console.log(
    `  Usable zone:    cols ${USABLE_START}–${USABLE_END} (first/last ${BUFFER_START} weeks skipped)`
  );
  console.log();
}

// ---------------------------------------------------------------------------
// Commit generation
// ---------------------------------------------------------------------------

function generateCommits(pixels, startSunday, commitsPerPixel) {
  const dataDir = path.join(__dirname, "data");
  const filePath = path.join(dataDir, "contributions.txt");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Sort pixels by date so commits are in chronological order
  const sorted = [...pixels].sort((a, b) => {
    const da = a.col * 7 + a.row;
    const db = b.col * 7 + b.row;
    return da - db;
  });

  const totalDays = sorted.length;
  const totalCommits = totalDays * commitsPerPixel;
  let commitsDone = 0;

  console.log(
    `Creating ${totalCommits} commits across ${totalDays} days...\n`
  );

  for (let i = 0; i < sorted.length; i++) {
    const { col, row } = sorted[i];
    const date = gridToDate(col, row, startSunday);
    const dateStr = formatDate(date);

    process.stdout.write(
      `  Day ${i + 1}/${totalDays}: ${dateStr} — ${commitsPerPixel} commits`
    );

    for (let c = 0; c < commitsPerPixel; c++) {
      // Spread commits across the day (08:00 → ~22:00)
      const hour = 8 + Math.floor((c * 14) / commitsPerPixel);
      const minute = Math.floor(
        ((c * 14) % commitsPerPixel) * (60 / commitsPerPixel)
      );
      const gitDate = formatGitDate(date, hour, minute);

      // Append a line to the contributions file
      fs.appendFileSync(
        filePath,
        `${dateStr} commit ${c + 1}/${commitsPerPixel}\n`
      );

      // Create the commit with backdated author and committer dates
      execSync(`git add data/contributions.txt`, { cwd: __dirname });
      execSync(
        `git commit -m "pixel: ${dateStr} (${c + 1}/${commitsPerPixel})"`,
        {
          cwd: __dirname,
          env: {
            ...process.env,
            GIT_AUTHOR_DATE: gitDate,
            GIT_COMMITTER_DATE: gitDate,
          },
          stdio: "pipe",
        }
      );

      commitsDone++;
    }

    process.stdout.write(" ✓\n");
  }

  console.log(`\nDone! ${commitsDone} commits created.`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review:  git log --oneline | head -20`);
  console.log(`  2. Push:    git push`);
  console.log(`  3. Undo:    git reset --hard HEAD~${commitsDone} (if needed)`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const large = args.includes("--large");
  const commitsArg = args.find((a) => a.startsWith("--commits="));
  const commitsPerPixel = commitsArg
    ? parseInt(commitsArg.split("=")[1], 10)
    : DEFAULT_COMMITS_PER_PIXEL;

  if (isNaN(commitsPerPixel) || commitsPerPixel < 1) {
    console.error("--commits must be a positive integer.");
    process.exit(1);
  }

  const textArgs = args.filter((a) => !a.startsWith("--"));
  const text = textArgs[0] || "HELLO";

  console.log(`\n  GitHub Contribution Graph Art Generator`);
  console.log(`  Text: "${text}"${large ? " (large)" : ""}, ${commitsPerPixel} commits/pixel\n`);

  const startSunday = getGraphStartSunday();
  console.log(`  Graph start (top-left): ${formatDate(startSunday)} (Sunday)`);

  const pixels = textToGrid(text, large);
  if (!pixels || pixels.length === 0) {
    process.exit(1);
  }

  printPreview(pixels, startSunday, commitsPerPixel);

  if (dryRun) {
    console.log("  --dry-run: no commits created.\n");
    return;
  }

  const ok = await confirm(
    `  Create ${pixels.length * commitsPerPixel} commits? [y/N] `
  );
  if (!ok) {
    console.log("  Aborted.\n");
    return;
  }

  console.log();
  generateCommits(pixels, startSunday, commitsPerPixel);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
