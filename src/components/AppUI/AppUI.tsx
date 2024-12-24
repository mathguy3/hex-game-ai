import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ClientProvider } from '../../logic/client/ClientProvider';
import { WebSocketProvider } from '../../logic/websocket/WebSocketProvider';
import { ConfigurePage } from './pages/ConfigurePage';
import { GamePage } from './pages/GamePage';
import { GamePickerPage } from './pages/GamePickerPage';
import { MainMenu } from './pages/MainMenu';

const appRoutes = [
  {
    path: '/',
    element: <Outlet />,
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
      {
        path: '/configure',
        element: <ConfigurePage />,
      },
    ],
  },
];

export const AppUI = () => {
  return (
    <ClientProvider>
      <WebSocketProvider>
        <RouterProvider router={createBrowserRouter(appRoutes)} />
      </WebSocketProvider>
    </ClientProvider>
  );
};
