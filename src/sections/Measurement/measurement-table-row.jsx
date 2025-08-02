import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useState , useEffect} from 'react';
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
  const [userDetails, setUserDetails] = useState(null);


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

  useEffect(() => {
  const fetchUserDetails = async () => {
    if (row.user_id) {
      try {
        const response = await fetch(`https://digiflex-backend.up.railway.app/api/users/${row.user_id}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };

  fetchUserDetails();
}, [row.user_id]);


  const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
  const baseURL = isMobile
    ? 'https://api.whatsapp.com/send'
    : 'https://web.whatsapp.com/send';

let whatsappLink = '';

if (userDetails?.phone) {
  const phone = '91' + userDetails.phone.replace(/[^\d]/g, '');
  const message = `Hello ${userDetails.first_name} ${userDetails.last_name},\n\n` +
    `Here are your measurement appointment details:\n` +
    `👤 Name: ${row.customer_name}\n` +
    `📞 Phone: ${row.customer_mobile}\n` +
    `🏠 Address: ${row.customer_address || 'N/A'}\n` +
    `📅 Date: ${
      row.measurement_date
        ? dayjs(row.measurement_date).format('DD/MM/YYYY')
        : 'N/A'
    }`;
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
  {userDetails
    ? `${userDetails.first_name} ${userDetails.last_name} (${userDetails.phone})`
    : 'Loading...'}
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
            navigate('/dashboard/user/new', {
              state: { id: row.id }, // ✅ pass full row
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
