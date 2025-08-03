import { faker } from '@faker-js/faker';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWidgetSummary from '../app-widget-summary';

export default function AppView() {
  const [measurements, setMeasurements] = useState([]);
  const [users, setUsers] = useState([]);

  const userRole = (() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('user'));
      return stored?.role || 'admin';
    } catch (e) {
      return 'admin';
    }
  })();

  useEffect(() => {
    fetchMeasurements();
    fetchUsers();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const res = await fetch('https://digiflex-backend.up.railway.app/api/measurements');
      const json = await res.json();
      setMeasurements(json);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://digiflex-backend.up.railway.app/api/users');
      const json = await res.json();
      setUsers(json);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredMeasurements =
    userRole === 'normal'
      ? measurements.filter((m) => ['assigned', 'in_progress'].includes(m.status))
      : measurements;

  const totalUsers = users.length;
  const totalMeasurements = measurements.length;
  const assignedCount = filteredMeasurements.filter((m) => m.status === 'assigned').length;
  const wipCount = filteredMeasurements.filter((m) => m.status === 'in_progress').length;

  const pieStatuses = userRole === 'normal'
    ? ['assigned', 'in_progress']
    : ['created', 'assigned', 'in_progress', 'approved'];

  const statusBreakdown = pieStatuses.map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: filteredMeasurements.filter((m) => m.status === status).length,
  }));

  const latestTimeline = filteredMeasurements
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map((m, index) => ({
      id: faker.string.uuid(),
      title: `${m.customer_name} (${m.status})`,
      type: `order${index + 1}`,
      time: new Date(m.created_at || m.measurement_date),
    }));

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        {userRole !== 'normal' ? (
          <>
            <Grid xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Total Measurements"
                total={totalMeasurements}
                color="success"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Total Users"
                total={totalUsers}
                color="info"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="Assigned Measurements"
                total={assignedCount}
                color="info"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
              <AppWidgetSummary
                title="WIP Measurements"
                total={wipCount}
                color="warning"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="Assigned Measurements"
                total={assignedCount}
                color="info"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
              />
            </Grid>

            <Grid xs={12} sm={6} md={6}>
              <AppWidgetSummary
                title="WIP Measurements"
                total={wipCount}
                color="warning"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
              />
            </Grid>
          </>
        )}

        <Grid xs={12} md={6} lg={6}>
          <AppCurrentVisits
            title="Measurement Status Breakdown"
            chart={{ series: statusBreakdown }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={6}>
          <AppOrderTimeline
            title="Recent Measurement Activity"
            list={latestTimeline}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
