import { Outlet } from 'react-router-dom';
import { ClientProvider } from '../../logic/client/ClientProvider';
import { WebSocketProvider } from '../../logic/websocket/WebSocketProvider';

export const Layout = () => {
  return (
    <ClientProvider>
      <WebSocketProvider>
        <Outlet />
      </WebSocketProvider>
    </ClientProvider>
  );
};
