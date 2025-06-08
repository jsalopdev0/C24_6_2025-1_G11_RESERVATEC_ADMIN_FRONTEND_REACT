/* eslint-disable react/prop-types */
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ title, subtitle, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const textColor = theme.palette.mode === "dark" ? "#ffffff" : "#000000";

  return (
    <Box
      backgroundColor={colors.primary[400]}
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      height="100%"
      width="100%"
    >
      <Box mr={2} display="flex" alignItems="center">
        {icon}
      </Box>
      <Box>
        <Typography variant="h1" fontWeight="bold" color={textColor} lineHeight={1}>
          {title}
        </Typography>
        <Typography variant="h3" color={textColor}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
