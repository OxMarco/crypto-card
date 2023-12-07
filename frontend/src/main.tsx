import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Providers } from './Providers.tsx';
import LandingPage from './pages/Landing.tsx';
import ErrorPage from './pages/Error.tsx';
import AboutPage from './pages/About.tsx';
import FaqPage from './pages/Faq.tsx';
import LoginPage from './pages/Login.tsx';
import DashboardPage from './pages/auth/Dashboard.tsx';
import CardsPage from './pages/auth/Cards.tsx';
import CardDetailPage from './pages/auth/CardDetail.tsx';
import CardSettingsPage from './pages/auth/CardSettings.tsx';
import VaultsPage from './pages/auth/Vaults.tsx';
import LogoutPage from './pages/auth/Logout.tsx';
import VaultDetailPage from './pages/auth/VaultDetail.tsx';

import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/faq',
    element: <FaqPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/logout',
    element: <LogoutPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/vaults',
    element: <VaultsPage />,
  },
  {
    path: '/vaults/:chainSlug',
    element: <VaultDetailPage />,
  },
  {
    path: '/cards',
    element: <CardsPage />,
  },
  {
    path: '/cards/detail/:id',
    element: <CardDetailPage />,
  },
  {
    path: '/cards/settings',
    element: <CardSettingsPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </>,
);
