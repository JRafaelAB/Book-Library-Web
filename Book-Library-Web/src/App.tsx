import "./App.css";
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import styled from "@emotion/styled";
import { useState, BaseSyntheticEvent, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";

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

type Page = {
  totalOfItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
  items: Book[];
};

function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rows, setRows] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const getUrl = () => {
    if (inputValue) {
      return `https://localhost:7182/v1/Books/${inputValue}/${currentPage}`;
    }
    return `https://localhost:7182/v1/Books/${currentPage}`;
  };

  useEffect(() => {
    const req = async () => {
      await makeRequest();
    };
    req();
  }, [currentPage]);

  const makeRequest = async () => {
    const response = await axios.get<Page>(getUrl());
    setTotalPages(response.data.totalPages);
    if (response.data) setRows(response.data.items);
  };

  const handleSubmit = async (evt: any) => {
    evt.preventDefault();
    await makeRequest();
  };

  const handleChangePage = async (
    evt: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  return (
    <Container>
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
        {rows.length > 0 && (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TitleCell align="left">Title</TitleCell>
                    <TitleCell align="left">Author</TitleCell>
                    <TitleCell align="left">Type</TitleCell>
                    <TitleCell align="left">ISBN</TitleCell>
                    <TitleCell align="left">Category</TitleCell>
                    <TitleCell align="left">Available Copies</TitleCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows?.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{`${row.firstName} ${row.lastName}`}</TableCell>
                      <TableCell align="left">{row.type}</TableCell>
                      <TableCell align="left">{row.isbn}</TableCell>
                      <TableCell align="left">{row.category}</TableCell>
                      <TableCell align="left">
                        {row.copiesInUse}/{row.totalCopies}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination count={totalPages} onChange={handleChangePage} />
          </>
        )}
      </Card>
    </Container>
  );
}

const Card = styled.div`
  height: auto;
  width: 1280px;
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

const TitleCell = styled(TableCell)`
  font-size: 16px;
  font-weight: bold;
`;

const StyledTextField = styled(TextField)`
  color: #747577;
`;

const StyledTitle = styled.h1`
  color: black;
`;

export default App;
