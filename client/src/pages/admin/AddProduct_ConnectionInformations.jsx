import { Form, Input, Switch, Divider, Row, Col } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

function ConnectionInformation({ product, setProduct }) {
  return (
    <Form layout="vertical">
      <div className="flex gap-12 items-center">
        <span className="text-sm text-primary font-medium">
          Thông tin kết nối
        </span>
        <div className="flex-1 border-t border-t-gray-300"></div>
      </div>

      <Row gutter={[10, 0]}>
        <Col span={8}>
          <Form.Item
            name="wifi"
            label="Wifi"
           
          >
            <Input
              placeholder="Nhập thông tin Wifi"
              style={{ padding: "12px 24px" }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="bluetooth"
            label="Bluetooth"
          
          >
            <Input
              placeholder="Nhập thông tin Bluetooth"
              style={{ padding: "12px 24px" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="nfc" label="NFC" valuePropName="checked">
            <Switch
            
              checkedChildren="Có"
              unCheckedChildren="Không"
              style={{
                backgroundColor: product?.connectivity?.nfc
                  ? "#52c41a"
                  : "#d9d9d9",
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="cellular"
            label="Công nghệ di động"
           
          >
            <Input
              placeholder="Nhập công nghệ di động"
              style={{ padding: "12px 24px" }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="ports"
            label="Cổng kết nối"
           
          >
            <Input
              placeholder="Nhập thông tin cổng kết nối (phân cách bằng dấu phẩy)"
              style={{ padding: "12px 24px" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="gps" label="GPS" valuePropName="checked">
            <Switch
             
              checkedChildren="Có"
              unCheckedChildren="Không"
              style={{
                backgroundColor: product?.connectivity?.gps
                  ? "#d9d9d9"
                  : "#52c41a",
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default ConnectionInformation;
