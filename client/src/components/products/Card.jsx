import {

  ShoppingCartOutlined,

} from "@ant-design/icons";
import { Card, Badge, Button, Space, Typography, Divider, Image } from "antd";

const { Text, Title } = Typography;

function CardProduct() {
  return (
    <Badge.Ribbon text="Mới" color="red" style={{ top: 10, right: -6 }}>
      <Card
        hoverable
        style={{
          width: 280,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgb(245, 239, 239)",
        }}
        cover={
          <Image
            src="https://cdn.tgdd.vn/Products/Images/42/329138/iphone-16-plus-hong-thumb-1-600x600.jpg"
            alt="iPhone 16 Pro Max"
            style={{
              objectFit: "fill",
              width: "100%",
              height: "auto",
              borderRadius: "12px",
            }}
            preview={false}
          />
        }
      >
        <Divider style={{ margin: "10px 0" }} />
        <Title
          level={4}
          style={{ margin: "0 0 8px 0", fontSize: "16px", lineHeight: "1.4" }}
        >
          iPhone 16 Pro Max 256GB | Chính hãng VN/A
        </Title>
        <div style={{ marginBottom: "16px" }}>
          <Space direction="vertical" size={4}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Text style={{ fontSize: "12px", color: "#52c41a" }}>
                Miễn phí vận chuyển
              </Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                Trả góp 0% qua thẻ tín dụng
              </Text>
            </div>
          </Space>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <div>
            <Text
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#d32f2f",
                marginRight: "8px",
              }}
            >
              30.000.000₫
            </Text>
            <Text delete type="secondary" style={{ fontSize: "14px" }}>
              35.290.000₫
            </Text>
          </div>
        </div>
        <Divider style={{ margin: "12px 0" }} />
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            block
            style={{
              height: "44px",
              borderRadius: "12px",
              fontWeight: "500",
              background: "red",
              border: "none",
            }}
          >
            Mua ngay
          </Button>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
}

export default CardProduct;
