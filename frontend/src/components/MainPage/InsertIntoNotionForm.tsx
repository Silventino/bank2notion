/** @jsxImportSource @emotion/react */

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { NotionProperty, ParsedPdf, SERVER_URL } from "../../constants";
import CustomSelect from "../CustomSelect";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

type Props = {
  notionProperties: NotionProperty[];
  parsedPdf: ParsedPdf;
  setParsedPdf: (value: ParsedPdf) => void;
  notionToken: string;
  notionDatabaseId: string;
};

const InsertIntoNotionForm: React.FC<Props> = (props) => {
  const {
    notionProperties,
    parsedPdf,
    notionDatabaseId,
    notionToken,
    setParsedPdf,
  } = props;
  const [notionPropertiesMap, setNotionPropertiesMap] = useState<
    Record<string, NotionProperty>
  >({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (
        notionPropertiesMap["name"] === undefined ||
        notionPropertiesMap["date"] === undefined ||
        notionPropertiesMap["value"] === undefined
      ) {
        throw new Error("You must map all properties");
      }

      const formData = new FormData();
      formData.append(
        "notion_properties_map",
        JSON.stringify(notionPropertiesMap)
      );
      formData.append("parsed_pdf", JSON.stringify(parsedPdf));
      formData.append("notion_token", notionToken);
      formData.append("notion_database_id", notionDatabaseId);

      const response = await fetch(`${SERVER_URL}/insertIntoNotion`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error inserting data into Notion");
      }

      toast.success("Data inserted into Notion!");

      navigate("/success");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Error inserting data into Notion");
    }
    setLoading(false);
  };

  const onChangeMap = (value: string, index: string) => {
    const newValue = notionProperties.find((item) => item.name === value);
    if (newValue === undefined) return;
    const newNotionPropertiesMap = {
      ...notionPropertiesMap,
      [index]: newValue,
    };
    setNotionPropertiesMap(newNotionPropertiesMap);
  };

  const deletePdfEntryByIndex = (index: number) => {
    const newParsedPdf = parsedPdf.filter((_, i) => i !== index);
    setParsedPdf(newParsedPdf);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} display={"flex"} justifyContent={"center"}>
        <Typography variant={"h6"}>
          3. Map PDF properties to Notion properties
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 120 }}>
                  <CustomSelect<NotionProperty>
                    label={"Name"}
                    value={notionPropertiesMap["name"] ?? {}}
                    onChange={(value) => onChangeMap(value, "name")}
                    options={notionProperties}
                    disabled={loading}
                    getOptionValue={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <CustomSelect<NotionProperty>
                    label={"Date"}
                    value={notionPropertiesMap["date"] ?? {}}
                    onChange={(value) => onChangeMap(value, "date")}
                    options={notionProperties}
                    disabled={loading}
                    getOptionValue={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <CustomSelect<NotionProperty>
                    label={"Value"}
                    value={notionPropertiesMap["value"] ?? {}}
                    onChange={(value) => onChangeMap(value, "value")}
                    options={notionProperties}
                    disabled={loading}
                    getOptionValue={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                  />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parsedPdf.map((row, i) => (
                <TableRow key={`${row.name}.${row.date}.${row.value}`}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => deletePdfEntryByIndex(i)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

export default InsertIntoNotionForm;
