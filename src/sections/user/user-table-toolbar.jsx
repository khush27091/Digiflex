import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Iconify from 'src/components/iconify';

export default function UserTableToolbar({
  numSelected,
  filterName,
  onFilterName,
  filterStartDate,
  onFilterStartDate,
  filterEndDate,
  onFilterEndDate,
}) {
  return (
    <Toolbar
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 2,
        px: 3,
        py: 2,
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ width: '100%' }}
      >
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search by Name and phone number..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
          fullWidth
          sx={{ height: 56 }}
        />

        <DatePicker
          label="Start Date"
          value={filterStartDate}
          onChange={onFilterStartDate}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              size: 'medium',
              sx: {
                height: 56,
                '& .MuiInputBase-root': {
                  height: '100%',
                },
              },
            },
          }}
        />

        <DatePicker
          label="End Date"
          value={filterEndDate}
          onChange={onFilterEndDate}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              size: 'medium',
              sx: {
                height: 56,
                '& .MuiInputBase-root': {
                  height: '100%',
                },
              },
            },
          }}
        />
      </Stack>
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterStartDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  onFilterStartDate: PropTypes.func,
  filterEndDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  onFilterEndDate: PropTypes.func,
};
