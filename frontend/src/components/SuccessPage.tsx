/** @jsxImportSource @emotion/react */

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

function SuccessPage() {
  const navigate = useNavigate();

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      padding={4}
      flexDirection={"column"}
      height={"100vh"}
    >
      <Card sx={{ maxWidth: 600, overflow: "visible" }}>
        <CardContent>
          <Box display={"flex"} justifyContent={"center"} marginBottom={2}>
            <img
              src={"assets/notion.png"}
              alt={"notion logo"}
              style={{ width: 60 }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
              <Typography variant={"h4"}>Success! 🎉</Typography>
            </Grid>

            <Grid
              item
              xs={12}
              display={"flex"}
              justifyContent={"center"}
              textAlign={"center"}
            >
              <Typography>
                Thanks for using Bank2Notion!
                <br />
                If this app helped you, leave a star in my GitHub repo and check
                my socials below!
              </Typography>
            </Grid>

            <Grid item xs={12} display={"flex"} justifyContent={"center"}>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Footer />
    </Box>
  );
}

export default SuccessPage;
