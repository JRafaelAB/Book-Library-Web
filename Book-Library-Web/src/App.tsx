import "./App.css";
import { Button, Container, TextField } from "@mui/material";
import styled from "@emotion/styled";
import { useState, BaseSyntheticEvent } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

type Book = {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  totalCopies: number;
  copiesInUse: number;
  type: string;
  isbn: string;
  category: string;
};

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [row, setRow] = useState<Book>();

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 70 },
    { field: "author", headerName: "Author", width: 130 },
    { field: "type", headerName: "Type", width: 130 },
    {
      field: "ISBN",
      headerName: "ISBN",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
  ];
  const getUrl = () => {
    if (inputValue) {
      return `https://localhost:7182/v1/Books/${inputValue}/${currentPage}`;
    }
    return `https://localhost:7182/v1/Books/${currentPage}`;
  };

  const handleSubmit = async (evt: any) => {
    evt.preventDefault();

    const response = await axios.get<Book[]>(getUrl());
    if (response.data) setRow(response.data);
  };

  return (
    <Container maxWidth="sm">
      <Card>
        <form onSubmit={handleSubmit}>
          <StyledTitle>Royal Library</StyledTitle>
          <TextField
            id="outlined-basic"
            label="Search Value"
            variant="outlined"
            helperText="Search books by Title/Author/Category/ISBN"
            value={inputValue}
            onChange={(evt: BaseSyntheticEvent) =>
              setInputValue(evt.currentTarget.value)
            }
            fullWidth
          />
          <StyledButton type="submit" variant="contained">
            Search
          </StyledButton>
        </form>
      </Card>
      <Card>
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={6}
          rowsPerPageOptions={[5]}
        />
      </Card>
    </Container>
  );
}

const Card = styled.div`
  height: auto;
  width: 500px;
  padding: 16px;
  border: 2px solid white;
  border-radius: 4px;
  background-color: #cecece;

  display: flex;
  align-items: center;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  background-color: #747577;
  margin-top: 15px;
  border: none;
  outline: none;
  border-style: none;
  :hover {
    background-color: #4c4d4e;
  }
`;

const StyledTextField = styled(TextField)`
  color: #747577;
`;

const StyledTitle = styled.h1`
  color: black;
`;

export default App;
