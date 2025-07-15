// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Table from '@mui/material/Table';
// import Button from '@mui/material/Button';
// import Container from '@mui/material/Container';
// import TableBody from '@mui/material/TableBody';
// import Typography from '@mui/material/Typography';
// import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';

// import Iconify from 'src/components/iconify';
// import Scrollbar from 'src/components/scrollbar';

// import TableNoData from '../table-no-data';
// import UserTableRow from '../user-table-row';
// import UserTableHead from '../user-table-head';
// import TableEmptyRows from '../table-empty-rows';
// import UserTableToolbar from '../user-table-toolbar';
// import { emptyRows, applyFilter, getComparator } from '../utils';

// // ----------------------------------------------------------------------

// export default function UserPage() {
//   const [page, setPage] = useState(0);
//   const [order, setOrder] = useState('asc');
//   const [selected, setSelected] = useState([]);
//   const [orderBy, setOrderBy] = useState('name');
//   const [filterName, setFilterName] = useState('');
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [filterDate, setFilterDate] = useState(null);

//   const navigate = useNavigate();

//   // ✅ Load ALL measurement forms array (full objects)
//   const savedForms = sessionStorage.getItem('userForms');
//   const savedData = savedForms ? JSON.parse(savedForms) : [];

//   // ✅ Each row keeps the full form object
//   const rows = savedData.map((item, index) => ({
//     id: index + 1,
//     ...item,
//   }));

//   const handleSort = (event, id) => {
//     const isAsc = orderBy === id && order === 'asc';
//     if (id !== '') {
//       setOrder(isAsc ? 'desc' : 'asc');
//       setOrderBy(id);
//     }
//   };

//   const handleSelectAllClick = (event) => {
//     if (event.target.checked) {
//       const newSelecteds = rows.map((n) => n.name);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (event, name) => {
//     const selectedIndex = selected.indexOf(name);
//     let newSelected = [];
//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, name);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1)
//       );
//     }
//     setSelected(newSelected);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setPage(0);
//     setRowsPerPage(parseInt(event.target.value, 10));
//   };

//   const handleFilterByName = (event) => {
//     setPage(0);
//     setFilterName(event.target.value);
//   };

//   const handleFilterByDate = (newDate) => {
//   setPage(0);
//   setFilterDate(newDate);
// };



//   const handleDelete = (name) => {
//     const forms = savedForms ? JSON.parse(savedForms) : [];
//     const updatedForms = forms.filter((form) => form.name !== name);
//     sessionStorage.setItem('userForms', JSON.stringify(updatedForms));
//     window.location.reload();
//   };

//   const dataFiltered = applyFilter({
//     inputData: rows,
//     comparator: getComparator(order, orderBy),
//     filterName,
//     filterDate, // ✅ Pass it!

//   });

//   // ✅ NEW: Show no data when filtered result empty OR rows empty
// const notFound = (!dataFiltered.length && (!!filterName || !!filterDate)) || rows.length === 0;


//   return (
//     <Container>
//       <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
//         <Typography variant="h4">Measurements</Typography>

//         <Button
//           variant="contained"
//           color="inherit"
//           onClick={() => navigate('/user/new')}
//           startIcon={<Iconify icon="eva:plus-fill" />}
//         >
//           New Measurement
//         </Button>
//       </Stack>

//       <Card>
//         <UserTableToolbar
//           numSelected={selected.length}
//           filterName={filterName}
//           filterDate={filterDate}
//           onFilterName={handleFilterByName}
//            onFilterDate={handleFilterByDate}
//         />

//         <Scrollbar>
//           <TableContainer sx={{ overflow: 'unset' }}>
//             <Table sx={{ minWidth: 800 }}>
//               <UserTableHead
//                 order={order}
//                 orderBy={orderBy}
//                 rowCount={rows.length}
//                 numSelected={selected.length}
//                 onRequestSort={handleSort}
//                 onSelectAllClick={handleSelectAllClick}
//                 headLabel={[
//                   { id: 'name', label: 'Name' },
//                   { id: 'mobile', label: 'Mobile' },
//                   { id: 'measurementDate', label: 'Date' },
//                   { id: '' },
//                 ]}
//               />
//               <TableBody>
//                 {dataFiltered
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row) => (
//                     <UserTableRow
//                       key={row.id}
//                       row={row}
//                       selected={selected.indexOf(row.name) !== -1}
//                       handleClick={(event) => handleClick(event, row.name)}
//                       handleDelete={handleDelete}
//                     />
//                   ))}

//                 <TableEmptyRows
//                   height={77}
//                   emptyRows={emptyRows(page, rowsPerPage, rows.length)}
//                 />

//                 {notFound && <TableNoData query={filterName} />}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Scrollbar>

//         <TablePagination
//           page={page}
//           component="div"
//           count={rows.length}
//           rowsPerPage={rowsPerPage}
//           onPageChange={handleChangePage}
//           rowsPerPageOptions={[5, 10, 25]}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Card>
//     </Container>
//   );
// }
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

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

  // ✅ NEW: Start and End Date states for range filter
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);

  const navigate = useNavigate();

  // ✅ Load ALL measurement forms array (full objects)
  const savedForms = sessionStorage.getItem('userForms');
  const savedData = savedForms ? JSON.parse(savedForms) : [];

  // ✅ Each row keeps the full form object
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

  // ✅ NEW: Two separate handlers for Start and End Date
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

  // ✅ Show no data when result empty or rows empty
  const notFound = (
    !dataFiltered.length &&
    (!!filterName || !!filterStartDate || !!filterEndDate)
  ) || rows.length === 0;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Measurements</Typography>

        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate('/user/new')}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Measurement
        </Button>
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
    </Container>
  );
}
