import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { amber } from "@mui/material/colors";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#2a2640",
    },
    secondary: amber,
  },
});

theme.typography = {
  ...theme.typography,
  h1: {
    ...theme.typography.h1,
    fontSize: "3rem",
    [theme.breakpoints.up("md")]: {
      fontSize: "5rem",
    },
  },
  h2: {
    ...theme.typography.h2,
    fontSize: "2rem",
    [theme.breakpoints.up("md")]: {
      fontSize: "3rem",
    },
  },
  h3: {
    ...theme.typography.h3,
    fontSize: "1.5rem",
    [theme.breakpoints.up("md")]: {
      fontSize: "2.5rem",
    },
  },
  h5: {
    ...theme.typography.h3,
    fontSize: "1.2rem",
    [theme.breakpoints.up("md")]: {
      fontSize: "1.5rem",
    },
  },
};

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
