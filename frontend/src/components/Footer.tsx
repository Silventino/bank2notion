/** @jsxImportSource @emotion/react */

import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailIcon from "@mui/icons-material/Mail";
import { Box, IconButton } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component={"footer"}
      display={"flex"}
      justifyContent={"center"}
      alignContent={"center"}
    >
      <IconButton
        size="large"
        color="primary"
        href="https://github.com/Silventino/bank2notion"
        target="_blank"
      >
        <GitHubIcon />
      </IconButton>

      <IconButton
        size="large"
        color="primary"
        href="https://linkedin.com/in/silventino"
        target="_blank"
      >
        <LinkedInIcon />
      </IconButton>

      <IconButton
        size="large"
        color="primary"
        href="mailto:silventino.dev@gmail.com"
        // target="_blank"
      >
        <MailIcon />
      </IconButton>
    </Box>
  );
};

export default Footer;
