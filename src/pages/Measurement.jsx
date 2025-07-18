import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/Measurement/view';

// ----------------------------------------------------------------------

export default function MeasurementPage() {
  return (
    <>
      <Helmet>
        <title> Measurements | Digiflex </title>
      </Helmet>

      <UserView />
    </>
  );
}
