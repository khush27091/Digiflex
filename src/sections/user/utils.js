import dayjs from 'dayjs'; // ✅ Make sure you have dayjs installed

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName, filterDate }) {
  // Sort rows
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filtered = stabilizedThis.map((el) => el[0]);

  // ✅ Filter by name/mobile/date string search
  if (filterName) {
    filtered = filtered.filter(
      (user) =>
        user.name?.toLowerCase().includes(filterName.toLowerCase()) ||
        user.mobile?.toLowerCase().includes(filterName.toLowerCase()) ||
        user.measurementDate?.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  // ✅ Filter by exact date
  if (filterDate) {
    filtered = filtered.filter((user) => {
      const userDate = dayjs(user.measurementDate).format('YYYY-MM-DD');
      const selectedDate = dayjs(filterDate).format('YYYY-MM-DD');
      return userDate === selectedDate;
    });
  }

  return filtered;
}
