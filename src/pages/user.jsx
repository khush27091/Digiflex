import { Helmet } from 'react-helmet-async';

import { ProductsView } from 'src/sections/User Master/view';

// ----------------------------------------------------------------------

export default function userPage() {
  return (
    <>
      <Helmet>
        <title> Users | Digiflex </title>
      </Helmet>

      <ProductsView />
    </>
  );
}
