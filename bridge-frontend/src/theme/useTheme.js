import { useEffect, useState } from "react";
import { setToLS, getFromLS } from "../storageUtils/storage";
import _ from "lodash";

export const useTheme = () => {
  const themes = getFromLS("all-themes");
  const [theme, setTheme] = useState(themes.data.light);
  const [themeLoaded, setThemeLoaded] = useState(false);

  const setMode = (mode) => {
    setToLS("theme", mode);
    setTheme(mode);
  };

  const getFonts = () => {
    const allFonts = _.values(_.mapValues(themes.data, "font"));
    return allFonts;
  };

  useEffect(() => {
    const localTheme = getFromLS("theme");
    localTheme ? setTheme(localTheme) : setTheme(themes.data.light);
    setThemeLoaded(true);
    // eslint-disable-next-line
  }, []);

  return { theme, themeLoaded, setMode, getFonts };
};