import React from "react";
import { HashRouter, Router } from "react-router-dom";

import { AuthenticationProvider } from "react/contexts/authentication";
import { ThemeProvider } from "react/contexts/theme";
import Layout from "./layout";

import history from '../services/history';

function Main() {
  return (
    <HashRouter>
      <AuthenticationProvider>
        <ThemeProvider>
          <Layout />
        </ThemeProvider>
      </AuthenticationProvider>
    </HashRouter>
  );
}

export default Main;
