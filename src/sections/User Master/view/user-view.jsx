import { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableCell,
  Container,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import UserCard from '../UserCard';
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
  const [users, setUsers] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://digiflex-backend.up.railway.app/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://digiflex-backend.up.railway.app/api/users/${id}`, {
        method: 'DELETE',
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleSort = (e, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStartDate,
    filterEndDate,
  });

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
                      key={row.user_id}
                      row={row}
                      handleDelete={() => handleDelete(row.user_id)}
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
                  rowCount={users.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={(e) =>
                    setSelected(e.target.checked ? users.map((r) => r.firstName + ' ' + r.lastName) : [])
                  }
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'mobile', label: 'Mobile' },
                    { id: 'email', label: 'Email' },
                    { id: 'role', label: 'Role' },
                    { id: '' },
                  ]}
                />

                <TableBody>
                  {dataFiltered.length > 0 ? (
                    dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <UserTableRow
                          key={row.user_id}
                          row={row}
                          selected={selected.includes(row.firstName + ' ' + row.lastName)}
                          handleClick={() =>
                            setSelected((prev) =>
                              prev.includes(row.firstName + ' ' + row.lastName)
                                ? prev.filter((s) => s !== row.firstName + ' ' + row.lastName)
                                : [...prev, row.firstName + ' ' + row.lastName]
                            )
                          }
                          handleDelete={() => handleDelete(row.user_id)}
                          onEditUser={handleEditUser}
                        />
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                        <Typography variant="h6">No Data</Typography>
                        <Typography variant="body2" color="text.secondary">Add some users.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, users.length)}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
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
          fetchUsers(); // ✅ Refresh user list after save
        }}
      />
    </Container>
  );
}
