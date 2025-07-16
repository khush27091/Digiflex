import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Stack,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';

export default function UserFormPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const existingData = location.state?.formData;

  const [formValues, setFormValues] = useState(
    existingData
      ? {
          name: existingData.name || '',
          mobile: existingData.mobile || '',
        }
      : {
          name: '',
          mobile: '',
        }
  );

  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
  });

  // ✅ Save draft to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('userFormDraft', JSON.stringify(formValues));
  }, [formValues]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', mobile: '' };

    if (!formValues.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!formValues.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!mobileRegex.test(formValues.mobile)) {
      newErrors.mobile = 'Enter a valid 10-digit number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const existingList = JSON.parse(sessionStorage.getItem('userForms') || '[]');
    const index = existingList.findIndex(
      (item) =>
        item.name === formValues.name && item.mobile === formValues.mobile
    );

    if (index !== -1) {
      existingList[index] = formValues;
    } else {
      existingList.push(formValues);
    }

    sessionStorage.setItem('userForms', JSON.stringify(existingList));
    sessionStorage.removeItem('userFormDraft');
    navigate('/user');
  };

  return (
    <Container>
      <Typography variant="h4" mb={3}>
        {existingData ? 'Edit User' : 'Add New User'}
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Customer Name"
          value={formValues.name}
          onChange={(e) => {
            setFormValues({ ...formValues, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          fullWidth
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          label="Customer Mobile"
          value={formValues.mobile}
          onChange={(e) => {
            setFormValues({ ...formValues, mobile: e.target.value });
            if (errors.mobile) setErrors({ ...errors, mobile: '' });
          }}
          fullWidth
          error={!!errors.mobile}
          helperText={errors.mobile}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/user')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save User
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
