/* eslint-disable react/prop-types */
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="12px">
      <Typography
        variant="h2"
        fontWeight="bold"
        color={colors.gray[100]}
        mb="5px"
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        color={theme.palette.customAccent.main} // Esto fuerza a usar el celeste en ambos modos
      >
        {subtitle}
      </Typography>

    </Box>
  );
};

export default Header;
