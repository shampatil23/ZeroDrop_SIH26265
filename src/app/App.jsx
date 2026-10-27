import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DataProvider } from '../hooks/useDataContext';
import { router } from './router';

export default function App() {
  return (
    <DataProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#202824',
            border: '1px solid #E2E8E4',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: { primary: '#168568', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#D94848', secondary: '#fff' },
          },
        }}
      />
    </DataProvider>
  );
}
