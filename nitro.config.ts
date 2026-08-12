import { defineNitroConfig } from "nitro/config";

export default defineNitroConfig({
  preset: "vercel",
  outDir: ".vercel/output",
  output: {
    dir: ".vercel/output",
    publicDir: ".vercel/output/static",
  },
});
