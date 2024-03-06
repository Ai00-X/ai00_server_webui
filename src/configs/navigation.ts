import menuApps from "./menus/apps.menu";
import menuMain from "./menus/main.menu";
import menuDev from "./menus/dev.menu";

export default {
  menu: [
    {
      text: "AI00 Server",
      key: "",
      items: menuMain,
    },
    {
      text: "Demos",
      items: menuApps,
    },
    {
      text: "Developer",
      items: menuDev,
    },
  ],
};
