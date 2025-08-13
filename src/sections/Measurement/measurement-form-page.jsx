
import dayjs from 'dayjs';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
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
  Autocomplete,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function UserFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [existingData, setExistingData] = useState([]);
  const measurementId = location.state?.id;
  const currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
const isNormalUser = currentUser.role === 'normal';
const isApproved = existingData?.status === 'approved';

  
  useEffect(() => {
    if (measurementId) {
      fetch(`https://digiflex-backend.up.railway.app/api/measurements/${measurementId}`)
        .then((res) => res.json())
        .then((data) => {
          setExistingData(data);
        })
        .catch((err) => {
          console.error('Failed to fetch measurement:', err);
        });
    }
  }, [measurementId]);


  const today = dayjs().format('YYYY-MM-DD');
  const [formValues, setFormValues] = useState({
    name: '',
    mobile: '',
    address: '',
    measurementDate: today,
    selectedUser: null,
    areas: [],
  });

  useEffect(() => {
    if (existingData && existingData.id) {
      const matchedUser =
        existingData.selectedUser || (existingData.user_id ? { id: existingData.user_id } : null);

      const updatedFormValues = {
        id: existingData.id,
        name: existingData.customer_name || '',
        mobile: existingData.customer_mobile || '',
        address: existingData.customer_address || '',
        measurementDate:
          typeof existingData.measurement_date === 'string'
            ? existingData.measurement_date.slice(0, 10)
            : today,
        selectedUser: matchedUser,
        areas: (existingData.areas || []).map((area) => ({
          areaName: area.area_name || '',
          height: area.height?.toString?.() || '',
          width: area.width?.toString?.() || '',
          notes: area.notes || '',
          photos: (area.photo_urls || []).map((url) => ({
            preview: url.startsWith('http') ? url : `https://digiflex-backend.up.railway.app/${url}`,
            file: null,
          })),
        })),
      };

      setFormValues(updatedFormValues);
    }
  }, [existingData, today]);

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (existingData?.user_id) {
        try {
          const res = await fetch(`https://digiflex-backend.up.railway.app/api/users/${existingData.user_id}`);
          if (!res.ok) throw new Error('Failed to fetch selected user');
          const userData = await res.json();
          setFormValues(prev => ({
            ...prev,
            selectedUser: userData,
          }));
        } catch (error) {
          console.error('Error fetching selected user:', error);
        }
      }
    };

    fetchSelectedUser();
  }, [existingData]);



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
  const [userOptions, setUserOptions] = useState([]);


  useEffect(() => {
const fetchUsers = async () => {
  try {
    const response = await fetch('https://digiflex-backend.up.railway.app/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    
    // Only include users with role === 'normal'
    const filtered = data.filter((user) => user.role === 'normal');
    
    setUserOptions(filtered);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

    fetchUsers();
  }, []);




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
  const validPhotos = [];

  Array.from(files).forEach((file) => {
    if (file.size <= 102400) { // 100 KB in bytes
      validPhotos.push({
        file,
        preview: URL.createObjectURL(file),
      });
    } else {
      alert(`"${file.name}" exceeds 100 KB and will not be uploaded.`);
    }
  });

  areas[index].photos = areas[index].photos.concat(validPhotos);
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const areasWithUploadedPhotos = await Promise.all(
        formValues.areas.map(async (area) => {
          const photoUrls = await Promise.all(
            area.photos.map(async (p) => {
              if (p.file) {
                const formData = new FormData();
                formData.append('photos', p.file);
                const res = await fetch('https://digiflex-backend.up.railway.app/api/uploads/upload', {
                  method: 'POST',
                  body: formData,
                });
                if (!res.ok) throw new Error('Photo upload failed');
                const result = await res.json();
                return result.photo_urls[0];
              }
              return p.preview || '';
            })
          );

          return {
            area_name: area.areaName,
            height: parseFloat(area.height),
            width: parseFloat(area.width),
            notes: area.notes || '',
            photo_urls: photoUrls,
          };
        })
      );

      const payload = {
        customer_name: formValues.name,
        customer_mobile: formValues.mobile,
        customer_address: formValues.address,
        measurement_date: formValues.measurementDate,
        user_id: formValues.selectedUser?.user_id,
        areas: areasWithUploadedPhotos,
      };

const method = measurementId ? 'PUT' : 'POST';
const url = measurementId
  ? `https://digiflex-backend.up.railway.app/api/measurements/${measurementId}`
  : 'https://digiflex-backend.up.railway.app/api/measurements';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save measurement');

      sessionStorage.removeItem('userFormDraft');
      navigate('/dashboard/user');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save measurement. Please check console.');
    }
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

  const compressAndAdd = (quality) => {
    canvas.toBlob((blob) => {
      if (blob) {
        if (blob.size <= 102400) {
          const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
          handleAddPhotos(cameraIndex, [file]);
          closeCamera();
        } else if (quality > 0.1) {
          // keep compressing
          compressAndAdd(quality - 0.05);
        } else {
          alert('Unable to compress photo below 100 KB.');
          closeCamera();
        }
      }
    }, 'image/jpeg', quality);
  };

  // start at 0.9 quality, go down if needed
  compressAndAdd(0.9);
};

  return (
    <Container maxWidth="xl">
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
            disabled={isNormalUser || isApproved}
            
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
            disabled={isNormalUser || isApproved}
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
           disabled={isNormalUser || isApproved}
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Autocomplete
            options={userOptions}
            getOptionLabel={(option) =>
              option?.first_name && option?.last_name
                ? `${option.first_name} ${option.last_name} - ${option.phone}`
                : ''
            }
            isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
            value={formValues.selectedUser}
            onChange={(event, newValue) => {
              setFormValues({ ...formValues, selectedUser: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} label="User" placeholder="Search by name or phone" />
            )}
            fullWidth
             disabled={isNormalUser || isApproved}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Measurement Date"
              value={dayjs(formValues.measurementDate)}
              onChange={(newValue) =>
                setFormValues({ ...formValues, measurementDate: newValue?.format('YYYY-MM-DD') || '' })
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  disabled: isNormalUser || isApproved,
                },
              }}

            />
          </LocalizationProvider>


        </Stack>
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
                disabled={isApproved}
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
                disabled={isApproved}
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
                disabled={isApproved}
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
                disabled={isApproved}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button variant="outlined" component="label" 
                disabled={isApproved}>
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

                  <Button variant="outlined" onClick={() => openCamera(index)} 
                disabled={isApproved}>
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
                disabled={isApproved}
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
                disabled={isApproved}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          variant="contained"
          onClick={handleAddRow}
          startIcon={<Iconify icon="eva:plus-fill" />}
                disabled={isApproved}
        >
          Add Row
        </Button>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={() => navigate('/dashboard/user')}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} 
                disabled={isApproved}>
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
