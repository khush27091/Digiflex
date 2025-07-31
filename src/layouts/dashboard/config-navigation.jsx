import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);
const user = JSON.parse(sessionStorage.getItem('user') || '{}');

const navConfig = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
 {
    title: 'Measurements',
    path: '/user',
    icon: icon('ic_measurement'),
  },
  user.role === 'admin' && {
    title: 'User Management',
    path: '/products',
    icon: icon('ic_user'),
  },
];

export default navConfig;
