import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


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
  if (a[orderBy] === null) return 1;
  if (b[orderBy] === null) return -1;
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filtered = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    filtered = filtered.filter(
      (user) =>
        user.customer_name?.toLowerCase().includes(filterName.toLowerCase()) ||
        user.customer_mobile?.toLowerCase().includes(filterName.toLowerCase()) ||
        user.customer_address?.toLowerCase().includes(filterName.toLowerCase())
    );
  }

 if (filterStartDate || filterEndDate) {
  filtered = filtered.filter((user) => {
    if (!user.measurement_date) return false;

    const userDate = dayjs(user.measurement_date).startOf('day');
    const startDate = filterStartDate ? dayjs(filterStartDate).startOf('day') : null;
    const endDate = filterEndDate ? dayjs(filterEndDate).endOf('day') : null;

    if (!userDate.isValid()) return false;

    const afterStart = startDate ? userDate.isSameOrAfter(startDate) : true;
    const beforeEnd = endDate ? userDate.isSameOrBefore(endDate) : true;

    return afterStart && beforeEnd;
  });
}
  

  return filtered;
}