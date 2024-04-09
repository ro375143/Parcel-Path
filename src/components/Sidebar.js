import { Menu, Layout } from 'antd';
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => (
  <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
    <div className="logo" />
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
      <Menu.Item key="1" icon={<PieChartOutlined />}>
        Dashboard
      </Menu.Item>
      {/* Add other Menu.Items here */}
    </Menu>
  </Sider>
);

export default Sidebar;
