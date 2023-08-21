/** @jsxImportSource @emotion/react */

import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";
import CustomSelect from "../CustomSelect";

function App() {
  const [bank, setBank] = useState("itaú");
  const [fileType, setFileType] = useState("card_invoice");
  const [pdf, setPdf] = useState<File | null>(null);
  const [notionToken, setNotionToken] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");
  const [ignoreEntriesBefore, setIgnoreEntriesBefore] = useState<Date | null>(
    null
  );

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("bank", bank);
    formData.append("file_type", fileType);
    formData.append("file", pdf as File);
    formData.append("notion_token", notionToken);
    formData.append("notion_database_id", notionDatabaseId);

    fetch("http://127.0.0.1:5001/bank2notion/us-central1/uploadFile/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <Box display={"flex"} justifyContent={"center"} padding={4}>
      <Card sx={{ minWidth: 400, maxWidth: 600 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomSelect
                label={"Bank"}
                value={bank}
                onChange={setBank}
                options={[{ name: "Itaú", value: "itaú" }]}
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
              />
            </Grid>

            <Grid item xs={12}>
              <MuiFileInput
                label={"File upload"}
                fullWidth
                value={pdf}
                onChange={setPdf}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Ignore entries before"}
                type={"date"}
                fullWidth
                value={ignoreEntriesBefore?.toISOString().slice(0, 10)}
                onChange={(event) =>
                  setIgnoreEntriesBefore(new Date(event.target.value))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Notion API Token"}
                fullWidth
                value={notionToken}
                onChange={(event) => setNotionToken(event.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={"Notion Database ID"}
                fullWidth
                value={notionDatabaseId}
                onChange={(event) => setNotionDatabaseId(event.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display={"flex"} justifyContent={"center"}>
                <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
