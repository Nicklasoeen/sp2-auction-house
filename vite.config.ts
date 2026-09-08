import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "login.html"),
        register: resolve(__dirname, "register.html"),
        browse: resolve(__dirname, "browse.html"),
        productDetail: resolve(__dirname, "product-detail.html"),
        createListing: resolve(__dirname, "create-listing.html"),
      },
    },
  },
});
