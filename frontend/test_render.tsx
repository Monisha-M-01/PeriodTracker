import React from 'react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CalendarPage from './src/features/calendar/CalendarPage.tsx';

const client = new QueryClient();

try {
  const html = renderToString(<QueryClientProvider client={client}><CalendarPage /></QueryClientProvider>);
  console.log('SUCCESS');
} catch (e) {
  console.error('ERROR:', e.message, e.stack);
}
