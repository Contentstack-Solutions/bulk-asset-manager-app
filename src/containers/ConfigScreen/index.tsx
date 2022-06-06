/* Import React modules */
import React, { useState, useEffect } from "react";
/* Import other node modules */
import {
  FieldLabel,
  TextInput,
  InstructionText,
} from "@contentstack/venus-components";
import ContentstackAppSdk from "@contentstack/app-sdk";
/* Import our modules */
import localeTexts from "../../common/locale/en-us";
import utils from "../../common/utils";
import { TypeAppSdkConfigState } from "../../common/types";
// import { getDataFromAPI } from '../../services'; //If no services are required, this can be removed\
/* Import node module CSS */
import "@contentstack/venus-components/build/main.css";
/* Import our CSS */
import "./styles.scss";

/* eslint-disable */
const ConfigScreen: React.FC = function () {
  const [state, setState] = useState<TypeAppSdkConfigState>({
    installationData: {
      configuration: {
        /* Add all your config fields here */
        /* The key defined here should match with the name attribute
        given in the DOM that is being returned at last in this component */
        configField1: "",
      },
      serverConfiguration: {},
    },
    setInstallationData: (): any => {},
    appSdkInitialized: false,
  });

  useEffect(() => {
    ContentstackAppSdk.init().then(async (appSdk) => {
      const sdkConfigData = appSdk?.location?.AppConfigWidget?.installation;
      if (sdkConfigData) {
        const installationDataFromSDK =
          await sdkConfigData.getInstallationData();
        const setInstallationDataOfSDK = sdkConfigData.setInstallationData;
        setState({
          ...state,
          installationData: utils.mergeObjects(
            state.installationData,
            installationDataFromSDK
          ),
          setInstallationData: setInstallationDataOfSDK,
          appSdkInitialized: true,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** updateConfig - Function where you should update the state variable
   * Call this function whenever any field value is changed in the DOM
   * */
  const updateConfig = async (e: any) => {
    // eslint-disable-next-line prefer-const
    let { name: fieldName, value: fieldValue } = e.target;
    const updatedConfig = state?.installationData?.configuration || {};
    updatedConfig[fieldName] = fieldValue;

    const updatedServerConfig = state.installationData.serverConfiguration;
    updatedServerConfig[fieldName] = fieldValue;

    if (typeof state.setInstallationData !== "undefined") {
      await state.setInstallationData({
        ...state.installationData,
        configuration: updatedConfig,
        serverConfiguration: updatedServerConfig,
      });
    }

    return true;
  };

  return (
    <div className="layout-container">
      <div className="page-wrapper">
        <div className="config-wrapper">
          <FieldLabel required htmlFor="configField1Id">
            {" "}
            {/* Change the label caption as per your requirement */}
            {localeTexts.configFields.field1.label}
          </FieldLabel>
          {/* Change the help caption as per your requirement */}
          <TextInput
            id="configField1Id"
            required
            value={state.installationData.configuration.configField1}
            placeholder={localeTexts.configFields.field1.placeholder}
            /* The name attribute given here should match with the
              state variable definition. Please check the comments above
              at the state variable definition. */
            name="configField1"
            onChange={updateConfig}
          />
          <InstructionText>
            {localeTexts.configFields.field1.instruction}
          </InstructionText>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
