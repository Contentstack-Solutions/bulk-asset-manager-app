import ContentstackAppSdk from "@contentstack/app-sdk";
import "./styles.scss";
import React, { Component } from "react";
import axios from "axios";
import DragAndDropField from "./DragAndDropField";
import FormField from "./FormField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export let requestHeaders: HeadersInit = new Headers();
requestHeaders.set("api_key", `${process.env.REACT_APP_CS_API_KEY}`);
requestHeaders.set("authorization", `${process.env.REACT_APP_CS_CMA_TOKEN}`);
requestHeaders.set("Content-Type", "application/json");

interface IProps {}

interface IState {
  location: Object;
  appSdkInitialized: boolean;
  displayImages: any;
  images: IImage[];
  umappedAssetFolders: any[];
  assetFolders: any;
  selectedAssetFolder: any;
  isLoading: boolean;
  globalTags: string[];
  resultsLog: string[];
}

interface IImage {
  file: any;
  tags: string[];
  title: string;
  description: string;
}

export class AssetsBulkOperationDashboardWidget extends Component<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      location: {},
      appSdkInitialized: false,
      displayImages: [],
      images: [],
      umappedAssetFolders: [],
      assetFolders: [],
      selectedAssetFolder: null,
      isLoading: false,
      globalTags: [],
      resultsLog: [],
    };
  }

  addNotification = () => {
    toast("Assets uploaded successfully.", {
      type: "success",
      position: "bottom-center",
      theme: "colored",
    });
  };

  getAssetsFolder = async () => {
    let fetchAssetsFolder = await fetch(
      `${process.env.REACT_APP_CMA_API_URL}/v3/assets?include_folders=true&query={"is_dir": true}`,
      { headers: requestHeaders }
    );
    let toJSON = await fetchAssetsFolder.json();

    this.setState({
      umappedAssetFolders: toJSON.assets,
    });

    let mappedResults = await toJSON.assets.map((res: any) => {
      if (res.parent_uid) {
        let folderName = this.state.umappedAssetFolders.find(
          (folder: any) => folder.uid === res.parent_uid
        );
        let result = {
          label: folderName.name + "/" + res.name,
          value: res.uid,
        };
        return result;
      }

      let result = {
        label: res.name,
        value: res.uid,
      };
      return result;
    });

    this.setState({
      assetFolders: mappedResults,
    });
  };

  handleFileChange = (event: any) => {
    if (event.target.files.length > 0) {
      this.setState({
        images: [],
        selectedAssetFolder: null,
        globalTags: [],
        resultsLog: [],
      });
      let displayImages: any[] = [];
      let images: IImage[] = [];
      let files = event.target.files;

      Array.from(files).forEach((file: any) => {
        displayImages.push(URL.createObjectURL(file));
        let image: IImage = {
          file: file,
          tags: [],
          title: file.name,
          description: "",
        };
        images.push(image);
      });

      this.setState({
        displayImages: displayImages,
        images: images,
      });
    }
  };

  handleFileDragAndDropChange = (event: any) => {
    this.setState({
      images: [],
      selectedAssetFolder: null,
      globalTags: [],
      resultsLog: [],
    });
    let displayImages: any[] = [];
    let images: IImage[] = [];

    let files = event;

    Array.from(files).forEach((file: any) => {
      displayImages.push(URL.createObjectURL(file));
      let image: IImage = {
        file: file,
        tags: [],
        title: file.name,
        description: "",
      };
      images.push(image);
    });

    this.setState({
      displayImages: displayImages,
      images: images,
    });
  };

  uploadImages = () => {
    if (this.state.images.length > 0) {
      this.setState({
        isLoading: true,
      });

      this.state.images.forEach((image: any, index: number) => {
        setTimeout(() => {
          image.tags = [...image.tags, ...this.state.globalTags];

          let formData = new FormData();
          formData.append("asset[upload]", image.file);
          formData.append("asset[tags]", image.tags);
          if (this.state.selectedAssetFolder) {
            formData.append(
              "asset[parent_uid]",
              this.state.selectedAssetFolder.value
            );
          }

          let config: any = {
            method: "POST",
            url: `${process.env.REACT_APP_CMA_API_URL}/v3/assets`,
            headers: {
              api_key: process.env.REACT_APP_CS_API_KEY,
              authorization: process.env.REACT_APP_CS_CMA_TOKEN,
              "Content-Type": "multipart/form-data",
            },
            data: formData,
          };

          axios(config)
            .then((response: any) => {
              let result = response.data.asset;
              this.state.resultsLog.push(result);
              if (this.state.resultsLog.length === this.state.images.length) {
                this.setState({
                  images: [],
                  selectedAssetFolder: null,
                  globalTags: [],
                  resultsLog: [],
                  isLoading: false,
                });
                this.addNotification();
              }
            })
            .catch(function (error: any) {
              console.log(error);
            });
        }, 100 * index);
      });
    }
  };

  removeImages = () => {
    this.setState({
      images: [],
      selectedAssetFolder: null,
      globalTags: [],
      resultsLog: [],
    });
  };

  removeImage = (index: any) => {
    let images = [...this.state.images];

    if (index !== -1) {
      images.splice(index, 1);
      this.setState({
        images: images,
      });
    }
  };

  handleTagUpdate = (e: any, image: IImage, i: any) => {
    let index = this.state.images.indexOf(image, i);

    if (index !== -1) {
      let images = [...this.state.images];
      let image = { ...images[index] };
      image.tags = e;
      images[index] = image;

      this.setState({
        images: images,
      });
    }
  };

  handleGlobalTagUpdate = (e: any) => {
    this.setState({
      globalTags: e,
    });
  };

  handleSelectedFolder = (e: any) => {
    this.setState({
      selectedAssetFolder: e,
    });
  };

  componentDidMount() {
    ContentstackAppSdk.init().then(async (appSdk: any) => {
      appSdk.location.DashboardWidget.frame.updateHeight(600);
      this.setState({
        location: appSdk.location,
        appSdkInitialized: true,
      });
    });
    this.getAssetsFolder();
  }

  render() {
    let view = (
      <div className="layout-container">
        <FormField
          handleFileChange={this.handleFileChange}
          removeImages={this.removeImages}
          images={this.state.images}
          globalTags={this.state.globalTags}
          handleGlobalTagUpdate={this.handleGlobalTagUpdate}
          selectedAssetFolder={this.state.selectedAssetFolder}
          handleSelectedFolder={this.handleSelectedFolder}
          assetFolders={this.state.assetFolders}
          isLoading={this.state.isLoading}
          uploadImages={this.uploadImages}
        />

        <DragAndDropField
          images={this.state.images}
          removeImage={this.removeImage}
          handleTagUpdate={this.handleTagUpdate}
          handleFileDragAndDropChange={this.handleFileDragAndDropChange}
        />
        <ToastContainer newestOnTop />
      </div>
    );

    return <>{this.state.appSdkInitialized ? view : null}</>;
  }
}

export default AssetsBulkOperationDashboardWidget;
