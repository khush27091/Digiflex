import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  Popover,
  MenuItem,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function UserCard({ row, handleDelete }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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
    handleDelete(row.name);
    handleCloseDialog();
    handleCloseMenu();
  };

  return (
    <>
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6">{row.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Measurement Date: {row.measurementDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile: {row.mobile}
              </Typography>
            </Box>

            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>

        </Stack>
      </Card>

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
        <MenuItem
          onClick={() => {
            navigate('/user/new', {
              state: { formData: row },
            });
            handleCloseMenu();
          }}
        >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleOpenDialog} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Delete Measurement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{row.name}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={onDeleteConfirmed} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserCard.propTypes = {
  row: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
