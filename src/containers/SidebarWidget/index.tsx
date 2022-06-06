/* Import React modules */
import React, { useEffect, useState } from "react";
/* Import other node modules */
import ContentstackAppSdk from "@contentstack/app-sdk";
import { FieldLabel } from "@contentstack/venus-components";
import { TypeSDKData, TypeEntryData } from "../../common/types";
/* Import our modules */
import localeTexts from "../../common/locale/en-us";
/* Import node module CSS */
/* Import our CSS */
import "./styles.scss";

const SidebarWidget: React.FC = function () {
  const [entryData, setEntryData] = useState<TypeEntryData>({ title: "" });
  const [state, setState] = useState<TypeSDKData>({
    config: {},
    location: {},
    appSdkInitialized: false,
  });

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
      const config = await appSdk?.getConfig();

      const entryDataFromSDK =
        appSdk?.location?.SidebarWidget?.entry?.getData();
      setEntryData(entryDataFromSDK); // entryData is the whole entry object from CMS that contains all the data in the current entry for which sidebar is opened.
      setState({
        config,
        location: appSdk.location,
        appSdkInitialized: true,
      });
    });
  }, []);

  return (
    <div className="layout-container">
      {state.appSdkInitialized && (
        // <>
        // Your sidebar UI must be developed here based on the state variable
        // {`Your current state is ${JSON.stringify(state)}`}
        // {`Your current entryData is ${JSON.stringify(entryData)}`}
        // </>
        <div className="sidebar-wrapper">
          <FieldLabel
            htmlFor={state?.config?.configField1}
            className="sidebar-field"
          >
            {state.config.configField1}
          </FieldLabel>
          <div className="entry-wrapper">
            <FieldLabel htmlFor="entry-title" className="sidebar-field">
              {localeTexts.sidebarWidget.titleCaption}
            </FieldLabel>
            <FieldLabel htmlFor={entryData?.title} className="sidebar-field">
              {entryData?.title}
            </FieldLabel>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarWidget;
