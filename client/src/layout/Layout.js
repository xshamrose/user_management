import React, { useState, useEffect,useRef } from 'react';
import { Table, Button, Space, Modal, Form, Input } from 'antd';
import axios from "axios";
import { PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import "./layout.css";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick, // Ensure onClick is included in the item object
  };
}

const Home = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [dashboardBuilding, setDashboardBuilding] = useState(true);
  const [userDetails, setUserDetails] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
const [userToDelete, setUserToDelete] = useState(null);
const [breadcrumbItems, setBreadcrumbItems] = useState(['Home']);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const editFormRef = useRef(null);
  useEffect(() => {
    // Update breadcrumb items based on the current view
    if (currentView === 'dashboard') {
      setBreadcrumbItems(['Home', 'Dashboard']);
    } else if (currentView === 'userDetails') {
      setBreadcrumbItems(['Home', 'User']);
    }
  }, [currentView]);
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users');
        if (Array.isArray(response.data.data)) {
          setUserDetails(response.data.data);
          setCurrentView('userDetails');
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };
    useEffect(() => {
    fetchUserDetails();
  }, []);

  const columns = [
    {
      title: 'Name',
       dataIndex: 'name', // Change this to 'name' to match the new data structure
    key: 'name',
    render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile_number',
      key: 'mobile_number',
    },
    {
      title: 'User Role',
      dataIndex: 'user_role',
      key: 'user_role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showModal(record)}>Edit</Button>
          <Button type="danger" onClick={() => { setUserToDelete(record); setIsDeleteModalVisible(true); }}>Delete</Button>
        </Space>
      ),
    },
  ];

  const showModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
    
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdate = async () => {
    try {
        const formValues = editFormRef.current.getFieldsValue();
      const { email, firstname, lastname, mobile_number, user_role,password } = formValues;
      const response = await axios.put(`http://localhost:3001/api/update`, {
        firstname,
        lastname,
        email,
        mobile_number,
        user_role,
        password
      });
      if (response.status === 200) {
        console.log(response.data.message);
        setIsModalVisible(false);
        fetchUserDetails();
      } else {
        console.error('Failed to update user:', response.data);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCreateUser = async (value) => {
    console.log(value);
    try {
        
      // Construct the data object to match the backend expectations
      const userData = {
        firstname: value.firstname,
        lastname: value.lastname,
        email: value.email,
        mobileNumber: value.mobile_number,
        userRole: value.user_role,
        password: value.password, // Ensure this is hashed on the backend
      };
    
      // Send the POST request to the backend
      const response = await axios.post('http://localhost:3001/api/insert', userData);
      if (response.status === 201) {
        console.log(response.data.message); // Log the success message
        setIsCreateModalVisible(false); // Close the modal
        // Optionally, refresh the user details or show a success message
        fetchUserDetails();
      } else {
        console.error('Failed to create user:', response.data);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error, e.g., show an error message
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/delete/${userToDelete.email}`);
      if (response.status === 200) {
        console.log(response.data.message);
        // Close the confirmation modal
        setIsDeleteModalVisible(false);
        // Optionally, refresh the user details
        fetchUserDetails();
      } else {
        console.error('Failed to delete user:', response.data);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={[
          getItem('Dashboard', '1', <PieChartOutlined />, null, () => setDashboardBuilding(true)),
          getItem('User', '2', <UserOutlined />, null, () => setDashboardBuilding(false)),
        ]} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
           <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            {breadcrumbItems.map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {dashboardBuilding? (
              <p>dashboard in process...</p>
            ) : (
              <div className="align-end">
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  Add User
                </Button>
                <Table dataSource={userDetails} columns={columns} rowKey="id" style={{ width: '100%', height: '100%' }} />
              </div>
            )}
          </div>
        </Content>
        {/* <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Sham Design ©{new Date().getFullYear()} Created by Sham India
        </Footer> */}
      </Layout>
      <Modal
        title="Edit User details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" htmlType='submit' type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
        <Form ref={editFormRef} onFinish={handleUpdate} initialValues={selectedUser}>
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: 'Please input the user\'s name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: 'Please input the user\'s name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input the user\'s email!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Mobile No"
            name="mobile_number"
            rules={[{ required: true, message: 'Please input the user\'s mobile no!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="User Role"
            name="user_role"
            rules={[{ required: true, message: 'Please input the user\'s role!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input the user\'s password!' }]}
          >
            <Input.Password disabled />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Create User"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
       footer={null}
      >
 <Form onFinish={handleCreateUser}>
  <Form.Item
    label="First Name"
    name="firstname"
    rules={[{ required: true, message: 'Please input the user\'s first name!' }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    label="Last Name"
    name="lastname"
    rules={[{ required: true, message: 'Please input the user\'s last name!' }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    label="Email"
    name="email"
    rules={[{ required: true, message: 'Please input the user\'s email!' }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    label="Mobile No"
    name="mobile_number"
    rules={[{ required: true, message: 'Please input the user\'s mobile no!' }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    label="User Role"
    name="user_role"
    rules={[{ required: true, message: 'Please input the user\'s role!' }]}
  >
    <Input />
  </Form.Item>
  <Form.Item
    label="Password"
    name="password"
    rules={[{ required: true, message: 'Please input the user\'s password!' }]}
  >
    <Input.Password />
  </Form.Item>
  <Form.Item>
    <div style={{display:"flex", justifyContent:"space-between"}}>
  <Button key="back" onClick={() => setIsCreateModalVisible(false)}>
            Cancel
          </Button>
 
      <Button type="primary" htmlType="submit">
        Create
      </Button>
      </div>
    </Form.Item>

</Form>
      </Modal>
      <Modal
  title="Confirm Delete"
  visible={isDeleteModalVisible}
  onCancel={() => setIsDeleteModalVisible(false)}
  footer={[
    <Button key="back" onClick={() => setIsDeleteModalVisible(false)}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={handleDelete}>
      Confirm Delete
    </Button>,
  ]}
>
  Are you sure you want to delete this user?
</Modal>
    </Layout>
  );
};

export default Home;
