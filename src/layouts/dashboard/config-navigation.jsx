import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
 {
    title: 'Mesurements',
    path: '/user',
    icon: icon('ic_measurement'),
  },
  {
    title: 'User Management',
    path: '/products',
    icon: icon('ic_user'),
  },
];

export default navConfig;
