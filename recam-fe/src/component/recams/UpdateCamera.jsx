import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCameraById, updateCamera } from '../../service/KameraService'; 
import swal from 'sweetalert';

const UpdateCamera = () => {
    const { id } = useParams();
    const [camera, setCamera] = useState({
        cam_name: '',
        cam_type: '',
        cam_price: '',
        cam_status: 1
    });
    const [nameValid, setNameValid] = useState(true);
    const [typeValid, setTypeValid] = useState(true);
    const [priceValid, setPriceValid] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getCameraById(id)
            .then((response) => {
                console.log("Fetched camera data:", response.data);
                setCamera(response.data.data);
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                console.error("Error fetching camera data:", error);
                setLoading(false); // Set loading to false in case of error
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCamera(prevCamera => ({
            ...prevCamera,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        updateCamera(camera, id)
            .then((response) => {
                console.log("Camera updated successfully:", response);
                swal("Success", "Camera updated successfully", "success"); // Display SweetAlert on success
                navigate('/list');
            })
            .catch((error) => {
                console.error("Error updating camera:", error);
                swal("Error", "Failed to update camera", "error"); // Display SweetAlert on error
            });
    };

    function isFormValid() {
        if (camera.cam_name === '') {
            setNameValid(false);
            return false;
        } else {
            setNameValid(true);
        }

        if (camera.cam_type === '') {
            setTypeValid(false);
            return false;
        } else {
            setTypeValid(true);
        }

        if (camera.cam_price === '' || isNaN(camera.cam_price)) {
            setPriceValid(false);
            return false;
        } else {
            setPriceValid(true);
        }

        return true;
    }

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="container-fluid">
            <br />
            <div className="row justify-content-center mb-8">
                <h5 className="text-center white-text py-4 mb-4">
                    <strong>UPDATE CAMERA</strong>
                </h5>
                <div className="card shadow mb-4">
                    <div className='card-body'>
                        <div>
                            <br />
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <label className="form-label">Name</label>
                                    <input type="text" className={`form-control ${nameValid ? '' : 'is-invalid'}`} placeholder="Enter name" aria-label="Enter name"
                                        name="cam_name" value={camera.cam_name} onChange={handleInputChange} />
                                    {!nameValid && <div className="invalid-feedback">Name is required</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Type</label>
                                    <input type="text" className={`form-control ${typeValid ? '' : 'is-invalid'}`} placeholder="Enter type" aria-label="Last name"
                                        name="cam_type" value={camera.cam_type} onChange={handleInputChange} />
                                    {!typeValid && <div className="invalid-feedback">Type is required</div>}
                                </div>
                            </div>
                            <div className="row g-3 mb-3">
                                <div className="col">
                                    <label className="form-label">Price</label>
                                    <div className="input-group">
                                        <span className="input-group-text">Rp</span>
                                        <input type="text" className={`form-control ${priceValid ? '' : 'is-invalid'}`} placeholder="Enter price" aria-label="First name"
                                            name="cam_price" value={camera.cam_price} onChange={handleInputChange} />
                                        {!priceValid && <div className="invalid-feedback">Price must be a valid number</div>}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-rounded btn-block my-4 white-text font-weight-bold waves-effect z-depth-0" style={{ backgroundColor: '#0059AB' }}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateCamera;
