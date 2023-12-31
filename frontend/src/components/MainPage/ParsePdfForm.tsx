/** @jsxImportSource @emotion/react */

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";
import { toast } from "react-toastify";
import { ParsedPdf, SERVER_URL, SUPPORTED_BANKS } from "../../constants";
import CustomSelect from "../CustomSelect";

type Props = {
  onPdfParsed: (data: ParsedPdf) => void;
};

type Bank = typeof SUPPORTED_BANKS[number];

const ParsePdfForm: React.FC<Props> = ({ onPdfParsed }) => {
  const [bank, setBank] = useState<Bank>(SUPPORTED_BANKS[0]);
  const [fileType, setFileType] = useState(
    SUPPORTED_BANKS[0].supportedFiles[0]
  );
  const [pdf, setPdf] = useState<File | null>(null);
  const [ignoreEntriesBefore, setIgnoreEntriesBefore] = useState<Date | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("bank", bank.value);
      formData.append("file_type", fileType.value);
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
    } catch (err: any) {
      toast.error(err.message ?? "Error parsing PDF");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
        <Typography variant={"h6"}>2. Parse Bank PDF</Typography>
      </Grid>

      <Grid item xs={12}>
        <CustomSelect<Bank>
          label={"Bank"}
          value={bank}
          onChange={(newBankValue) => {
            const newBank = SUPPORTED_BANKS.find(
              (bank) => bank.value === newBankValue
            );

            if (newBank) {
              setBank(newBank);
            }
          }}
          options={SUPPORTED_BANKS}
          disabled={loading}
          getOptionValue={(option) => option.value}
          getOptionLabel={(option) => option.name}
        />
      </Grid>

      <Grid item xs={12}>
        <CustomSelect
          label={"File type"}
          value={fileType}
          onChange={(newFileType) => {
            const newFileTypeValue = bank.supportedFiles.find(
              (fileType) => fileType.value === newFileType
            );

            if (newFileTypeValue) {
              setFileType(newFileTypeValue);
            }
          }}
          options={bank.supportedFiles}
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

export default ParsePdfForm;
