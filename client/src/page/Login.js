// LoginPage.js
import React from 'react';
import { Form, Input, Button, message} from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate=useNavigate();
    const onFinish = async (values) => {
        const { email, password } = values;
        try {
          const response = await axios.post('http://localhost:3001/api/login', { email, password });
          if (response.data.message === "Login successful.") {
            message.success('Login successful');
            navigate("/dashboard")
             // Show success message
            // Optionally, navigate to another page or perform other actions on successful login
          } else {
            alert('Login failed. Please check your email and password.'); // Show error message
          }
        } catch (error) {
          console.error('Login error:', error);
          alert('An error occurred during login. Please try again.'); // Show error message
        }
      };

  return (
    <div style={{ width: 400, margin: '0 auto', marginTop: 100 }}>
    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>User Management Login</h2>
    <Form
      name="loginForm"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ background: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', maxWidth: '400px', margin: '0 auto' }}
    >
        
      <Form.Item
        label="Email-Id "
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input placeholder='Enter your email' style={{ width: '98%' }} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password  placeholder="Enter your password"  style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: '20px' }}>
          Login
        </Button>
      </Form.Item>
    </Form>
  </div>
  );
};

export default Login;
