import dayjs from 'dayjs';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  row,
  handleDelete,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  console.log('UserTableRow', row);

  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onDeleteConfirmed = () => {
    handleDelete(row.id); 
    handleCloseDialog();
    handleCloseMenu();
  };

  const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
  const baseURL = isMobile
    ? 'https://api.whatsapp.com/send'
    : 'https://web.whatsapp.com/send';

  let whatsappLink = '';

  if (row.selectedUser?.phone) {
    const phone = '91' + row.selectedUser.phone.replace(/[^\d]/g, '');
    const message = `Hello ${row.selectedUser.firstName} ${row.selectedUser.lastName},\n\n` +
      `Here are your measurement appointment details:\n` +
      `👤 Name: ${row.name}\n` +
      `📞 Phone: ${row.mobile}\n` +
      `🏠 Address: ${row.address || 'N/A'}\n` +
      `📅 Date: ${row.measurementDate || 'N/A'}`;
    whatsappLink = `${baseURL}?phone=${phone}&text=${encodeURIComponent(message)}`;
  }



  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell>{row.customer_name}</TableCell>
        <TableCell>{row.customer_mobile}</TableCell>
        <TableCell>
          {row.measurement_date
            ? dayjs(row.measurement_date  , 'YYYY-MM-DD').format('DD/MM/YYYY')
            : ''}
        </TableCell>
        <TableCell>
          {row.user_id
            ? `${row.user_id}`
            : '-'}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openMenu}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >


        {whatsappLink && (
          <MenuItem
            component="a"
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Iconify icon="ic:baseline-whatsapp" sx={{ mr: 2, color: 'green' }} />
            WhatsApp
          </MenuItem>
        )}


        <MenuItem
          onClick={() =>
            navigate('/user/new', {
              state: { formData: row }, // ✅ pass full row
            })
          }
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={handleOpenDialog}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Measurement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{row.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={onDeleteConfirmed}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  selected: PropTypes.any,
  row: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
