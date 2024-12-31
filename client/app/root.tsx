import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from '@remix-run/react';
import { Box, Button, ColorSchemeProvider, Flex, SideNavigation } from 'gestalt';

import 'gestalt/dist/gestalt.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: '0px', padding: '0px' }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  function getPageIdFromPath(path: string) {
    switch (path) {
      case '/activity':
        return '1';
      case '/cash':
        return '2';
      case '/savings':
        return '3';
      case '/card':
        return '4';
      case '/payments':
        return '5';
      case '/account':
        return '6';
      default:
        return '';
    }
  }

  const activePageId = getPageIdFromPath(location.pathname);

  return (
    <ColorSchemeProvider colorScheme='userPreference'>
      <Box display='flex' height='100vh' color='default'>
        {/* Sidebar */}
        <Flex height='100%' direction='column'>
          {/** Sidebar Options */}
          <SideNavigation
            accessibilityLabel='Icons example'
            header={
              <Box width='100%' fit justifyContent='center' display='flex' marginTop={2}>
                <img alt='Swiftly' src='logo.svg' style={{ height: 'auto' }} />
              </Box>
            }
            footer={<Button text={'Log out'} fullWidth />}
            showBorder
          >
            <SideNavigation.TopItem
              active={activePageId === '1' ? 'page' : undefined}
              href='#'
              icon='history'
              label='Activity'
              onClick={({ event }) => {
                event.preventDefault();
                navigate('/activity');
              }}
            />
            <SideNavigation.TopItem
              active={activePageId === '2' ? 'page' : undefined}
              href='#'
              icon='impressum' /** graph-bar */
              label='Cash'
              onClick={({ event }) => {
                event.preventDefault();
                navigate('/cash');
              }}
            />
            <SideNavigation.TopItem
              active={activePageId === '3' ? 'page' : undefined}
              href='#'
              icon='trending'
              label='Savings'
              onClick={({ event }) => {
                event.preventDefault();
                navigate('/savings');
              }}
            />
            <SideNavigation.TopItem
              active={activePageId === '4' ? 'page' : undefined}
              href='#'
              icon='credit-card'
              label='Card'
              onClick={({ event }) => {
                event.preventDefault();
                navigate('/card');
              }}
            />
            <SideNavigation.TopItem
              active={activePageId === '5' ? 'page' : undefined}
              href='#'
              icon='arrows-vertical'
              label='Pay & Request'
              onClick={({ event }) => {
                event.preventDefault();
                navigate('/payments');
              }}
            />
            <SideNavigation.TopItem
              active={activePageId === '6' ? 'page' : undefined}
              href='#'
              icon='cog'
              label='Account'
              onClick={({ event }) => {
                event.preventDefault();
                navigate('/account');
              }}
            />
          </SideNavigation>
        </Flex>
        {/* Main Profile Content */}
        <Box flex='grow' padding={4}>
          <Outlet />
        </Box>
      </Box>
    </ColorSchemeProvider>
  );
}
