import { Button, EditableTags } from "@contentstack/venus-components";
import React, { Component } from "react";
import { FileUploader } from "react-drag-drop-files";
import "./styles.scss";

const fileTypes = [
  "JPG",
  "PNG",
  "GIF",
  "WEBP",
  "XML",
  "BMP",
  "TIFF",
  "SVG",
  "PSD",
];

interface IProps {
  images: any;
  removeImage: Function;
  handleTagUpdate: Function;
  handleFileDragAndDropChange: Function;
}

class DragAndDropField extends Component<IProps> {
  render() {
    return (
      <>
        <div className="images-container">
          {this.props.images.length ? (
            this.props.images.map((image: any, index: number) => (
              <div key={index} className="card">
                <div className="image-card">
                  <Button
                    className="delete-btn"
                    buttonType="white"
                    icon="delete"
                    iconAlignment={undefined}
                    onClick={() => this.props.removeImage(index)}
                  >
                    X
                  </Button>
                  <img
                    className="selected-image"
                    key={index}
                    src={URL.createObjectURL(image.file)}
                    alt=""
                  />
                  <div className="card-body">
                    <EditableTags
                      tags={[...image.tags]}
                      placeholder="Tags"
                      isSortable={true}
                      onChange={(e: any) =>
                        this.props.handleTagUpdate(e, image, index)
                      }
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-message-box">
              <FileUploader
                hoverTitle="yo!"
                label="Browse or drag and drop your files"
                classes="file-uploader"
                multiple={true}
                handleChange={this.props.handleFileDragAndDropChange}
                name="file"
                maxSize="700"
                types={fileTypes}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default DragAndDropField;
