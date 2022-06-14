import { Button, EditableTags, Select } from "@contentstack/venus-components";
import React, { Component } from "react";
import "./styles.scss";

interface IProps {
  handleFileChange: any;
  removeImages: Function;
  images: any[];
  globalTags: string[];
  handleGlobalTagUpdate: Function;
  selectedAssetFolder: string;
  handleSelectedFolder: Function;
  assetFolders: string[];
  isLoading: boolean;
  uploadImages: Function;
  isResults: boolean;
}

class FormField extends Component<IProps> {
  render() {
    return (
      <>
        <div className="controller">
          <div className="select-wrapper">
            <label
              htmlFor="input-file-field"
              className="Button input-file-field-btn Button--primary"
            >
              Choose files
            </label>
            <input
              type="file"
              className="input-file-field"
              id="input-file-field"
              multiple
              onChange={this.props.handleFileChange}
            />
            <Button
              size="large"
              buttonType="secondary"
              onClick={this.props.removeImages}
            >
              Clear
            </Button>
            <span className="item-qty">{this.props.images.length ? this.props.images.length : 'No'} items</span>
          </div>
          <div
            style={{
              pointerEvents: !this.props.images.length ? "none" : "auto",
              opacity: !this.props.images.length ? 0.4 : 1,
            }}
            className="global-tag-wrapper"
          >
            <div className="tag-body">
              <EditableTags
                tags={this.props.globalTags}
                placeholder="Global tags"
                isSortable={true}
                onChange={(e: any) => this.props.handleGlobalTagUpdate(e)}
              />
            </div>
          </div>
          <div className="folders-wrapper">
            <Select
              className="select-field"
              value={this.props.selectedAssetFolder}
              onChange={this.props.handleSelectedFolder}
              options={this.props.assetFolders}
              placeholder={"Select folder"}
              isClearable={true}
              isSearchable={true}
              isDisabled={!this.props.images.length}
              hideSelectedOptions={true}
              noOptionsMessage={() => "No lables created yet"}
            />
          </div>
          <div className="upload-wrapper">
            <Button
              size="large"
              icon="MarketplaceSmallFilledWhite"
              disabled={!this.props.images.length}
              isLoading={this.props.isLoading}
              isFullWidth={false}
              onClick={this.props.uploadImages}
            >
              Upload
            </Button>
            {/* <Button size='large' icon="MarketplaceSmallFilledWhite" disabled={!this.props.isResults} isFullWidth={false} onClick={this.props.uploadImages}>Results</Button> */}
          </div>
        </div>
      </>
    );
  }
}

export default FormField;
