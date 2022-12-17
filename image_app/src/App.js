import "./App.css";
import React, { useCallback, useEffect } from "react";
import {
  Card,
  Col,
  Layout,
  Row,
  Typography,
  Image,
  Button,
  Modal,
  message,
} from "antd";
import { UploadImage } from "./components/uploadImage";
import { useState } from "react";
import { ImageContext } from "./context";
import { useQuery } from "react-query";
import { InteractionOutlined } from "@ant-design/icons";
import useImageAnalyzer from "./hooks/useImageAnalyzer";

const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Title, Text } = Typography;

const App = () => {
  const [images, setImages] = useState([]);
  const [modalContent, setModalContent] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [api, contextHolder] = message.useMessage();

  const { isLoading, error, data } = useQuery("images", () =>
    fetch("http://127.0.0.1:5002/image/list/").then((res) => res.json())
  );

  const { imageAnalyzeDataLoading, imageAnalyzeData, imageAnalyzeDataError } =
    useImageAnalyzer({ imageId: modalContent?.image_id });

  useEffect(() => {
    if (data) {
      setImages(data);
    }
  }, [data]);

  const handleAnalyze = (image) => {
    setShowModal(true);
    setModalContent(image);
  };

  useEffect(() => {
    if ((imageAnalyzeData && imageAnalyzeData.error) || imageAnalyzeDataError) {
      api.open({
        type: "error",
        content: imageAnalyzeData.error || imageAnalyzeDataError,
      });
    }
  }, [api, imageAnalyzeData, imageAnalyzeDataError]);

  return (
    <ImageContext.Provider value={{ images, setImages }}>
      {contextHolder}
      <Layout className="App">
        <Header
          style={{
            display: "flex",
            justifyContent: "center",
            height: "unset",
          }}
        >
          <Title style={{ color: "white" }}>
            Image Uploader/Analyzer Engine
          </Title>
        </Header>
        <Content
          style={{
            padding: "0 50px",
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div
            className="site-layout-content"
            style={{
              display: "flex",
              width: "60%",
              marginTop: "20px",
              marginBottom: "40px",
            }}
          >
            <UploadImage />
          </div>
        </Content>
      </Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <Row>
          <Title> Uploaded Images</Title>
        </Row>
        <Row gutter={32} style={{ width: "100%" }}>
          {!isLoading &&
            images.map((ele) => (
              <Col span={6}>
                <Card
                  hoverable
                  cover={
                    <Image
                      alt="example"
                      src={`http://127.0.0.1:5002/image/${ele.image_name}`}
                      width="100"
                      height="400px"
                    />
                  }
                  style={{ marginBottom: "20px" }}
                >
                  <Meta
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    // title={ele.image_name}
                    description={
                      <Button
                        icon={<InteractionOutlined />}
                        type="primary"
                        onClick={() => handleAnalyze(ele)}
                      >
                        Analyze Image
                      </Button>
                    }
                  />
                </Card>
              </Col>
            ))}
        </Row>
      </div>
      <Modal
        title={<Title level={4}>{modalContent.image_name} Analysis</Title>}
        open={showModal && imageAnalyzeData && !imageAnalyzeData?.error}
        width={1000}
        onCancel={() => setShowModal(false)}
      >
        <Row gutter={16}>
          <Col span="12">
            <Image
              src={`http://127.0.0.1:5002/image/${modalContent.image_name}`}
            ></Image>
          </Col>
          <Col span="12">
            {imageAnalyzeDataLoading && "loading"}

            {imageAnalyzeData && !imageAnalyzeData.error && (
              <>
                <Row>
                  <Col span={12}>
                    <Text>Width:</Text>
                  </Col>
                  <Col span={12}>{imageAnalyzeData.width}</Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Text>Height:</Text>
                  </Col>
                  <Col span={12}>{imageAnalyzeData.height}</Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Modal>
    </ImageContext.Provider>
  );
};
export default App;
