
import {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Box,
  Card,
  Stack,
  Table,
  Button,
  Container,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import UserCard from '../MeasurementCard';
import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-rows';
import UserTableRow from '../measurement-table-row';
import UserTableHead from '../measurement-table-head';
import UserTableToolbar from '../measurement-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const res = await fetch('https://digiflex-backend.up.railway.app/api/measurements');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch measurements', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://digiflex-backend.up.railway.app/api/measurements/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchMeasurements();
    } catch (err) {
      console.error(err);
      alert('Failed to delete. Check console.');
    }
  };

  const rows = data.map((item, index) => ({
    id: item.id || index + 1,
    ...item,
  }));

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const dataFiltered = applyFilter({
    inputData: rows,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStartDate,
    filterEndDate,
  });

  const notFound = !dataFiltered.length && (!!filterName || !!filterStartDate || !!filterEndDate);

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5}>
        <Typography variant="h4">Measurements</Typography>
        {!isMobile && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => navigate('/dashboard/user/new')}
          >
            New Measurement
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
                    <UserCard key={row.id} row={row} handleDelete={() => handleDelete(row.id)} />
                  ))
              ) : (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 5 }}>
                  <Typography variant="h6">No Data</Typography>
                  <Typography variant="body2" color="text.secondary">
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
                  onSelectAllClick={(e) =>
                    setSelected(e.target.checked ? rows.map((r) => r.name) : [])
                  }
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
                        selected={selected.includes(row.name)}
                        handleClick={(e) =>
                          setSelected((prev) =>
                            prev.includes(row.name)
                              ? prev.filter((s) => s !== row.name)
                              : [...prev, row.name]
                          )
                        }
                        handleDelete={() => handleDelete(row.id)}
                      />
                    ))}
                  <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, rows.length)} />
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
            onClick={() => navigate('/dashboard/user/new')}
          >
            New Measurement
          </Button>
        </Box>
      )}
    </Container>
  );
}
