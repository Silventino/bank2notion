/** @jsxImportSource @emotion/react */

import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { NotionProperties, SERVER_URL } from "../../constants";
import { toast } from "react-toastify";

type Props = {
  notionToken: string;
  notionDatabaseId: string;
  onNotionConnected: (properties: NotionProperties) => void;
  setNotionToken: (value: string) => void;
  setNotionDatabaseId: (value: string) => void;
};

const ConnectToNotionForm: React.FC<Props> = (props) => {
  const {
    notionToken,
    notionDatabaseId,
    onNotionConnected,
    setNotionToken,
    setNotionDatabaseId,
  } = props;

  const [loading, setLoading] = useState(false);

  const handleConnectToNotion = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("notion_token", notionToken);
      formData.append("notion_database_id", notionDatabaseId);

      const response = await fetch(`${SERVER_URL}/databaseProperties`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error connecting to Notion");
      }

      const properties = (await response.json()) as NotionProperties;
      console.log("properties", properties);

      onNotionConnected(properties);

      toast.success("Connected to Notion!");
    } catch (err: any) {
      toast.error(err.message ?? "Error connecting to Notion");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={3}>
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
              onClick={handleConnectToNotion}
              disabled={loading}
            >
              Submit
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ConnectToNotionForm;
