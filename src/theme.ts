import { PaletteOptions, Palette } from "@material-ui/core/styles/createPalette";
import { TypographyOptions } from "@material-ui/core/styles/createTypography";

const palette: PaletteOptions = {
};

const typography: TypographyOptions | ((palette: Palette) => TypographyOptions) = {
  h1: {
    fontSize: "6rem"
  },
  h2: {
    fontSize: "3.75rem"
  },
  h3: {
    fontSize: "3rem"
  },
  h4: {
    fontSize: "2.125rem"
  },
  h5: {
    fontSize: "1.5rem"
  },
  h6: {
    fontSize: "1.25rem"
  }
}

export { palette, typography };
