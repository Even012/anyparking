import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';

export default function CreateVehicle({open, handleClose}) {
    const token = localStorage.getItem("token");
    const [newVehicle, setNewVehicle] = useState({
        make: '',
        model: '',
        year: '',
        licensePlate: '',
        color: ''
      });

    const handleNewVehicleChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle((prevVehicle) => ({
            ...prevVehicle,
            [name]: value
        }));
    };
    const handleAddVehicle = async () => {
        console.log(newVehicle);
        try {
            const res = await axios.post("http://localhost:8888/user/vehicles/new", newVehicle, { 
                headers: {Authorization: `Bearer ${token}` } 
            });
    
            if(res.status === 200) {
                console.log("new vehicle created!")
            } 
            handleClose();
        } catch(error) {
            alert(error.response.data.error);
        }       
    }
    
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Vehicle</DialogTitle>
        <DialogContent>
          <TextField
            label="Make"
            variant="outlined"
            name="make"
            fullWidth
            value={newVehicle.make}
            onChange={handleNewVehicleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Model"
            variant="outlined"
            name="model"
            fullWidth
            value={newVehicle.model}
            onChange={handleNewVehicleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Year"
            variant="outlined"
            name="year"
            fullWidth
            value={newVehicle.year}
            onChange={handleNewVehicleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="License Plate"
            variant="outlined"
            name="licensePlate"
            fullWidth
            value={newVehicle.licensePlate}
            onChange={handleNewVehicleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Color"
            variant="outlined"
            name="color"
            fullWidth
            value={newVehicle.color}
            onChange={handleNewVehicleChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddVehicle} variant="contained" color="primary">
            Add Vehicle
          </Button>
        </DialogActions>
      </Dialog>
  )
}
