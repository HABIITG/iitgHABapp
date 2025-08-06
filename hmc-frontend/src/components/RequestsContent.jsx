import React, { useState, useEffect } from 'react';
import { Menu, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from "../apis";

const RequestsContent = (props) => {
    const [filter, setFilter] = useState('all');
    const [requests, setRequests] = useState([]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'text-green-600 bg-green-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
            case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    const handleStatusUpdate = (requestId, newStatus) => {
        setRequests(prev =>
            prev.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        );
    };

    const handleAccept = async (userId, requestId, newStatus) => {
        try {
            console.log("accepting req...");
            console.log(userId);

            const response = await axios.patch(`${API_BASE_URL}/mess-change/accept`, {
                userId: userId,
            }, {
                withCredentials: true,
            }
            );

            setRequests(prev =>
                prev.map(req =>
                    req.id === requestId ? { ...req, status: newStatus } : req
                )
            );

            console.log("Req Accepted Successfully: ", response);

            return response;
        } catch (error) {
            // console.error("Error accepting MessChange Request:", error);
            // throw error;

            console.error("Network error:", error.message);
            console.error("Error config:", error.config);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
        }
    }

    const handleReject = async (userId, requestId, newStatus) => {
        try {
            console.log("rejecting req...");
            console.log(userId);

            const response = await axios.patch(`${API_BASE_URL}/mess-change/reject`, {
                userId: userId,
            }, {
                withCredentials: true,
            }
            );

            setRequests(prev =>
                prev.map(req =>
                    req.id === requestId ? { ...req, status: newStatus } : req
                )
            );

            console.log("Req Rejected Successfully: ", response);

            return response;
        } catch (error) {
            // console.error("Error rejecting MessChange Request:", error);
            // throw error;

            console.error("Network error:", error.message);
            console.error("Error config:", error.config);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
        }
    }

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(req => req.status === filter);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                console.log("getting messChangeReqs");
                // console.log(props.hostelId);
                // console.log(`${API_BASE_URL}/mess-change/${props.hostelId}`);
                const response = await axios.get(
                    `${API_BASE_URL}/mess-change/${props.hostelId}`,
                    {
                        withCredentials: true,
                    }

                );

                console.log("MessChange list fetched successfully: ", response.data);
                setRequests(response.data);
                return response.data;
            } catch (error) {
                // console.error("Error fetching MessChange Requests:", error);
                // throw error;

                console.error("Network error:", error.message);
                console.error("Error config:", error.config);
                if (error.response) {
                    console.error("Status:", error.response.status);
                    console.error("Data:", error.response.data);
                }
            }
        }

        fetchRequests();
    }, [props.hostelId]);

    return (
        <div className="p-6">
            <div className="text-center py-6 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-blue-600">
                    Mess Change Requests
                </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center mt-6 mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${filter === status
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status === 'all' && ` (${requests.length})`}
                            {status !== 'all' && ` (${requests.filter(r => r.status === status).length})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No requests found</p>
                    </div>
                ) : (
                    filteredRequests.map((request) => (
                        <div key={request._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                                        <span className="text-sm text-gray-500">Roll no. : {request.rollNumber}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Current Mess Hostel:</span> {request.hostelId.hostel_name}
                                    </p>
                                    {/* <p className="text-gray-700">{request.description}</p> */}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(request.status)}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                {/* <span className="text-sm text-gray-500">
                  Submitted: {new Date(request.date).toLocaleDateString()}
                </span> */}

                                {request.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(request.userId, request._id, 'approved')}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(request.userId, request._id, 'rejected')}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RequestsContent;