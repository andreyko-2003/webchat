import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// import Home from './components/Home';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import Chat from './pages/Chat';

import PrivateRoute from './components/routes/PrivateRoute';
import PublicRoute from './components/routes/PublicRoute';

import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    background: {
      default: "#EDF4F2"
    },
    primary: {
      main: '#31473A'
    },
    secondary: {
      main: '#EDF4F2'
    }
  }
});

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/sign-in" element={<PublicRoute element={SignIn} />} />
            <Route path="/sign-up" element={<PublicRoute element={SignUp} />} />

            <Route path="/" element={<PrivateRoute element={Chat} />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
