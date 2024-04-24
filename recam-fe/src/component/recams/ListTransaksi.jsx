import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listRent } from '../../service/RentService';
import { addRentDetail } from '../../service/RentDetailService';
import { updateCamera } from '../../service/KameraService';
import { updateRent } from '../../service/RentService';
import Swal from 'sweetalert';
import { listRentDetailByRentId } from '../../service/RentDetailService';

const ListTransaksi = () => {
  const [trans, setTrans] = useState([]);
  const [rentIds, setRentIds] = useState([]);

  useEffect(() => {
    listRent()
      .then((response) => {
        setTrans(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleReturn = (id) => {
    Swal({
      title: "Are you sure?",
      text: "Done bang!",
      icon: "warning",
      buttons: true,
    })
      .then((willReturn) => {
        if (willReturn) {
          listRentDetailByRentId(id)
        .then((response) => {
          const rentDetails = response.data.data;
          console.log(rentDetails)
          // Collecting all camera IDs to update their status
          const camerasToUpdate = rentDetails.map((detail) => ({
            cam_id: detail.camId,
            cam_status: 1,
          }));
          const rentsToUpdate = rentDetails.map((detail) => ({
            rnt_id: detail.rntId,
            rnt_status: 1,
          }));


          // Creating an array of promises to update each camera
          const updatePromises = camerasToUpdate.map((camera) => {
            return updateCamera(camera)
              .catch((error) => {
                // Handle errors if any update fails
                console.error("Error updating camera status:", error);
                throw error; // Propagate the error to the Promise.all catch block
              });
          });

                    // Creating an array of promises to update each camera
                    const updateRentStatus = rentsToUpdate.map((rent) => {
                      return updateRent(rent)
                        .catch((error) => {
                          // Handle errors if any update fails
                          console.error("Error updating camera status:", error);
                          throw error; // Propagate the error to the Promise.all catch block
                        });
                    });


          // Executing all update promises in parallel
          Promise.all(updatePromises, updateRentStatus)
            .then(() => {
              // After updating camera statuses, you can proceed with other actions
              // For example, you can show a success message and navigate to another page
              Swal({
                title: "Success",
                text: "Rent and rent detail have been added successfully!",
                icon: "success",
                button: "OK",
              }).then(() => {
                // Navigate to another page after successful completion
                // Make sure you have imported `navigate` from `react-router-dom`
                // You might also want to add a redirect URL or link here
                // navigate('/listrental');
              });
            })
            .catch((error) => {
              // Handle errors if any of the update promises fail
              console.error("Error updating camera status:", error);
              Swal("Error", "Failed to update camera status", "error");
            });
        })
        .catch((error) => {
          // Handle errors if the listRentDetailByRentId function fails
          console.error("Error fetching rent details:", error);
          Swal("Error", "Failed to fetch rent details", "error");
        });
          // const rentToReturn = { rnt_id: id };
          // useEffect(() => {
          //   listRentDetailByRentId(id)
          //     .then((response) => {
          //       setRentIds(response.data.data);
          //     })
          //     .catch((error) => {
          //       console.error(error);
          //     });
          // }, []);

          // rentIds.map((cam_id) => {
          //   const cameraToUpdate = { cam_id: cam_id, cam_status:1 };
          //   updateCamera(cameraToUpdate);
          // });

          //   Swal({
          //     title: "Success",
          //     text: "Rent and rent detail have been added successfully!",
          //     icon: "success",
          //     button: "OK",
          //   }).then(() => {
          //     navigate('/listrental');
          //   });
            
        } else {
          Swal("Your camera data is safe!");
        }
      });
  };



  const handleUpdateCameraStatus = (rnt_id, cam_id) => {
    const newCameraStatus = { cam_status: 1 };
    updateCamera(cam_id, newCameraStatus)
      .then((response) => {
        Swal.fire('Success', 'Camera status updated successfully', 'success');
      })
      .catch((error) => {
        Swal.fire('Error', 'Error updating camera status', 'error');
      });
  };



  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <Link to="/add-rent" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <i className="fas fa-plus fa-sm text-white-50"></i> Add Rent
        </Link>
      </div>
      <div className="card shadow mb-4">
        <div className="card-header py-3 bg-primary">
          <h6 className="m-0 font-weight-bold text-white">Rent Data</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="myTable" width="100%" cellSpacing={0} >
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Rent Date</th>
                  <th>Rent Return</th>
                  <th>Time</th>
                  <th>Total</th>
                  <th>Charge</th>
                  <th>Return</th>
                </tr>
              </thead>
              <tbody>
                {trans.map((transaksi) => (
                  <tr key={transaksi.rntId}>
                    <td>{transaksi.customer}</td>
                    <td>{transaksi.rentDate}</td>
                    <td>{transaksi.rentReturn}</td>
                    <td>{transaksi.time}</td>
                    <td>{transaksi.total}</td>
                    <td>{transaksi.charge}</td>
<td className="action-buttons">
{transaksi.rnt_status === 0 && (
    <button onClick={() => handleReturn(transaksi.rntId)} className="btn btn-danger">
      Done
    </button>
  )}
  {transaksi.rnt_status === 1 && (
    <button onClick={() => handleReturn(transaksi.rntId)} className="btn btn-secondary">
      Finished
    </button>
  )}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListTransaksi;
