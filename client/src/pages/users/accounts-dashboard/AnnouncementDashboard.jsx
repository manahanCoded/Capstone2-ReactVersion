import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AdminDashboard from "@/components/AdminDashboard";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AnnouncementsDashboard() {
    const [announcements, setAnnouncements] = useState([]);
    const [checkUser, setCheckUser] = useState();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRow, setEditingRow] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function checkUser() {
            try {
                const res = await fetch(`${API_URL}/api/user/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    navigate("/user/login");
                    return;
                }
                const data = await res.json();

                if (data.role === "client") {
                    navigate("/");
                    return;
                }

                setCheckUser(data);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401 || err.response.status === 403) {
                        navigate("/user/login");
                    }
                } else {
                    console.error(err);
                }
            }
        }

        checkUser();
    }, [navigate]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${API_URL}/api/announcement/allAnnouncements`);
                const data = await response.json();
                setAnnouncements(data.announcement);
            } catch (error) {
                console.error("Error fetching announcements:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    const handleDeleteClick = (id) => {
        const announcement = announcements.find(ann => ann.announcementsid === id);
        setAnnouncementToDelete(announcement);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await fetch(`${API_URL}/api/announcement/deleteAnnouncement`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: announcementToDelete.announcementsid }),
            });
            setAnnouncements((prev) => prev.filter((ann) => ann.announcementsid !== announcementToDelete.announcementsid));
            setOpenDeleteDialog(false);
            setAnnouncementToDelete(null);
        } catch (error) {
            console.error("Error deleting announcement:", error);
        }
    };

    const handleEditClick = (row) => {
        setEditingRow(row); 
        setOpenDialog(true);
    };
    
    const handleDialogClose = () => {
        setOpenDialog(false);
        setEditingRow(null);  
    };

    

    const handleSaveEdit = async () => {
        if (!editingRow?.title?.trim() || !editingRow?.description?.trim()) {
            alert("Title and description cannot be empty!");
            return;
        }

        if (editingRow?.description?.length < 20) {
            alert("Description must be at least 20 characters long");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/announcement/editAnnouncement`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingRow),
            });
    
            if (!response.ok) throw new Error("Failed to update announcement");
    
            const updatedResponse = await fetch(`${API_URL}/api/announcement/allAnnouncements`);
            const data = await updatedResponse.json();
            setAnnouncements(data.announcement);
    
            alert("Announcement updated successfully!");
            handleDialogClose();
        } catch (error) {
            console.error(error);
            alert("Failed to update announcement.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    
    const filteredAnnouncements = announcements.filter((announcement) => {
        return (
            announcement?.title?.toLowerCase().includes(searchTerm) ||
            announcement?.email?.toLowerCase().includes(searchTerm) ||
            announcement?.description?.toLowerCase().includes(searchTerm) ||
            announcement?.date?.toString().toLowerCase().includes(searchTerm)
        );
    });

    const columns = [
        { field: "announcementsid", headerName: "ID", width: 90 },
        { field: "title", headerName: "Title", width: 150 },
        { field: "email", headerName: "Publisher", width: 150 },
        { field: "date", headerName: "Date", width: 150 },
        {
            field: "edit",
            headerName: "Edit",
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#333333', '&:hover': { backgroundColor: '#222222' } }}
                    size="small"
                    onClick={() => handleEditClick(params.row)}
                >
                    Edit
                </Button>
            ),
        },
        {
            field: "delete",
            headerName: "Delete",
            width: 100,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleDeleteClick(params.row.announcementsid)}
                    sx={{ backgroundColor: '#b91c1c', '&:hover': { backgroundColor: '#991b1b' } }}
                >
                    Delete
                </Button>
            ),
        },
    ];

    const normalizedAnnouncements = filteredAnnouncements.map((ann, index) => ({
        ...ann,
        id: ann.announcementsid || index,
        date: formatDate(ann.date)
    }));

    return (
        <div className="mt-14 h-screen text-sm">
            <AdminDashboard />
            <section className="mt-8">
                <MaxWidthWrapper>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title or publisher"
                        />
                    </Box>
                    <div className="w-full">
                        <DataGrid
                            rows={normalizedAnnouncements}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            autoHeight
                            loading={loading}
                        />
                    </div>
                </MaxWidthWrapper>
            </section>

            {/* Edit Announcement Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose} sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "900px" } }}>
                <DialogTitle>Edit Announcement</DialogTitle>
                <DialogContent>
                    <div className="flex flex-col gap-4">
                        <TextField
                            label="Title"
                            value={editingRow?.title || ''}
                            onChange={(e) => setEditingRow({...editingRow , title: e.target.value})}
                            fullWidth
                            margin="dense"
                            required
                            error={!editingRow?.title?.trim()}
                            helperText={!editingRow?.title?.trim() ? "Title is required" : ""}
                        />
                        <div>
                            <EditorToolbar toolbarId="t3" />
                            <ReactQuill
                                theme="snow"
                                value={editingRow?.description || ''}
                                onChange={(value) => setEditingRow({ ...editingRow, description: value })}
                                placeholder="Write something..."
                                modules={modules("t3")}
                                formats={formats}
                                className="bg-white border rounded h-[55vh] overflow-y-auto"
                            />
                            {!editingRow?.description?.trim() && (
                                <p className="text-red-500 text-xs mt-1">Description is required</p>
                            )}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}
                        sx={{ color: '#333333', '&:hover': { color: '#222222' } }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSaveEdit}
                        disabled={!editingRow?.title?.trim() || !editingRow?.description?.trim() || isLoading}
                        sx={{ color: '#b91c1c', '&:hover': { color: '#991b1b' } }}>
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete the announcement titled:</p>
                    <p className="font-bold my-2">"{announcementToDelete?.title}"</p>
                    <p>This action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}
                        sx={{ color: '#333333', '&:hover': { color: '#222222' } }}>
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete}
                        sx={{ color: '#b91c1c', '&:hover': { color: '#991b1b' } }}>
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}