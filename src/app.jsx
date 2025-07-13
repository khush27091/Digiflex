/* eslint-disable perfectionist/sort-imports */
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
     <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
    </LocalizationProvider>
  );
}
