import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

const initialColumns = [
  { field: 'id', headerName: 'ID', width: 70, editable: false },
  { field: 'firstName', headerName: 'First name', width: 130, editable: true },
  { field: 'lastName', headerName: 'Last name', width: 130, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    editable: false, // This column is not editable
  },
];

const initialRows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
  const [columns, setColumns] = React.useState(initialColumns);
  const [rows, setRows] = React.useState(initialRows);
  const [newColumnName, setNewColumnName] = React.useState('');
  const [columnToDelete, setColumnToDelete] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleAddColumn = () => {
    if (newColumnName) {
      const newColumn = {
        field: newColumnName.toLowerCase().replace(/\s+/g, ''),
        headerName: newColumnName,
        width: 150,
        editable: true,
      };
      setColumns((prevColumns) => [...prevColumns, newColumn]);
      setNewColumnName('');
      setMessage('Column added successfully!');
      setOpenSnackbar(true);
    } else {
      setMessage('Please enter a valid column name.');
      setOpenSnackbar(true);
    }
  };

  const handleDeleteColumn = () => {
    if (columnToDelete) {
      const updatedColumns = columns.filter(
        (col) => col.field !== columnToDelete.toLowerCase().replace(/\s+/g, '')
      );
      if (updatedColumns.length === columns.length) {
        setMessage('Column not found.');
      } else {
        setMessage('Column deleted successfully!');
      }
      setColumns(updatedColumns);
      setColumnToDelete('');
      setOpenSnackbar(true);
    } else {
      setMessage('Please enter a valid column name to delete.');
      setOpenSnackbar(true);
    }
  };

  const handleRowEdit = (updatedRow) => {
    const updatedRows = rows.map((row) =>
      row.id === updatedRow.id ? { ...row, ...updatedRow } : row
    );
    setRows(updatedRows);
    return updatedRow;
  };

  // Reset table to initial state
  const handleCreateNewTable = () => {
    setColumns(initialColumns);
    setRows(initialRows);
    setMessage('New table created!');
    setOpenSnackbar(true);
  };

  // Ensure all columns are editable (except the 'id' column)
  const editableColumns = columns.map((col) => ({
    ...col,
    editable: true,
  }));

  return (
    <MaxWidthWrapper className="mt-14 h-screen">
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        DATA TABLE
      </Typography>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <div className="w-full mt-8 flex flex-col sm:flex-row gap-6">
          <Grid container spacing={2} justifyContent="space-between">

            {/* New Column Name */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="New Column Name"
                variant="outlined"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: 'white',
                  '& .MuiInputBase-root': {
                    height: '45px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    padding: '12px',
                  },
                }}
              />
            </Grid>

            {/* Add Column Button */}
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                onClick={handleAddColumn}
                fullWidth
                sx={{
                  height: '45px',
                  backgroundColor: '#b91c1c',
                  color: 'white',
                  '&:hover': { backgroundColor: '#9e1414' },
                  padding: '10px 20px',
                }}
              >
                Add Column
              </Button>
            </Grid>

            {/* Column to Delete */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Column to Delete"
                variant="outlined"
                value={columnToDelete}
                onChange={(e) => setColumnToDelete(e.target.value)}
                fullWidth
                sx={{
                  backgroundColor: 'white',
                  '& .MuiInputBase-root': {
                    height: '45px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    padding: '12px',
                  },
                }}
              />
            </Grid>

            {/* Delete Column Button */}
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="contained"
                onClick={handleDeleteColumn}
                fullWidth
                sx={{
                  height: '45px',
                  backgroundColor: '#c62828',
                  color: 'white',
                  '&:hover': { backgroundColor: '#b21f1f' },
                  padding: '10px 20px',
                }}
              >
                Delete Column
              </Button>
            </Grid>

            {/* Create New Table Button */}
            <Grid item xs={12} sm={12} md={4}>
              <Button
                variant="contained"
                onClick={handleCreateNewTable}
                fullWidth
                sx={{
                  height: '45px',
                  backgroundColor: '#333333',
                  color: 'white',
                  '&:hover': { backgroundColor: '#004d40' },
                  padding: '10px 20px',
                }}
              >
                Create New Table
              </Button>
            </Grid>

          </Grid>
        </div>
      </Grid>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={editableColumns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
          processRowUpdate={handleRowEdit}
        />
      </Paper>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={message.includes('success') ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
    </MaxWidthWrapper>
  );
}
