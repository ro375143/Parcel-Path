'use client';
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { db } from '../firebase/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button, Modal, Form, message } from 'antd';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';
import Link from 'next/link';
import './grids.css';
import { useRouter } from 'next/navigation';
const FeedbackButtonRenderer = ({ params, onEdit, onDelete }) => {
    
    return (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', gap: '8px'}}>
            <Button 
                className='action-button'
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit(params.data)} 
            >
                REPLY
            </Button>
            
        </div>
    );
};


const FeedbackGrid = () => {
    const router = useRouter();
    const [rowData, setRowData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState(null);
    const [adminResponse, setAdminResponse] = useState('');

    const columns = [
        { headerName: "ID", field: "id", flex: 1},
        { headerName: "Feedback ID", field: "feedbackId", flex: 1 },
        { headerName: "Customer ID", field: "customerId", flex: 1 },
        { headerName: "Feedback", field: "content", flex: 1 },
        { headerName: "Feedback Date", field: "createdAt",
    cellRenderer: (params) => {
        const date = params.value?.toDate ? params.value.toDate() : null;
        return date ? moment(date).format("MM-DD-YYYY") : '';
    },
    flex: 1
    },
        { headerName: "Admin Acknowledged", field: "adminAcknowledgement", flex: 1 },
        { headerName: "Admin Response", field: "adminResponse", flex: 1 },
        {
            headerName: "Actions",
            field: "feedbackId",
            cellRenderer: (params) => (
                <FeedbackButtonRenderer
                    params={params}
                    onEdit={editFeedback}
                    onDelete={deleteFeedback}
                />
            ),
            flex: 1
        }
    ];
    
    const editFeedback = (feedback) => {
        setCurrentFeedback(feedback);
        setAdminResponse(feedback.adminResponse);
        setIsModalOpen(true);
    };

    const handleResponseChange = (e) => {
        setAdminResponse(e.target.value);
    };

    const submitResponse = async () => {
        const feedbackRef = doc(db, "Feedback", currentFeedback.id);
        await updateDoc(feedbackRef, { adminResponse, adminAcknowledgement: true});
        fetchFeedback();
        setIsModalOpen(false);
        Modal.confirm({
            title: 'Response submitted Successfully',
            content: 'What would you like to do next?',
            okText: 'Continue Responding',
            cancelText: 'Return to Dashboard',
            className: 'modal-theme',
            onOk: () => {
            
            },
            onCancel: () => {
                message.success('Returning to Dashboard');
                // redirect to dashboard
                return router.push('/admin');
            }
        });
    };


    const deleteFeedback = async (feedback) => {
        const feedbackRef = doc(db, "Feedback", feedback.id);
        await deleteDoc(feedbackRef);
        fetchFeedback();
    };

    const fetchFeedback = async () => {
        const feedbackCollection = collection(db, "Feedback");
        const feedbackSnapshot = await getDocs(feedbackCollection);
        const feedbackList = feedbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }
        )
        );
        setRowData(feedbackList);
    };

    useEffect(() => {
        fetchFeedback();
    }, []);

    return (
        <div className={'grids-theme ag-theme-balham'} style={{ height: '100%', width: '100%', padding: '0 20px'}}>
            <AgGridReact
                rowData={rowData}
                columnDefs={columns}
                defaultColDef={{ resizable: true }}
                domLayout='autoHeight'
                rowHeight={40}
                style={{ borderRadius: '10px', overflow: 'hidden' }}

            />
            <Modal
                className='modal-theme'
                title="RESPONDING TO FEEDBACK"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                
                
            >
                <Form 
                layout='vertical'
                className='feedback-form'
                onFinish={submitResponse}>
                    <Form.Item
                     label="Feedback"
                     
                     >
                        <textarea 
                        className='feedback-textarea'
                        value={currentFeedback?.content} disabled />
                    </Form.Item>
                    <Form.Item label="Response">
                        <textarea 
                        className='feedback-textarea'
                        value={adminResponse} onChange={handleResponseChange} />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type="primary"
                            htmlType="submit"
                            className='action-button'
                        >
                            SEND RESPONSE
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default FeedbackGrid;
