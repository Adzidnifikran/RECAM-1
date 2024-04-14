import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCamera } from '../../service/KameraService';
import Swal from 'sweetalert';


const AddCamera = () => {
    const [cam_name, setCameras_name] = useState('');
    const [cam_type, setCameras_type] = useState('');
    const [cam_price, setCameras_price] = useState('');
    const [cam_status, setCameras_status] = useState(1);
    const [cam_creaby] = useState(0);
    const [cam_creadate] = useState(new Date().toISOString());
    const [nameValid, setNameValid] = useState(false);
    const [typeValid, setTypeValid] = useState(false);
    const [priceValid, setPriceValid] = useState(false);



    const navigate = useNavigate();

    function handleNameChange(e) {
        const value = e.target.value;
        setCameras_name(value);
        setNameValid(value.trim().length > 0);
    }

    function handleTypeChange(e) {
        const value = e.target.value;
        setCameras_type(value);
        setTypeValid(value.trim().length > 0);
    }

    function handlePriceChange(e) {
        const value = e.target.value;
        setCameras_price(value);
        setPriceValid(value.trim().length > 0);
    }

    function isFormValid() {
        return nameValid && typeValid && priceValid;
    }

    function saveCamera(e) {
        e.preventDefault();
        if (!isFormValid()) {
            Swal({
                title: "Error",
                text: "Please fill in all fields",
                icon: "error",
                button: "OK",
            });
            return;
        }
        const camera = { cam_name, cam_type, cam_price, cam_status, cam_creaby, cam_creadate }
        console.log("Camera object sent", camera);

        createCamera(camera)
            .then((response) => {
                Swal({
                    title: "Success",
                    text: "Camera has been added successfully!",
                    icon: "success",
                    button: "OK",
                }).then(() => {
                    navigate('/list');
                });
            })
            .catch((error) => {
                console.error("Error adding camera:", error);
                Swal({
                    title: "Error",
                    text: "Failed to add camera. Please try again later.",
                    icon: "error",
                    button: "OK",
                });
            });
    }
    return (
        <div className="container-fluid">
            <br />
            <div className="row justify-content-center mb-8" >

                <h5 className="text-center white-text py-4 mb-4">
                    <strong>ADD CAMERA</strong>
                </h5>

                <div className="card shadow mb-4">
                    <div className='card-body'>
                        <div>
                            <br />
                        </div>
                        <form>
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">Name </label>
                                    <input type="text" className={`form-control ${nameValid ? 'is-valid' : 'is-invalid'}`} placeholder="Enter name" aria-label="Enter name"
                                        value={cam_name} onChange={handleNameChange} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Type</label>
                                    <input type="text" className={`form-control ${typeValid ? 'is-valid' : 'is-invalid'}`} placeholder="Enter type" aria-label="Last name"
                                        value={cam_type} onChange={handleTypeChange} />
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col">
                                    <label className="form-label">Price</label>
                                    <div className="input-group">
                                        <span className="input-group-text">Rp</span>
                                        <input type="text" className={`form-control ${priceValid ? 'is-valid' : 'is-invalid'}`} placeholder="Enter price" aria-label="First name"
                                            value={cam_price} onChange={handlePriceChange} />
                                    </div>
                                </div>
                                <div className="col">
                                    <label className="form-label">Status</label>
                                    <input type="text" className="form-control" placeholder="Enter status" aria-label="Last name"
                                        value={cam_status} onChange={(e) => setCameras_status(e.target.value)} readOnly />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-rounded btn-block my-4 white-text font-weight-bold waves-effect z-depth-0" style={{ backgroundColor: '#0059AB' }} onClick={saveCamera}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCamera;