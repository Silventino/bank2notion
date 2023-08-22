/** @jsxImportSource @emotion/react */

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";
import CustomSelect from "../CustomSelect";
import Footer from "../Footer";

function App() {
  const [bank, setBank] = useState("itaú");
  const [fileType, setFileType] = useState("card_invoice");
  const [pdf, setPdf] = useState<File | null>(null);
  const [notionToken, setNotionToken] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");
  const [ignoreEntriesBefore, setIgnoreEntriesBefore] = useState<Date | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bank", bank);
      formData.append("file_type", fileType);
      formData.append("file", pdf as File);
      formData.append("notion_token", notionToken);
      formData.append("notion_database_id", notionDatabaseId);
      formData.append(
        "ignore_entries_before",
        ignoreEntriesBefore?.toISOString() ?? ""
      );

      await fetch("http://127.0.0.1:5001/bank2notion/us-central1/uploadFile/", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      padding={4}
      flexDirection={"column"}
      height={"100vh"}
    >
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Box display={"flex"} justifyContent={"center"} marginBottom={2}>
            <img
              src={"assets/notion.png"}
              alt={"notion logo"}
              style={{ width: 60 }}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomSelect
                label={"Bank"}
                value={bank}
                onChange={setBank}
                options={[{ name: "Itaú", value: "itaú" }]}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomSelect
                label={"File type"}
                value={fileType}
                onChange={setFileType}
                options={[
                  { name: "Card Invoice", value: "card_invoice" },
                  { name: "Bank Statement", value: "bank_statement" },
                ]}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <MuiFileInput
                label={"File upload"}
                fullWidth
                value={pdf}
                onChange={setPdf}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Ignore entries before (including)"}
                type={"date"}
                fullWidth
                value={ignoreEntriesBefore?.toISOString().slice(0, 10)}
                onChange={(event) => {
                  const date = new Date(event.target.value);
                  if (!isNaN(date.getTime())) {
                    setIgnoreEntriesBefore(date);
                  }
                }}
                InputLabelProps={{ shrink: true }}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Notion API Token"}
                fullWidth
                value={notionToken}
                onChange={(event) => setNotionToken(event.target.value)}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Notion Database ID"}
                fullWidth
                value={notionDatabaseId}
                onChange={(event) => setNotionDatabaseId(event.target.value)}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display={"flex"} justifyContent={"center"}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Footer />
    </Box>
  );
}

// fields:
// bank
// file type (card invoice or bank statement)
// file upload
// notion API
// notion database ID

export default App;
