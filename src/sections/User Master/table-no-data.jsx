import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  const hasQuery = query && query.trim() !== '';

  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6" paragraph>
            {hasQuery ? 'Not found' : 'No Data'}
          </Typography>

          {hasQuery ? (
            <Typography variant="body2">
              No results found for &nbsp;
              <strong>&quot;{query}&quot;</strong>.
              <br /> Try checking for typos or using complete words.
            </Typography>
          ) : (
            <Typography variant="body2">
              There is no data available.
              <br /> Please add new measurements.
            </Typography>
          )}
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
