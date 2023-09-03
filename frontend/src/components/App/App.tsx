/** @jsxImportSource @emotion/react */

import { Box, Card, CardContent } from "@mui/material";
import { useState } from "react";
import { NotionProperty, ParsedPdf } from "../../constants";
import Footer from "../Footer";
import ConnectToNotionForm from "./ConnectToNotionForm";
import ParsePdfForm from "./ParsePdfForm";
import InsertIntoNotionForm from "./InsertIntoNotionForm";

function App() {
  const [notionToken, setNotionToken] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");

  const [notionProperties, setNotionProperties] = useState<
    null | NotionProperty[]
  >(null);

  const [parsedPdf, setParsedPdf] = useState<null | ParsedPdf>(null);

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

          {!notionProperties && (
            <ConnectToNotionForm
              notionToken={notionToken}
              notionDatabaseId={notionDatabaseId}
              onNotionConnected={(properties) =>
                setNotionProperties(Object.values(properties))
              }
              setNotionToken={setNotionToken}
              setNotionDatabaseId={setNotionDatabaseId}
            />
          )}

          {notionProperties && !parsedPdf && (
            <ParsePdfForm onPdfParsed={(data) => setParsedPdf(data)} />
          )}

          {notionProperties && parsedPdf && (
            <InsertIntoNotionForm
              notionProperties={notionProperties}
              parsedPdf={parsedPdf}
              notionToken={notionToken}
              notionDatabaseId={notionDatabaseId}
            />
          )}
        </CardContent>
      </Card>

      <Footer />
    </Box>
  );
}

export default App;
