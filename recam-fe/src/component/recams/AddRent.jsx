import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCamera, deleteCamera } from '../../service/KameraService';
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
  const [cam_ids, setCam_ids] = useState([]);
  const [rnt_created_by] = useState(0);
  const [rnt_created_date] = useState(new Date().toISOString());
  const [camPriceSelected, setCamPriceSelected] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [nameValid, setNameValid] = useState(false);
  const [rentDateValid, setRentDateValid] = useState(false);
  const [returnDateValid, setReturnDateValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    calculateTime();
    calculateTotal();
  }, [rnt_rent_date, rnt_rent_return, cam_ids, rnt_time,cameras]);

  const fetchCameras = () => {
    listCamera()
      .then((response) => {
        const filteredCameras = response.data.data.filter((camera) => camera.cam_status === 1);
        setCameras(filteredCameras);
        console.log("Camera data:", filteredCameras);
      })
      .catch((error) => {
        console.error("Error fetching camera data:", error);
      });
  };

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    setRnt_customer(value);
    setNameValid(value.trim().length > 0);
  };

  const handleRentDateChange = (e) => {
    const value = e.target.value;
    setRnt_rent_date(value);
    setRentDateValid(value.trim().length > 0);
  };

  const handleReturnDateChange = (e) => {
    const value = e.target.value;
    setRnt_rent_return(value);
    setReturnDateValid(value.trim().length > 0);
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setRnt_time(value);
    calculateTotal();
  };

  const handleCamCheck = (camera) => {
    if (cam_ids.includes(camera.cam_id)) {
      // Uncheck the checkbox and remove the camera ID from the cam_ids array
      setCam_ids(cam_ids.filter((id) => id !== camera.cam_id));
      setCamPriceSelected(0);
      setRnt_total((prevTotal) => prevTotal - parseFloat(camera.cam_price) * parseFloat(rnt_time));
    } else {
      // Check the checkbox and add the camera ID to the cam_ids array
      setCam_ids([...cam_ids, camera.cam_id]);
      setCamPriceSelected(camera.cam_price);
      setRnt_total((prevTotal) => prevTotal + parseFloat(camera.cam_price) * parseFloat(rnt_time));
      // Call the deleteCamera function from the backend to update the cam_status to 0
      deleteCamera(camera)
        .then((response) => {
          console.log("Camera status updated to non-active:", response.data);
        })
        .catch((error) => {
          console.error("Error updating camera status:", error);
        });
    }
  };
  
  const deleteCameraAndFilter = (camera) => {
    // Call deleteCamera with the correct Camera object
    deleteCamera(camera);
  
    // Filter cameras state
    setCameras(cameras.filter((c) => c.cam_id !== camera.cam_id || c.cam_status !== 0));
  };

  const handleCamIdChange = (isChecked, value) => {
    if (isChecked) {
      setCam_ids([...cam_ids, value]);
  
      // Call deleteCamera and filter cameras
      deleteCameraAndFilter(value);
  
      const selectedCamera = cameras.find((camera) => camera.cam_id == value);
      if (selectedCamera) {
        setCamPriceSelected(selectedCamera.cam_price);
        setRnt_total((prevTotal) => {
          const total = parseFloat(prevTotal) + parseFloat(selectedCamera.cam_price) * parseFloat(rnt_time);
          return total.toString();
        });
      }
    } else {
      setCam_ids(cam_ids.filter((id) => id !== value));
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
    let total = 0;
    cameras.forEach((camera) => {
      if (cam_ids.includes(camera.cam_id)) {
        total += parseFloat(camera.cam_price) * parseFloat(rnt_time);
      }
    });
    setRnt_total(total.toString());
  };

  const saveRent = async (e) => {
    e.preventDefault();

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
        const rentId = response.data.data.rnt_id; // assume the API returns the created rent ID

        const rentDetails = cam_ids.map((cam_id) => ({
          drnSubtotal: cameras.find((camera) => camera.cam_id === cam_id).cam_price * parseFloat(rnt_time),
          rntId: rentId,
          camId: cam_id,
        }));

        Promise.all(rentDetails.map((rentDetail) => addRentDetail(rentDetail)))
          .then((responses) => {

            const deletePromises = cam_ids.map((cam_id) => {
              const cameraToRent = { cam_id: cam_id };
              return deleteCamera(cameraToRent);
            });

            Promise.all(deletePromises)
            .then(() => {
              Swal({
                title: "Success",
                text: "Rent and rent detail have been added successfully!",
                icon: "success",
                button: "OK",
              }).then(() => {
                navigate('/listrental');
              });
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
    return nameValid && rentDateValid && returnDateValid && cam_ids.length > 0;
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
                  {cameras.map((camera) => (
                    <div key={camera.cam_id} className="form-check">
                     <input
                      className="form-check-input"
                      type="checkbox"
                      value={camera.cam_id}
                      id={`camera-${camera.cam_id}`}
                      checked={cam_ids.includes(camera.cam_id)}
                      onChange={(e) => handleCamIdChange(e.target.checked, camera.cam_id)}
                    />
                      <label className="form-check-label" htmlFor={`camera-${camera.cam_id}`}>
                        {camera.cam_name}
                      </label>
                    </div>
                  ))}
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
              <button type="submit" className="btn btn-rounded btn-block my-4 white-text font-weight-bold waves-effect z-depth-0" style={{ backgroundColor: '#0059AB' }} onClick={saveRent} disabled={!isFormValid()}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRent;
