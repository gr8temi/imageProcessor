import React, { useCallback, useContext, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Input, message, Tabs, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ImageContext } from "../../context";

const { Dragger } = Upload;

const UploadImage = () => {
  const { images, setImages } = useContext(ImageContext);
  const [imageURL, setImageURL] = useState("");
  const dragUploader = useCallback(
    (props) => (
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single upload.</p>
      </Dragger>
    ),
    []
  );

  const handleImageURLUpload = useCallback(
    async (url) => {
      let name = "";
      try {
        name = new URL(url).pathname.split("/").pop();
      } catch (e) {
        message.error("Invalid URL");
      }
      if (name) {
        let response = await fetch(url);
        let data = await response.blob();
        let metadata = {
          type: "image/png",
        };

        let image = new File([data], name, metadata);
        const formData = new FormData();
        formData.append("image", image);

        try {
          const response = await fetch("http://127.0.0.1:5002/image/upload/", {
            method: "POST",
            body: formData,
          }).then((res) => res.json());
          setImages([response, ...images]);
          setImageURL("setImageURL");
          message.success("Image uploaded successfully");
        } catch (e) {
          message.error(e.response.message);
        }
      }
    },
    [images, setImages]
  );
  const urlUploader = useCallback(
    () => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Input
          addonBefore="Image URL"
          size="large"
          onChange={(e) => setImageURL(e.target.value)}
        />
        <Button
          width="80"
          type="primary"
          size="large"
          shape="round"
          onClick={() => handleImageURLUpload(imageURL)}
          style={{ marginTop: "20px", width: "50%" }}
          icon={<UploadOutlined />}
        >
          Upload Image
        </Button>
      </div>
    ),
    [handleImageURLUpload, imageURL]
  );
  const props = {
    name: "image",
    multiple: false,
    action: "http://127.0.0.1:5002/image/upload/",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file.response.message);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setImages([info.file.response, ...images]);
      } else if (status === "error") {
        message.error(info.file.response.message);
      }
    },
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
      }}
    >
      {console.log({ imageURL })}
      <Tabs
        defaultActiveKey="1"
        items={[
          { children: dragUploader(props), label: "Upload from PC", key: "1" },
          { children: urlUploader(), label: "Upload from URL", key: "2" },
        ]}
      />
    </div>
  );
};
export default UploadImage;
