import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { account } from 'src/_mock/account';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const upLg = useResponsive('up', 'lg');
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const renderAccount = (collapsed) =>
    !collapsed && (
      <Box
        sx={{
          my: 3,
          mx: 2.5,
          py: 2,
          px: 2.5,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">{user.first_name} {user.last_name}</Typography>
        </Box>
      </Box>
    );

  const renderMenu = (collapsed) => (
    <Stack component="nav" spacing={0.5} sx={{ px: collapsed ? 0 : 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} isCollapsed={collapsed} />
      ))}
    </Stack>
  );

  const renderHeader = (collapsed) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        px: 2,
        py: 2,
      }}
    >
      <Logo sx={{ ...(collapsed && { transform: 'scale(0.8)' }) }} />
    </Box>
  );

  return (
    <>
      {/** Fixed toggle arrow for large screens */}
      {upLg && (
        <IconButton
          onClick={toggleCollapse}
          sx={{
            position: 'fixed',
            top: 24,
            left: isCollapsed ? 80 - 15 : NAV.WIDTH - 15, // Adjust to match sidebar width
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
              zIndex: (theme) => theme.zIndex.drawer + 2, // ✅ Must be higher than the sidebar z-index
            // zIndex: (theme) => theme.zIndex.appBar + 1,
            boxShadow: (theme) => theme.shadows[1],
            transition: 'left 0.3s',
          }}
        >
          <Icon
            icon={isCollapsed ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
            width={20}
            height={20}
          />
        </IconButton>
      )}

      <Box
        sx={{
          flexShrink: { lg: 0 },
          width: { lg: isCollapsed ? 80 : NAV.WIDTH },
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          transition: 'width 0.3s',
        }}
      >
        {upLg ? (
          <Box
            sx={{
              height: 1,
              position: 'fixed',
              width: isCollapsed ? 80 : NAV.WIDTH,
              borderRight: (theme) => `1px solid ${theme.palette.divider}`,
              transition: 'width 0.3s',
              top: 0,
              left: 0,
              bgcolor: 'background.paper',
              zIndex: (theme) => theme.zIndex.drawer,
            }}
          >
            {renderHeader(isCollapsed)}
            <Scrollbar
              sx={{
                height: 1,
                '& .simplebar-content': {
                  height: 1,
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            >
              {renderAccount(isCollapsed)}
              {renderMenu(isCollapsed)}
              <Box sx={{ flexGrow: 1 }} />
            </Scrollbar>
          </Box>
        ) : (
          <Drawer
            open={openNav}
            onClose={onCloseNav}
            PaperProps={{
              sx: {
                width: NAV.WIDTH,
              },
            }}
          >
            {renderHeader(false)}
            <Scrollbar
              sx={{
                height: 1,
                '& .simplebar-content': {
                  height: 1,
                  display: 'flex',
                  flexDirection: 'column',
                },
              }}
            >
              {renderAccount(false)}
              {renderMenu(false)}
              <Box sx={{ flexGrow: 1 }} />
            </Scrollbar>
          </Drawer>
        )}
      </Box>
    </>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item, isCollapsed }) {
  const pathname = usePathname();
  const isRootPath = item.path === '/';
  const active = isRootPath ? pathname === '/' : pathname.startsWith(item.path);

  const content = (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        px: isCollapsed ? 2 : 2.5,
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24 }}>
        {item.icon}
      </Box>

      {!isCollapsed && (
        <Box component="span" sx={{ ml: 2 }}>
          {item.title}
        </Box>
      )}
    </ListItemButton>
  );

  return isCollapsed ? (
    <Tooltip title={item.title} placement="right">
      {content}
    </Tooltip>
  ) : (
    content
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
  isCollapsed: PropTypes.bool,
};
