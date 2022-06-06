import { IInstallationData } from "@contentstack/app-sdk/dist/src/types";

export interface TypeAppSdkConfigState {
  installationData: IInstallationData;
  setInstallationData: (event: any) => any;
  appSdkInitialized: boolean;
}

export interface TypeSDKData {
  config: any;
  location: any;
  appSdkInitialized: boolean;
}

export interface TypeEntryData {
  title: string;
}
