import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Box,
  Grid,
  Stack,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function UserFormPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date().toISOString().split('T')[0];

  const existingData = location.state?.formData;

  // ✅ Initial form state with photoPreview logic
  const [formValues, setFormValues] = useState(
    existingData
      ? {
          name: existingData.name || '',
          mobile: existingData.mobile || '',
          address: existingData.address || '',
          measurementDate: existingData.measurementDate || today,
          areas: existingData.areas?.length
            ? existingData.areas.map((area) => ({
                ...area,
                photo: null, // can't store file
                photoPreview: area.photoPreview || area.photoUrl || null,
              }))
            : [
                {
                  areaName: '',
                  height: '',
                  width: '',
                  photo: null,
                  photoPreview: null,
                  notes: '',
                },
              ],
        }
      : {
          name: '',
          mobile: '',
          address: '',
          measurementDate: today,
          areas: [
            {
              areaName: '',
              height: '',
              width: '',
              photo: null,
              photoPreview: null,
              notes: '',
            },
          ],
        }
  );

  // ✅ Validation error state
  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    address: '',
  });

  // ✅ Save draft to sessionStorage
  useEffect(() => {
    const serializable = {
      ...formValues,
      areas: formValues.areas.map((area) => ({
        ...area,
        photo: null, // exclude file
      })),
    };
    sessionStorage.setItem('userFormDraft', JSON.stringify(serializable));
  }, [formValues]);

  // ✅ Validate before submit
  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', mobile: '', address: '' };

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

    if (!formValues.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (index, field, value) => {
    const areas = [...formValues.areas];

    if (field === 'photo') {
      if (areas[index].photoPreview) {
        URL.revokeObjectURL(areas[index].photoPreview);
      }

      areas[index][field] = value;
      areas[index].photoPreview = URL.createObjectURL(value);
    } else {
      areas[index][field] = value;
    }

    setFormValues({ ...formValues, areas });
  };

  const handleAddRow = () => {
    setFormValues({
      ...formValues,
      areas: [
        ...formValues.areas,
        {
          areaName: '',
          height: '',
          width: '',
          photo: null,
          photoPreview: null,
          notes: '',
        },
      ],
    });
  };

  const handleRemoveRow = (index) => {
    const areas = [...formValues.areas];
    if (areas[index].photoPreview) {
      URL.revokeObjectURL(areas[index].photoPreview);
    }
    areas.splice(index, 1);
    setFormValues({ ...formValues, areas });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    console.log('Submitting form:', formValues);

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
        {existingData ? 'Edit Measurement' : 'Add New Measurement'}
      </Typography>

      <Stack spacing={3}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Customer Name"
            value={formValues.name}
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.target.value })
            }
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            label="Customer Mobile"
            value={formValues.mobile}
            onChange={(e) =>
              setFormValues({ ...formValues, mobile: e.target.value })
            }
            fullWidth
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
        </Stack>

        <TextField
          label="Customer Address"
          value={formValues.address}
          onChange={(e) =>
            setFormValues({ ...formValues, address: e.target.value })
          }
          fullWidth
          error={!!errors.address}
          helperText={errors.address}
        />

        <TextField
          label="Measurement Date"
          type="date"
          value={formValues.measurementDate}
          onChange={(e) =>
            setFormValues({ ...formValues, measurementDate: e.target.value })
          }
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        {formValues.areas.map((area, index) => (
          <Box key={index} p={2} border="1px dashed #ccc" borderRadius={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle1">
                Measurement {index + 1}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveRow(index)}
                startIcon={<Iconify icon="eva:trash-2-outline" />}
                disabled={formValues.areas.length === 1}
              >
                Delete
              </Button>
            </Stack>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Area Name"
                  value={area.areaName}
                  onChange={(e) =>
                    handleChange(index, 'areaName', e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Height (inches)"
                  value={area.height}
                  onChange={(e) =>
                    handleChange(index, 'height', e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Width (inches)"
                  value={area.width}
                  onChange={(e) =>
                    handleChange(index, 'width', e.target.value)
                  }
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" component="label">
                  Upload Photo
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleChange(index, 'photo', e.target.files[0]);
                      }
                    }}
                  />
                </Button>

                {area.photoPreview && (
                  <Box mt={2}>
                    <img
                      src={area.photoPreview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        maxWidth: '200px',
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  value={area.notes}
                  onChange={(e) =>
                    handleChange(index, 'notes', e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid> 
          </Box>
        ))}

        <Button
          variant="contained"
          onClick={handleAddRow}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          Add Row
        </Button>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/user')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {existingData ? 'Edit Measurements' : 'Save Measurements'}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
