import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { Dialog, DialogTitle , DialogContent, DialogActions } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openForgotDialog, setOpenForgotDialog] = useState(false);
const [currentPwd, setCurrentPwd] = useState('');
const [newPwd, setNewPwd] = useState('');
const [forgotPwdError, setForgotPwdError] = useState('');
const [forgotLoading, setForgotLoading] = useState(false);
const [showCurrentPwd, setShowCurrentPwd] = useState(false);
const [showNewPwd, setShowNewPwd] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return '';
  };

  

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    return '';
  };

  // const handleClick = () => {
  //   const emailErr = validateEmail(email);
  //   const passwordErr = validatePassword(password);

  //   setEmailError(emailErr);
  //   setPasswordError(passwordErr);

  //   if (emailErr || passwordErr) {
  //     return; // Don’t continue if validation fails
  //   }

  //   setLoading(true);
  //   setError('');

  //   // Simulated static login credentials
  //   const validEmail = 'admin@demo.com';
  //   const validPassword = 'admin123';

  //   setTimeout(() => {
  //     if (email === validEmail && password === validPassword) {
  //       // Simulate token storage
  //       sessionStorage.setItem('accessToken', 'fake_token_123');

  //       // Redirect to dashboard
  //       router.push('/');
  //     } else {
  //       setError('Invalid email or password');
  //       setLoading(false);
  //     }
  //   }, 1000); // Simulate network delay
  // };
const handleClick = () => {
  const emailErr = validateEmail(email);
  const passwordErr = validatePassword(password);

  setEmailError(emailErr);
  setPasswordError(passwordErr);

  if (emailErr || passwordErr) {
    return; // Don’t continue if validation fails
  }

  setLoading(true);
  setError('');

  const loginToBackend = async () => {
    try {
      const response = await fetch('https://digiflex-backend.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const user = await response.json();

      // Store token/user data in sessionStorage
      sessionStorage.setItem('accessToken', user.token || 'dummy_token');
      sessionStorage.setItem('user', JSON.stringify(user));
      
      router.push('/');
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  loginToBackend();
};


  const renderForm = (
    <>
      <Stack spacing={2}>
       <TextField
  name="email"
  label="Email address"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    setError(''); // Clear general error on typing
    setEmailError(''); // Optional: Clear field-specific error as well
  }}
  error={Boolean(emailError)}
  helperText={emailError}
/>

<TextField
  name="password"
  label="Password"
  type={showPassword ? 'text' : 'password'}
  value={password}
  onChange={(e) => {
    setPassword(e.target.value);
    setError('');
    setPasswordError('');
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  }}
  error={Boolean(passwordError)}
  helperText={passwordError}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>


 
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <LoadingButton
        sx={{ my: 3 }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={loading}
        onClick={handleClick}
      >
        Login
      </LoadingButton>
 <Box textAlign="right">
  <Typography
    variant="body2"
    sx={{ cursor: 'pointer', color: 'primary.main' }}
    onClick={() => {
      if (email.trim()) {
        setOpenForgotDialog(true);
        setForgotPwdError('');
        setCurrentPwd('');
        setNewPwd('');
      } else {
        setForgotPwdError('Please enter your email first.');
      }
    }}
  >
    Reset password
  </Typography>
  {forgotPwdError && (
    <Typography variant="caption" color="error">
      {forgotPwdError}
    </Typography>
  )}
</Box>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.1),
          imgUrl: '/assets/background/overlay_3.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack
  alignItems="center"
  justifyContent="center"
  sx={{
    height: 1,
    px: { xs: 2, sm: 3, md: 0 }, // Horizontal padding on mobile
    py: { xs: 2, sm: 3, md: 0 }, // Optional: Vertical padding
  }}
>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Digiflex</Typography>

          <Divider sx={{ my: 3 }} />

          {renderForm}
        </Card>
      </Stack>

      <Dialog open={openForgotDialog} onClose={() => setOpenForgotDialog(false)}>
  <DialogTitle>Reset Password</DialogTitle>
  <DialogContent dividers sx={{ pt: 2, px: 3 }}>
    <Stack spacing={2}>
<TextField
  fullWidth
  label="Current Password"
  type={showCurrentPwd ? 'text' : 'password'}
  value={currentPwd}
  onChange={(e) => setCurrentPwd(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowCurrentPwd(!showCurrentPwd)} edge="end">
          <Iconify icon={showCurrentPwd ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

<TextField
  fullWidth
  label="New Password"
  type={showNewPwd ? 'text' : 'password'}
  value={newPwd}
  onChange={(e) => setNewPwd(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowNewPwd(!showNewPwd)} edge="end">
          <Iconify icon={showNewPwd ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

    </Stack>
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <LoadingButton
      loading={forgotLoading}
      variant="contained"
      onClick={async () => {
        if (!currentPwd || !newPwd) {
          setForgotPwdError('Please fill both fields');
          return;
        }

        setForgotPwdError('');
        setForgotLoading(true);

        try {
          const res = await fetch('https://digiflex-backend.up.railway.app/api/users/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, oldPassword: currentPwd, newPassword: newPwd }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Password reset failed');

          setOpenForgotDialog(false);
        } catch (err) {
          setForgotPwdError(err.message);
        } finally {
          setForgotLoading(false);
        }
      }}
    >
      Submit
    </LoadingButton>
  </DialogActions>

  {forgotPwdError && (
    <Box px={3} pb={2}>
      <Alert severity="error">{forgotPwdError}</Alert>
    </Box>
  )}
</Dialog>
    </Box>

    
  );
}
