/** @jsxImportSource @emotion/react */

import { Box, Button, CircularProgress, Grid, TextField } from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";
import { toast } from "react-toastify";
import { ParsedPdf, SERVER_URL } from "../../constants";
import CustomSelect from "../CustomSelect";

type Props = {
  onPdfParsed: (data: ParsedPdf) => void;
};

const ParsePdfForm: React.FC<Props> = ({ onPdfParsed }) => {
  const [bank, setBank] = useState("itaú");
  const [fileType, setFileType] = useState("card_invoice");
  const [pdf, setPdf] = useState<File | null>(null);
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
      formData.append(
        "ignore_entries_before",
        ignoreEntriesBefore?.toISOString() ?? ""
      );

      const response = await fetch(`${SERVER_URL}/parsePdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error parsing PDF");
      }

      const data = await response.json();
      onPdfParsed(data);
      toast.success("PDF parsed!");
    } catch (err) {
      toast.error("Error parsing PDF");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CustomSelect
          label={"Bank"}
          value={bank}
          onChange={setBank}
          options={[{ name: "Itaú", value: "itaú" }]}
          disabled={loading}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.name}
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
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.name}
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
  );
};

// fields:
// bank
// file type (card invoice or bank statement)
// file upload
// notion API
// notion database ID

export default ParsePdfForm;
