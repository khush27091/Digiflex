import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  Box,
  Grid,
  Stack,
  Button,
  Dialog,
  Container,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function UserFormPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date().toISOString().split('T')[0];
  const existingData = location.state?.formData;

  // ✅ Hydrate photos with previews if editing
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
                photos:
                  area.photos?.map((p) => ({
                    preview: p.preview,
                    file: null,
                  })) || [],
              }))
            : [], // ✅ INITIALLY EMPTY
        }
      : {
          name: '',
          mobile: '',
          address: '',
          measurementDate: today,
          areas: [], // ✅ INITIALLY EMPTY
        }
  );

  const [errors, setErrors] = useState({
    name: '',
    mobile: '',
    address: '',
    areas: [],
  });

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraIndex, setCameraIndex] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();
  const [stream, setStream] = useState(null);

  // ✅ Save draft
  useEffect(() => {
    const serializable = {
      ...formValues,
      areas: formValues.areas.map((area) => ({
        ...area,
        photos: area.photos.map((p) => ({ preview: p.preview })),
      })),
    };
    sessionStorage.setItem('userFormDraft', JSON.stringify(serializable));
  }, [formValues]);

const validateForm = () => {
  let isValid = true;
  const newErrors = { name: '', mobile: '', address: '', areas: [] };

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

  // ✅ Filter out empty measurement rows
  const filteredAreas = formValues.areas.filter(area =>
    area.areaName.trim() || area.height.trim() || area.width.trim()
  );

  newErrors.areas = filteredAreas.map((area) => {
    const areaErrors = {};
    if (!area.areaName.trim()) {
      areaErrors.areaName = 'Area Name is required';
      isValid = false;
    }
    if (!area.height.trim()) {
      areaErrors.height = 'Height is required';
      isValid = false;
    }
    if (!area.width.trim()) {
      areaErrors.width = 'Width is required';
      isValid = false;
    }
    return areaErrors;
  });

  if (filteredAreas.length !== formValues.areas.length) {
    setFormValues({ ...formValues, areas: filteredAreas });
  }

  setErrors(newErrors);
  return isValid;
};

  const handleChange = (index, field, value) => {
    const areas = [...formValues.areas];
    areas[index][field] = value;
    setFormValues({ ...formValues, areas });

    if (errors.areas?.[index]?.[field]) {
      const updatedAreaErrors = [...errors.areas];
      updatedAreaErrors[index] = {
        ...updatedAreaErrors[index],
        [field]: '',
      };
      setErrors({ ...errors, areas: updatedAreaErrors });
    }
  };

  const handleAddPhotos = (index, files) => {
    const areas = [...formValues.areas];
    const newPhotos = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    areas[index].photos = areas[index].photos.concat(newPhotos);
    setFormValues({ ...formValues, areas });
  };

  const handleRemovePhoto = (index, photoIdx) => {
    const areas = [...formValues.areas];
    const photo = areas[index].photos[photoIdx];
    if (photo.preview) {
      URL.revokeObjectURL(photo.preview);
    }
    areas[index].photos.splice(photoIdx, 1);
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
          photos: [],
          notes: '',
        },
      ],
    });
    setErrors({
      ...errors,
      areas: [...errors.areas, {}],
    });
  };

  const handleRemoveRow = (index) => {
    const areas = [...formValues.areas];
    const areaErrors = [...errors.areas];
    areas[index].photos.forEach((p) => {
      if (p.preview) URL.revokeObjectURL(p.preview);
    });
    areas.splice(index, 1);
    areaErrors.splice(index, 1);
    setFormValues({ ...formValues, areas });
    setErrors({ ...errors, areas: areaErrors });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const existingList = JSON.parse(sessionStorage.getItem('userForms') || '[]');
    const index = existingList.findIndex(
      (item) =>
        item.name === formValues.name && item.mobile === formValues.mobile
    );

    const saveData = {
      ...formValues,
      areas: formValues.areas.map((area) => ({
        ...area,
        photos: area.photos.map((p) => ({ preview: p.preview })),
      })),
    };

    if (index !== -1) {
      existingList[index] = saveData;
    } else {
      existingList.push(saveData);
    }

    sessionStorage.setItem('userForms', JSON.stringify(existingList));
    sessionStorage.removeItem('userFormDraft');
    navigate('/user');
  };

  const openCamera = async (index) => {
    setCameraIndex(index);
    setCameraOpen(true);
    try {
      const rearStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } },
      });
      videoRef.current.srcObject = rearStream;
      setStream(rearStream);
    } catch (err) {
      const defaultStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = defaultStream;
      setStream(defaultStream);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraOpen(false);
    setStream(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
        handleAddPhotos(cameraIndex, [file]);
      }
    }, 'image/jpeg');
    closeCamera();
  };

  return (
    <Container>
      <Typography variant="h4" mb={3}>
        {existingData ? 'Edit Measurement' : 'Add New Measurement'}
      </Typography>

      <Stack spacing={3}>
        {/* Basic fields */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
        </Stack>

        <TextField
          label="Customer Address"
          value={formValues.address}
          onChange={(e) => {
            setFormValues({ ...formValues, address: e.target.value });
            if (errors.address) setErrors({ ...errors, address: '' });
          }}
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

        {/* Show areas only if there are any */}
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
                  error={!!errors.areas[index]?.areaName}
                  helperText={errors.areas[index]?.areaName}
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
                  error={!!errors.areas[index]?.height}
                  helperText={errors.areas[index]?.height}
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
                  error={!!errors.areas[index]?.width}
                  helperText={errors.areas[index]?.width}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="outlined" component="label">
                    Upload Photos
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      multiple
                      onChange={(e) => {
                        if (e.target.files.length) {
                          handleAddPhotos(index, e.target.files);
                        }
                      }}
                    />
                  </Button>

                  <Button variant="outlined" onClick={() => openCamera(index)}>
                    Capture Photo
                  </Button>
                </Stack>

                {area.photos.length > 0 && (
                  <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
                    {area.photos.map((photo, photoIdx) => (
                      <Box
                        key={photoIdx}
                        sx={{
                          position: 'relative',
                          width: 120,
                          height: 120,
                          borderRadius: 2,
                          overflow: 'hidden',
                          mr: 2,
                          mb: 2,
                        }}
                      >
                        <img
                          src={photo.preview}
                          alt={`Preview ${index + 1}-${photoIdx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemovePhoto(index, photoIdx)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,1)',
                            },
                          }}
                        >
                          <Iconify icon="eva:close-fill" />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
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
            Save Measurements
          </Button>
        </Stack>
      </Stack>

      <Dialog open={cameraOpen} onClose={closeCamera} maxWidth="md">
        <Box p={2}>
          <video
            ref={videoRef}
            autoPlay
            style={{ width: '100%' }}
            aria-hidden="true"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
            <Button variant="contained" onClick={capturePhoto}>
              Capture
            </Button>
            <Button variant="outlined" onClick={closeCamera}>
              Close
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Container>
  );
}
