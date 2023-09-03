/** @jsxImportSource @emotion/react */

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NotionProperty, ParsedPdf, SERVER_URL } from "../../constants";
import CustomSelect from "../CustomSelect";
import { toast } from "react-toastify";

type Props = {
  notionProperties: NotionProperty[];
  parsedPdf: ParsedPdf;
  notionToken: string;
  notionDatabaseId: string;
};

const InsertIntoNotionForm: React.FC<Props> = (props) => {
  const { notionProperties, parsedPdf, notionDatabaseId, notionToken } = props;
  const [notionPropertiesMap, setNotionPropertiesMap] = useState<
    Record<string, NotionProperty>
  >({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
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
    } catch (err) {
      console.error(err);
      toast.error("Error inserting data into Notion");
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography>Map PDF properties:</Typography>
      </Grid>

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 140 }}>
                  <CustomSelect<NotionProperty>
                    label={"Name"}
                    value={notionPropertiesMap["name"]?.name}
                    onChange={(value) => onChangeMap(value, "name")}
                    options={notionProperties}
                    disabled={loading}
                    getOptionValue={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 140 }}>
                  <CustomSelect<NotionProperty>
                    label={"Date"}
                    value={notionPropertiesMap["date"]?.name}
                    onChange={(value) => onChangeMap(value, "date")}
                    options={notionProperties}
                    disabled={loading}
                    getOptionValue={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 140 }}>
                  <CustomSelect<NotionProperty>
                    label={"Value"}
                    value={notionPropertiesMap["value"]?.name}
                    onChange={(value) => onChangeMap(value, "value")}
                    options={notionProperties}
                    disabled={loading}
                    getOptionValue={(option) => option.name}
                    getOptionLabel={(option) => option.name}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parsedPdf.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.value}</TableCell>
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
