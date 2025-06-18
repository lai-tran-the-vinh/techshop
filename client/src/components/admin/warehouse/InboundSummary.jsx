import React from "react";
import { Card, Row, Space, Badge, Divider, Button, Typography } from "antd";
const { Text } = Typography;
import { SaveOutlined } from "@ant-design/icons";

const InboundSummary = ({
  inboundItems = [],
  totalQuantity = 0,
  totalValue = 0,
  handleSubmitInbound,
  loading = false,
}) => {
  return (
    <Card title="Tóm tắt phiếu nhập">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Row justify="space-between">
          <Text>Tổng sản phẩm:</Text>
          <Text strong>{inboundItems.length}</Text>
        </Row>
        <Row justify="space-between">
          <Text>Tổng số lượng:</Text>
          <Badge count={totalQuantity} style={{ backgroundColor: "#52c41a" }} />
        </Row>
        <Row justify="space-between">
          <Text>Tổng giá trị:</Text>
          <Text strong style={{ color: "#fa8c16" }}>
            {totalValue.toLocaleString("vi-VN")} ₫
          </Text>
        </Row>

        <Divider />

        <Button
          type="primary"
          size="large"
          icon={<SaveOutlined />}
          onClick={handleSubmitInbound}
          disabled={inboundItems.length === 0}
          style={{ width: "100%" }}
          loading={loading}
        >
          Xác nhận nhập kho
        </Button>
      </Space>
    </Card>
  );
};

export default InboundSummary;
