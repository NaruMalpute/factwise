import React, { useState } from "react";
import { Avatar, Collapse, Input, Button, Modal, Form, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import InitialData from "./userData.json";

const { Panel } = Collapse;

const App = () => {
  const [userData, setUserData] = useState(InitialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [form] = Form.useForm();

  const filteredUsers = userData.filter((user) =>
    `${user.first} ${user.last}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const openEditModal = (user) => {
    form.resetFields();  
    setCurrentUser(user);
    form.setFieldsValue({
      first: user?.first || '',
      last: user?.last || '',
      email: user?.email || '',
      description: user?.description || '',
    }); 
    setIsModalVisible(true); 
  };
  

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        setUserData(userData.filter((user) => user.id !== id));
        message.success("User deleted successfully");
      },
      onCancel() {
        console.log("Delete action canceled.");
      },
    });
  };

  const handleSave = (values) => {
    setUserData((prev) =>
      prev.map((user) =>
        user.id === currentUser?.id ? { ...user, ...values } : user
      )
    );
    setIsModalVisible(false);  
    setCurrentUser(null);  
    form.resetFields();  
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setCurrentUser(null);  
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Input.Search
        placeholder="Search by name"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: 20,
          width: "30%",
          height: "50px",
        }}
      />
      <div
        style={{
          width: "30%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {filteredUsers.map((user) => (
          <Collapse
            key={user.id}  
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
            }}
          >
            <Panel
              header={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={user.picture} style={{ marginRight: 10 }} />
                  <span>
                    {user.first} {user.last}
                  </span>
                </div>
              }
              extra={
                <div>
                  <EditOutlined
                    style={{
                      marginRight: 10,
                      color: "blue",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(user);
                    }}
                  />
                  <DeleteOutlined
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.id);
                    }}
                  />
                </div>
              }
            >
              <p>
                <b>Age:</b> {calculateAge(user.dob)} years
              </p>
              <p>
                <b>Gender:</b> {user.gender}
              </p>
              <p>
                <b>Country:</b> {user.country}
              </p>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>Description:</b> {user.description}
              </p>
            </Panel>
          </Collapse>
        ))}
      </div>

      <Modal
        title="Edit User"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >

          <Form
            form={form}
            layout="vertical"
            key={currentUser}
            onFinish={handleSave}
          >
            <Form.Item
              label="First Name"
              name="first"
              rules={[
                { required: true, message: "Please enter the first name" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last"
              rules={[
                { required: true, message: "Please enter the last name" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter the email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<CheckOutlined />}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "blue",
                    color: "white",
                    marginRight: 10,
                    border: "none",
                  }}
                />
                <Button
                  onClick={handleCancel}
                  icon={<CloseOutlined />}
                  style={{
                    borderRadius: "50%",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                  }}
                />
              </Form.Item>
            </div>
          </Form>

      </Modal>
    </div>
  );
};

export default App;
