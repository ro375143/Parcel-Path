// components/Navbar.js
import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const Navbar = () => {
  return (
    <Menu mode="horizontal">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="users" icon={<UserOutlined />}>
        <Link href="/users">
          <a>Users</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="uploads" icon={<UploadOutlined />}>
        <Link href="/uploads">
          <a>Uploads</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
