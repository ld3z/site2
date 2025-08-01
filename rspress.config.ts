import * as path from "node:path";
import { defineConfig } from "rspress/config";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "ldez's Site",
  icon: "/favicon.png",
  base: "/site2/",
  logo: {
    light: "/favicon.png",
    dark: "/favicon.png",
  },
  themeConfig: {
    nav: [
      { text: "Home", link: "/home" },
      { text: "ChestShop Guide", link: "/chest-shops" },
      { text: "Tapestry Plugins", link: "/tapestry-plugins" },
    ],
    sidebar: {
      "/": [
        {
          text: "Menu",
          items: [
            {
              text: "Home",
              link: "/home",
            },
            {
              text: "ChestShops",
              link: "/chest-shops",
            },
            {
              text: "Tapestry Plugins",
              link: "/tapestry-plugins",
            },
          ],
        },
      ],
    },
    lastUpdated: true,
    footer: {},
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/ld3z/site2",
      },
    ],
  },
  route: { cleanUrls: true },
});
