import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { GamePage } from './pages/GamePage';
import { GamePickerPage } from './pages/GamePickerPage';
import { MainMenu } from './pages/MainMenu';
import { Layout } from './Layout';
import { GameDefinitionListPage } from './pages/GameDefinitionListPage';
import { GameDefinitionEditorPage } from './pages/GameDefinitionEditorPage';

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
        path: 'editor',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <GameDefinitionListPage />,
          },
          {
            path: ':id',
            element: <GameDefinitionEditorPage />,
          },
        ],
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
