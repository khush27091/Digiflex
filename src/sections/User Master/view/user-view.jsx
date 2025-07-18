import { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Box,  Card,Table,Stack,Button, Container,TableBody,Typography ,   
  TableContainer, TablePagination, 
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import UserCard from '../UserCard';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserFormDialog from '../user-form-page';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const savedData = JSON.parse(sessionStorage.getItem('masteruser') || '[]');

  const rows = savedData.map((item, index) => ({
    id: index + 1,
    name: `${item.firstName} ${item.lastName}`,
    mobile: item.phone,
    email: item.email || '',
    ...item,
  }));

  const handleEditUser = (user) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleDelete = (name) => {
    const updated = savedData.filter((u) => `${u.firstName} ${u.lastName}` !== name);
    sessionStorage.setItem('masteruser', JSON.stringify(updated));
    window.location.reload();
  };

  const handleSort = (e, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const dataFiltered = applyFilter({
    inputData: rows,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStartDate,
    filterEndDate,
  });

  const notFound = !dataFiltered.length && (filterName || filterStartDate || filterEndDate);

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h4">User Master</Typography>
        {!isMobile && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setEditingUser(null);
              setOpenDialog(true);
            }}
          >
            New User
          </Button>
        )}
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={(e) => setFilterName(e.target.value)}
          filterStartDate={filterStartDate}
          onFilterStartDate={setFilterStartDate}
          filterEndDate={filterEndDate}
          onFilterEndDate={setFilterEndDate}
        />

        <Scrollbar>
          {isMobile ? (
            <Stack spacing={2} sx={{ p: 2 }}>
              {dataFiltered.length > 0 ? (
                dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserCard
                      key={row.id}
                      row={row}
                      handleDelete={handleDelete}
                      onEditUser={handleEditUser}
                    />
                  ))
              ) : (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 5 }}>
                  <Typography variant="h6">No Data</Typography>
                  <Typography variant="body2" color="text.secondary">Add some users.</Typography>
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
                  onSelectAllClick={(e) =>
                    setSelected(e.target.checked ? rows.map((r) => r.name) : [])
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'mobile', label: 'Mobile' },
                    { id: 'email', label: 'Email' },
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
                        selected={selected.includes(row.name)}
                        handleClick={() =>
                          setSelected((prev) =>
                            prev.includes(row.name)
                              ? prev.filter((s) => s !== row.name)
                              : [...prev, row.name]
                          )
                        }
                        handleDelete={handleDelete}
                        onEditUser={handleEditUser}
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
          rowsPerPageOptions={[5, 10, 25]}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {isMobile && (
        <Box sx={{ position: 'fixed', bottom: 16, left: 16, right: 16 }}>
          <Button
            fullWidth
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => {
              setEditingUser(null);
              setOpenDialog(true);
            }}
          >
            New User
          </Button>
        </Box>
      )}

      <UserFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        existingData={editingUser}
        onSaved={() => {
          setOpenDialog(false);
          window.location.reload();
        }}
      />
    </Container>
  );
}
