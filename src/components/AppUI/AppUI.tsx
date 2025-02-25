import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { GamePickerPage } from './pages/GamePickerPage';
import { MainMenu } from './pages/MainMenu';
import { Layout } from './Layout';

const appRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainMenu />,
      },
      {
        path: 'pick',
        element: <GamePickerPage />,
      },
      {
        path: 'room',
        element: <Outlet />,
        children: [
          {
            path: ':roomCode',
            element: <GamePage />,
          },
        ],
      },
    ],
  },
];

export const AppUI = () => {
  return <RouterProvider router={createBrowserRouter(appRoutes)} />;
};
