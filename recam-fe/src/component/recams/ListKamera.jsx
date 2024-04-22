import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCamera, listCamera } from '../../service/KameraService';
import Swal from 'sweetalert';


function ListKamera() {
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    listCamera()
      .then(response => {
        const dataCamera = response.data.data;
        setCameras(dataCamera.filter(cmr => cmr.cam_status !== 0));
        console.log("data", response.data.data);
      })
      .catch(error => {
        console.error(error);
      })
  }, []);
  const handleDelete = (id) => {
    Swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this camera data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          const cameraToDelete = { cam_id: id };
          deleteCamera(cameraToDelete)
            .then(() => {
              setCameras(cameras.filter(camera => camera.cam_id !== id));
              Swal("Poof! Your camera data has been deleted!", {
                icon: "success",
              });
            })
            .catch(error => {
              console.error("Error deleting camera:", error);
              Swal({
                title: "Error",
                text: "Failed to delete camera. Please try again later.",
                icon: "error",
                button: "OK",
              });
            });
        } else {
          Swal("Your camera data is safe!");
        }
      });
  };

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <Link to="/add-camera" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <i className="fas fa-plus fa-sm text-white-50"></i> Add Camera
        </Link>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3 bg-primary">
          <h6 className="m-0 font-weight-bold text-white">Camera Data</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="myTable" width="100%" cellSpacing={0} >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  cameras.map(camera =>
                    <tr key={camera.cam_id}>
                      <td>{camera.cam_name}</td>
                      <td>{camera.cam_type}</td>
                      <td>{camera.cam_price}</td>
                      <td>{camera.cam_status}</td>
                      <td className="action-buttons">
                        <Link to={`/update-camera/${camera.cam_id}`} className="btn btn-primary btn-circle">
                          <i className="fas fa-edit" />
                        </Link>
                      </td>
                      <td className="action-buttons">
                        <button onClick={() => handleDelete(camera.cam_id)} className="btn btn-danger btn-circle">
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListKamera;
