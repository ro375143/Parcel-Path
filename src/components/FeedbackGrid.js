"use client";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { db } from "@/app/firebase/config";
import "firebase/firestore";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  FieldPath,
  getDoc, // Add this import
} from "firebase/firestore"; // Update the import
import { Button, Modal, Form, message } from "antd";
import moment from "moment";
import { EditOutlined } from "@ant-design/icons";
import Link from "next/link";
import "./grids.css";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config"; // Add this import
import { onAuthStateChanged } from "firebase/auth";

const FeedbackButtonRenderer = ({
  params,
  onEdit,
  onDelete,
  userRole,
  onView,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      {userRole === "admin" && ( // Only render edit button for admin
        <Button
          className="action-button"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => onEdit(params.data)}
        >
          REPLY
        </Button>
      )}
      {(userRole === "customer" || userRole === "driver") && (
        <Button
          className="action-button"
          type="primary"
          onClick={() => onView(params.data)}
        >
          VIEW
        </Button>
      )}
    </div>
  );
};

const FeedbackGrid = () => {
  const router = useRouter();
  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [user, setUser] = useState(null);
  const [userRole, setRole] = useState(null);

  let columns = [];
  if (userRole === "admin") {
    columns = [
      { headerName: "Feedback ID", field: "id", flex: 1 },
      { headerName: "Customer ID", field: "customerId", flex: 1 },
      { headerName: "Feedback", field: "description", flex: 1 },
      {
        headerName: "Feedback Date",
        field: "createdAt",
        cellRenderer: (params) => {
          const date = params.value?.toDate ? params.value.toDate() : null;
          return date ? moment(date).format("MM-DD-YYYY") : "";
        },
        flex: 1,
      },
      {
        headerName: "Admin Acknowledged",
        field: "adminAcknowledgement",
        flex: 1,
      },
      { headerName: "Admin Response", field: "adminResponse", flex: 1 },
      {
        headerName: "Actions",
        field: "feedbackId",
        cellRenderer: (params) => (
          <FeedbackButtonRenderer
            params={params}
            onEdit={editFeedback}
            onDelete={deleteFeedback}
            userRole={userRole}
          />
        ),
        flex: 1,
      },
    ];
  } else if (userRole === "customer") {
    columns = [
      { headerName: "Feedback ID", field: "id", flex: 1 },
      { headerName: "Admin ID", field: "adminId", flex: 1 },
      { headerName: "Feedback", field: "description", flex: 1 },
      {
        headerName: "Feedback Date",
        field: "createdAt",
        cellRenderer: (params) => {
          const date = params.value?.toDate ? params.value.toDate() : null;
          return date ? moment(date).format("MM-DD-YYYY") : "";
        },
        flex: 1,
      },
      {
        headerName: "Admin Acknowledged",
        field: "adminAcknowledgement",
        flex: 1,
      },
      { headerName: "Admin Response", field: "adminResponse", flex: 1 },
      {
        headerName: "Actions",
        field: "feedbackId",
        cellRenderer: (params) => (
          <FeedbackButtonRenderer
            params={params}
            onEdit={editFeedback}
            onDelete={deleteFeedback}
            userRole={userRole}
            onView={viewFeedback}
          />
        ),
        flex: 1,
      },
    ];
  } else if (userRole === "driver") {
    columns = [
      { headerName: "Feedback ID", field: "id", flex: 1 },
      { headerName: "Admin ID", field: "adminId", flex: 1 },
      { headerName: "Customer ID", field: "customerId", flex: 1 },
      { headerName: "Feedback", field: "description", flex: 1 },
      {
        headerName: "Feedback Date",
        field: "createdAt",
        cellRenderer: (params) => {
          const date = params.value?.toDate ? params.value.toDate() : null;
          return date ? moment(date).format("MM-DD-YYYY") : "";
        },
        flex: 1,
      },
      {
        headerName: "Admin Acknowledged",
        field: "adminAcknowledgement",
        flex: 1,
      },
      { headerName: "Admin Response", field: "adminResponse", flex: 1 },
      {
        headerName: "Actions",
        field: "feedbackId",
        cellRenderer: (params) => (
          <FeedbackButtonRenderer
            params={params}
            onEdit={editFeedback}
            onDelete={deleteFeedback}
            userRole={userRole}
            onView={viewFeedback}
          />
        ),
        flex: 1,
      },
    ];
  }

  const editFeedback = (feedback) => {
    setCurrentFeedback(feedback);
    setAdminResponse(feedback.adminResponse);
    setIsModalOpen(true);
  };
  const viewFeedback = (feedback) => {
    setCurrentFeedback(feedback);
    setAdminResponse(feedback.adminResponse);
    setIsModalOpen(true);
  };

  const handleResponseChange = (e) => {
    setAdminResponse(e.target.value);
  };

  const submitResponse = async () => {
    const feedbackRef = doc(db, "Feedback", currentFeedback.id);
    await updateDoc(feedbackRef, { adminResponse, adminAcknowledgement: true });
    fetchFeedback();
    setIsModalOpen(false);
    Modal.confirm({
      title: "Response submitted Successfully",
      content: "What would you like to do next?",
      okText: "Continue Responding",
      cancelText: "Return to Dashboard",
      className: "modal-theme",
      onOk: () => {},
      onCancel: () => {
        message.success("Returning to Dashboard");
        // redirect to dashboard
        return router.push("/admin");
      },
    });
  };

  const deleteFeedback = async (feedback) => {
    const feedbackRef = doc(db, "Feedback", feedback.id);
    await deleteDoc(feedbackRef);
    fetchFeedback();
  };

  const fetchRole = async (userId) => {
    const uid = userId.uid;
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setRole(userDoc.data().role);
    }
  };

  const fetchFeedback = async (userId) => {
    if (!userId) {
      return;
    }
    const uid = userId.uid;
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const role = userDoc.data().role;
      let feedbackQuery;
      if (role === "customer") {
        feedbackQuery = query(
          collection(db, "Feedback"),
          where("customerId", "==", uid)
        );
      } else if (role === "admin") {
        feedbackQuery = query(
          collection(db, "Feedback"),
          where("adminId", "==", uid)
        );
      } else if (role === "driver") {
        feedbackQuery = query(
          collection(db, "Feedback"),
          where("driverId", "==", uid)
        );
      }

      if (feedbackQuery) {
        const feedbackSnapshot = await getDocs(feedbackQuery);
        const feedbackList = feedbackSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRowData(feedbackList);
      } else {
        console.log("No feedback tracked");
        setRowData([]);
      }
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchRole(currentUser);
        fetchFeedback(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div
      className={"grids-theme ag-theme-balham"}
      style={{ height: "100%", width: "100%", padding: "0 20px" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        defaultColDef={{ resizable: true }}
        domLayout="autoHeight"
        rowHeight={40}
        style={{ borderRadius: "10px", overflow: "hidden" }}
      />
      <Modal
        className="modal-theme"
        title="RESPONDING TO FEEDBACK"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          className="feedback-form"
          onFinish={submitResponse}
        >
          <Form.Item label="Feedback">
            <textarea
              className="feedback-textarea"
              value={currentFeedback?.description}
              disabled
            />
          </Form.Item>
          <Form.Item label="Response">
            {userRole === "admin" ? (
              <textarea
                className="feedback-textarea"
                value={adminResponse}
                onChange={handleResponseChange}
              />
            ) : (
              <div className="feedback-textarea">
                {currentFeedback?.adminResponse}
              </div>
            )}
          </Form.Item>
          <Form.Item>
            {userRole === "admin" && (
              <Button
                type="primary"
                htmlType="submit"
                className="action-button"
              >
                SEND RESPONSE
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackGrid;
