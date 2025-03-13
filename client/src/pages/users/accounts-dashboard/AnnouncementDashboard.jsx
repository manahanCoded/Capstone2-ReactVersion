import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AdminDashboard from "@/components/AdminDashboard";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ReactQuill from "react-quill-new";
import EditorToolbar, { modules, formats } from "@/components/EditToolbar";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AnnouncementsDashboard() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRow, setEditingRow] = useState(null);  // To track the row being edited
    const [openDialog, setOpenDialog] = useState(false);  // To control dialog visibility

    const navigate = useNavigate()

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

    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/api/announcement/deleteAnnouncement`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
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
        setEditingRow(null);  // Reset editingRow when dialog is closed
    };

    const handleSaveEdit = () => {
        fetch(`${API_URL}/api/announcement/editAnnouncement`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingRow),
        })
            .then(() => {
                setAnnouncements((prev) =>
                    prev.map((ann) => (ann.id === editingRow.id ? { ...ann, ...editingRow } : ann))
                );
                handleDialogClose(); // Close dialog after saving
            })
            .catch((error) => console.error("Error updating announcement:", error));
    };

    const handleFieldChange = (field, value) => {
        setEditingRow((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const filteredAnnouncements = announcements.filter(
        (ann) =>
            ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ann.publisher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "title", headerName: "Title", width: 150 },
        { field: "publisher", headerName: "Publisher", width: 150 },
        { field: "description", headerName: "Description", width: 250 },
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
                    onClick={() => handleDelete(params.row.id)}
                    sx={{ backgroundColor: '#b91c1c', '&:hover': { backgroundColor: '#991b1b' } }}
                >
                    Delete
                </Button>
            ),
        },
    ];

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
                            rows={filteredAnnouncements}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10, 20, 50]}
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
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Publisher"
                            value={editingRow?.publisher || ''}
                            onChange={(e) => handleFieldChange("publisher", e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <div>
                            <EditorToolbar toolbarId="t3" />
                            <ReactQuill
                                theme="snow"
                                value={editingRow?.description || ''}  
                                onChange={(value) => handleFieldChange("description", value)} 
                                placeholder="Write something..."
                                modules={modules("t3")}
                                formats={formats}
                                className="bg-white border rounded h-[55vh] overflow-y-auto"
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}
                        sx={{ color: '#333333', '&:hover': { color: '#222222' } }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}
                        sx={{ color: '#b91c1c', '&:hover': { color: '#991b1b' } }}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
