import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import UserCard from '../UserCard';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const savedForms = sessionStorage.getItem('userForms');
  const savedData = savedForms ? JSON.parse(savedForms) : [];

  const rows = savedData.map((item, index) => ({
    id: index + 1,
    ...item,
  }));

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterByStartDate = (newDate) => {
    setPage(0);
    setFilterStartDate(newDate);
  };

  const handleFilterByEndDate = (newDate) => {
    setPage(0);
    setFilterEndDate(newDate);
  };

  const handleDelete = (name) => {
    const forms = savedForms ? JSON.parse(savedForms) : [];
    const updatedForms = forms.filter((form) => form.name !== name);
    sessionStorage.setItem('userForms', JSON.stringify(updatedForms));
    window.location.reload();
  };

  const dataFiltered = applyFilter({
    inputData: rows,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStartDate,
    filterEndDate,
  });

  const notFound =
    (!dataFiltered.length &&
      (!!filterName || !!filterStartDate || !!filterEndDate)) ||
    rows.length === 0;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Measurements</Typography>

       {!isMobile && (
          <Button
            variant="contained"
            color="inherit"
            onClick={() => navigate('/user/new')}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Measurement
          </Button>
        )}
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          filterStartDate={filterStartDate}
          onFilterStartDate={handleFilterByStartDate}
          filterEndDate={filterEndDate}
          onFilterEndDate={handleFilterByEndDate}
        />

        <Scrollbar>
          {isMobile ? (
            <Stack spacing={2} sx={{ p: 2 }}>
              {dataFiltered.length > 0 ? (
                dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserCard key={row.id} row={row} handleDelete={handleDelete} />
                  ))
              ) : (
                 <Stack
    alignItems="center"
    justifyContent="center"
    sx={{ py: 5, width: '100%' }}
  >
    <Typography variant="h6" gutterBottom>
      <b>No Data</b>
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
      There is no data available.<br />
      Please add new measurements.
    </Typography>
  </Stack>
              )}
            </Stack>
          ) : (
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={rows.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'mobile', label: 'Mobile' },
                    { id: 'measurementDate', label: 'Date' },
                    { id: 'user', label: 'Assigned User' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        handleDelete={handleDelete}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, rows.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
       {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 1100,
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            fullWidth
            onClick={() => navigate('/user/new')}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Measurement
          </Button>
        </Box>
      )}
    </Container>
  );
}
