import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCamera } from '../../service/KameraService';
import { addRent } from '../../service/RentService';
import { addRentDetail } from '../../service/RentDetailService';
import Swal from 'sweetalert';

const AddRent = () => {
  const [rnt_customer, setRnt_customer] = useState('');
  const [rnt_rent_date, setRnt_rent_date] = useState('');
  const [rnt_rent_return, setRnt_rent_return] = useState('');
  const [rnt_time, setRnt_time] = useState('');
  const [rnt_charge, setRnt_charge] = useState('');
  const [rnt_status, setRnt_status] = useState(1);
  const [rnt_total, setRnt_total] = useState('');
  const [cam_id, setCam_id] = useState('');
  const [rnt_created_by] = useState(0);
  const [rnt_created_date] = useState(new Date().toISOString());
  const [camPriceSelected, setCamPriceSelected] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [nameValid, setNameValid] = useState(false);
  const [rentDateValid, setRentDateValid] = useState(false);
  const [returnDateValid, setReturnDateValid] = useState(false);
//   const [timeValid, setTimeValid] = useState(false);
//   const [totalValid, setTotalValid] = useState(false);
  const [camIdValid, setCamIdValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    calculateTime();
    calculateTotal();
  }, [rnt_rent_date, rnt_rent_return, cam_id, rnt_time]);

  const fetchCameras = () => {
    listCamera()
     .then(response => {
        setCameras(response.data.data);
        console.log("Camera data:", response.data.data);
      })
     .catch(error => {
        console.error("Error fetching camera data:", error);
      });
  };

  const handleCustomerChange = e => {
    const value = e.target.value;
    setRnt_customer(value);
    setNameValid(value.trim().length > 0);
  };

  const handleRentDateChange = e => {
    const value = e.target.value;
    setRnt_rent_date(value);
    setRentDateValid(value.trim().length > 0);
  };

  const handleReturnDateChange = e => {
    const value = e.target.value;
    setRnt_rent_return(value);
    setReturnDateValid(value.trim().length > 0);
  };

  const handleTimeChange = e => {
    const value = e.target.value;
    setRnt_time(value);
    // setTimeValid(value.trim().length > 0);
    calculateTotal();
  };

  const handleCamIdChange = e => {
    const value = e.target.value;
    setCam_id(value);
    setCamIdValid(value.trim().length > 0);
    const selectedCamera = cameras.find(camera => camera.cam_id == value);
    console.log("selectedCamera:", selectedCamera);
    if (selectedCamera) {
      setCamPriceSelected(selectedCamera.cam_price); // Update camPriceSelected state
      setRnt_total(selectedCamera.cam_price.toString()); // Update rnt_total state
    }
  };

  const calculateTime = () => {
    const rentDate = new Date(rnt_rent_date);
    const returnDate = new Date(rnt_rent_return);
    const diffTime = Math.abs(returnDate - rentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setRnt_time(diffDays.toString());
  };

  const calculateTotal = () => {
    console.log("camPriceSelected:", camPriceSelected);
    const total = parseFloat(camPriceSelected) * parseFloat(rnt_time);
    setRnt_total(total.toString());
  };

  const saveRent = async (e) => {
    e.preventDefault();
  
    try {
      // Save your rent here
      const response = await api.saveRent({ rnt_customer, cam_id, rnt_rent_date, rnt_rent_return, rnt_time, rnt_total });
      if (response.status === 200) {
        toast.success('Rent added successfully');
        clearFields();
      } else {
        toast.error('Error adding rent');
      }
    } catch (error) {
      console.error('Error adding rent:', error);
      toast.error('Error adding rent');
    }

    const rent = {
rnt_customer,
      rnt_rent_date,
      rnt_rent_return,
      rnt_time,
      rnt_total,
      rnt_charge,
      rnt_status,
      rnt_created_by,
      rnt_created_date
    };

    addRent(rent)
     .then((response) => {
        const rentId = response.data.rnt_id; // assume the API returns the created rent ID
        const rentDetail = {
          drn_subtotal: rnt_total,
          rnt_id: rentId,
          cam_id: cam_id,
        };

        addRentDetail(rentDetail)
         .then((response) => {
            Swal({
              title: "Success",
              text: "Rent and rent detail have been added successfully!",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate('/listrental');
            });
          })
         .catch((error) => {
            console.error("Error adding rent detail:", error);
            Swal({
              title: "Error",
              text: "Failed to add rent detail. Please try again later.",
              icon: "error",
              button: "OK",
            });
          });
      })
     .catch((error) => {
        console.error("Error adding rent:", error);
        Swal({
          title: "Error",
          text: "Failed to add rent. Please try again later.",
          icon: "error",
          button: "OK",
        });
      });
  };

  const isFormValid = () => {
    return nameValid && rentDateValid && returnDateValid && camIdValid;
  };

  return (
    <div className="container-fluid">
      <br />
      <div className="row justify-content-center mb-8" >

        <h5 className="text-center white-text py-4 mb-4">
          <strong>ADD RENT</strong>
        </h5>

        <div className="card shadow mb-4">
          <div className='card-body'>
            <div>
              <br />
            </div>
            <form>
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Customer </label>
                  <input type="text" className={`form-control ${nameValid ? 'is-valid' : 'is-invalid'}`} placeholder="Enter customer name" aria-label="Enter customer name"
                    value={rnt_customer} onChange={handleCustomerChange} />
                </div>
                <div className="col-md-6">
                <label className="form-label">Camera</label>
                <select className={`form-select ${camIdValid? 'is-valid' : 'is-invalid'}`} aria-label="Camera" value={cam_id} onChange={handleCamIdChange}>
            <option value="">Select a camera</option>
            {cameras.map(camera => (
              <option key={camera.cam_id} value={camera.cam_id}>
                {camera.cam_name}
              </option>
            ))}
          </select>
        </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col">
                  <label className="form-label">Rent Date</label>
                  <input type="date" className={`form-control ${rentDateValid ? 'is-valid' : 'is-invalid'}`} placeholder="Enter rent date" aria-label="Enter rent date"
                    value={rnt_rent_date} onChange={handleRentDateChange} />
                </div>
                <div className="col">
                  <label className="form-label">Return Date</label>
                  <input type="date" className={`form-control ${returnDateValid ? 'is-valid' : 'is-invalid'}`} placeholder="Enter return date" aria-label="Enter return date"
                    value={rnt_rent_return} onChange={handleReturnDateChange} />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col">
                    <label className="form-label">Time</label>
                    <input type="text" className={`form-control`} placeholder="Enter time" aria-label="Enter time" value={rnt_time} onChange={handleTimeChange} readOnly />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Total</label>
                    <input type="text" className={`form-control`} placeholder="Enter charge" aria-label="Enter charge" value={rnt_total} readOnly />
                </div>
                </div>
              <button type="submit" className="btn btn-rounded btn-block my-4 white-text font-weight-bold waves-effect z-depth-0" style={{ backgroundColor: '#0059AB' }} onClick={saveRent}>Submit</button>
</form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRent;