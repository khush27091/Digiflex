// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// import {
//   Stack,
//   Button,
//   Dialog,
//   TextField,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from '@mui/material';

// export default function UserFormDialog() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const existingData = location.state?.formData;

//   const [formValues, setFormValues] = useState(
//     existingData
//       ? {
//           firstName: existingData.firstName || '',
//           lastName: existingData.lastName || '',
//           email: existingData.email || '',
//           phone: existingData.phone || '',
//         }
//       : {
//           firstName: '',
//           lastName: '',
//           email: '',
//           phone: '',
//         }
//   );

//   const [errors, setErrors] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//   });

//   // Save draft to sessionStorage under masteruserDraft
//   useEffect(() => {
//     sessionStorage.setItem('masteruserDraft', JSON.stringify(formValues));
//   }, [formValues]);

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = { firstName: '', lastName: '', phone: '' };

//     if (!formValues.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//       isValid = false;
//     }

//     if (!formValues.lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//       isValid = false;
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!formValues.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//       isValid = false;
//     } else if (!phoneRegex.test(formValues.phone)) {
//       newErrors.phone = 'Enter a valid 10-digit number';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = () => {
//     if (!validateForm()) return;

//     const existingList = JSON.parse(sessionStorage.getItem('masteruser') || '[]');
//     const index = existingList.findIndex(
//       (item) =>
//         item.firstName === formValues.firstName &&
//         item.lastName === formValues.lastName &&
//         item.phone === formValues.phone
//     );

//     if (index !== -1) {
//       existingList[index] = formValues;
//     } else {
//       existingList.push(formValues);
//     }

//     sessionStorage.setItem('masteruser', JSON.stringify(existingList));
//     sessionStorage.removeItem('masteruserDraft');
//     navigate('/products');
//   };

//   const handleClose = () => {
//     navigate('/products');
//   };

//   return (
//     <Dialog open fullWidth maxWidth="sm">
//       <DialogTitle>{existingData ? 'Edit User' : 'Add New User'}</DialogTitle>
//       <DialogContent>
//         <Stack spacing={3} mt={1}>
//           <TextField
//             label="First Name"
//             value={formValues.firstName}
//             onChange={(e) => {
//               setFormValues({ ...formValues, firstName: e.target.value });
//               if (errors.firstName) setErrors({ ...errors, firstName: '' });
//             }}
//             fullWidth
//             error={!!errors.firstName}
//             helperText={errors.firstName}
//           />

//           <TextField
//             label="Last Name"
//             value={formValues.lastName}
//             onChange={(e) => {
//               setFormValues({ ...formValues, lastName: e.target.value });
//               if (errors.lastName) setErrors({ ...errors, lastName: '' });
//             }}
//             fullWidth
//             error={!!errors.lastName}
//             helperText={errors.lastName}
//           />

//           <TextField
//             label="Email"
//             value={formValues.email}
//             onChange={(e) => {
//               setFormValues({ ...formValues, email: e.target.value });
//             }}
//             fullWidth
//           />

//           <TextField
//             label="Phone Number"
//             value={formValues.phone}
//             onChange={(e) => {
//               setFormValues({ ...formValues, phone: e.target.value });
//               if (errors.phone) setErrors({ ...errors, phone: '' });
//             }}
//             fullWidth
//             error={!!errors.phone}
//             helperText={errors.phone}
//           />
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 2 }}>
//         <Button variant="outlined" onClick={handleClose}>
//           Cancel
//         </Button>
//         <Button variant="contained" onClick={handleSubmit}>
//           Save User
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
// src/sections/User Master/UserFormDialog.jsx
import PropTypes from 'prop-types';
import {useState,  useEffect} from 'react';

import {
  Stack, 
  Button, 
  Dialog,
  TextField, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  
} from '@mui/material';

export default function UserFormDialog({ open, onClose, existingData, onSaved }) {
const [formValues, setFormValues] = useState({
  firstName: existingData?.firstName || '',
  lastName: existingData?.lastName || '',
  email: existingData?.email || '',
  phone: existingData?.phone || '',
});


  const [errors, setErrors] = useState({ firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    if (existingData) {
      setFormValues({
        firstName: existingData.firstName || '',
        lastName: existingData.lastName || '',
        email: existingData.email || '',
        phone: existingData.phone || '',
      });
    } else {
      setFormValues({ firstName: '', lastName: '', email: '', phone: '' });
    }
  }, [existingData]);

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

  const handleSubmit = () => {
    if (!validateForm()) return;

    const existing = JSON.parse(sessionStorage.getItem('masteruser') || '[]');
    const index = existing.findIndex(
      (u) => u.phone === formValues.phone
    );

    if (index !== -1) {
      existing[index] = formValues;
    } else {
      existing.push(formValues);
    }

    sessionStorage.setItem('masteruser', JSON.stringify(existing));
    if (onSaved) onSaved();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{existingData ? 'Edit User' : 'Add New User'}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={1}>
          <TextField
            label="First Name"
            value={formValues.firstName}
            onChange={(e) =>
              setFormValues({ ...formValues, firstName: e.target.value })
            }
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            label="Last Name"
            value={formValues.lastName}
            onChange={(e) =>
              setFormValues({ ...formValues, lastName: e.target.value })
            }
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            label="Email"
            value={formValues.email}
            onChange={(e) =>
              setFormValues({ ...formValues, email: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Phone"
            value={formValues.phone}
            onChange={(e) =>
              setFormValues({ ...formValues, phone: e.target.value })
            }
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save User</Button>
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
