/* Import React modules */
import React from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
/* Import other node modules */
/* Import our modules */
import ErrorBoundary from "../../components/ErrorBoundary";
import ConfigScreen from "../ConfigScreen";
import SidebarWidget from "../SidebarWidget";
import DashboardWidget from "../DashboardWidget";
// import CustomField from "../CustomField";
/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
import "./styles.scss";
import AssetsBulkOperationDashboardWidget from "../AssetsBulkOperation";
import 'react-toastify/dist/ReactToastify.css';
const HomeRedirectHandler = function () {
  if (window?.location?.pathname !== "/") {
    return <Navigate to={{ pathname: window.location.pathname }} />;
  }
  return null;
};

const App: React.FC = function () {
  return (
    <div className="app">
      <ErrorBoundary>
        <HashRouter>
          {/* If the path is changed here,
              be sure to update the path for corresponding UI location
              in Update App API */
          /* Below list has all the possible UI paths\.
              Keep only the paths that are required for your app and
              remove the remaining paths and their source code also. */}
          <Routes>
          <Route path="/" element={<HomeRedirectHandler />} />
            <Route path="/config" element={<ConfigScreen />} />
            <Route path="/sidebar-widget" element={<SidebarWidget />} />
            <Route path="/dashboard-widget" element={<DashboardWidget />} />
            <Route path="/assets-bulk-operation-dashboard-widget" element={<AssetsBulkOperationDashboardWidget />} />
            {/* <Route path="/custom-field" element={<CustomField />} /> */}
          </Routes>
        </HashRouter>
      </ErrorBoundary>
    </div>
  );
};

export default App;
