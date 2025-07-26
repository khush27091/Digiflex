import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
  Stack,
  Button,
  Dialog,
  MenuItem,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export default function UserFormDialog({ open, onClose, existingData, onSaved }) {
  const isEdit = !!existingData;

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'normal',
  });

  const [errors, setErrors] = useState({ firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    if (isEdit) {
      setFormValues({
        firstName: existingData.first_name || '',
        lastName: existingData.last_name || '',
        email: existingData.email || '',
        phone: existingData.phone || '',
        role: existingData.role || 'normal',
        password: '', // Do not prefill password
      });
    } else {
      setFormValues({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'normal',
      });
    }
}, [existingData, isEdit]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { firstName: '', lastName: '', phone: '' };

    if (!formValues.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    if (!formValues.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!/^\d{10}$/.test(formValues.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        first_name: formValues.firstName,
        last_name: formValues.lastName,
        email: formValues.email,
        phone: formValues.phone,
        role: formValues.role,
      };

      if (!isEdit) {
        payload.password_hash = formValues.password || 'static@123'; // static fallback
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create user');
      } else {
        const response = await fetch(`/api/users/${existingData.user_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to update user');
      }

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving user. Please check console.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            label="First Name"
            value={formValues.firstName}
            onChange={(e) => setFormValues({ ...formValues, firstName: e.target.value })}
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            label="Last Name"
            value={formValues.lastName}
            onChange={(e) => setFormValues({ ...formValues, lastName: e.target.value })}  
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            label="Email"
            value={formValues.email}
            onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Phone"
            value={formValues.phone}
            onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
          />
          {!isEdit && (
            <TextField
              label="Password"
              type="password"
              value={formValues.password}
              onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
              fullWidth
            />
          )}
          <TextField
            select
            label="Role"
            value={formValues.role}
            onChange={(e) => setFormValues({ ...formValues, role: e.target.value })}
            fullWidth
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save User
        </Button>
      </DialogActions>
    </Dialog>
  );
}

UserFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  existingData: PropTypes.object,
  onSaved: PropTypes.func,
};
