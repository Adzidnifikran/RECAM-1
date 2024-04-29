import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listRent } from '../../service/RentService';
import { addRentDetail } from '../../service/RentDetailService';
import { updateCamera } from '../../service/KameraService';
import { updateRent } from '../../service/RentService';
import Swal from 'sweetalert';
import { listRentDetailByRentId } from '../../service/RentDetailService';
import { useParams, useNavigate } from 'react-router-dom';

const ListTransaksi = () => {
  const [trans, setTrans] = useState([]);
  const [rentIds, setRentIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listRent()
     .then((response) => {
        setTrans(response.data.data);
      })
     .catch((error) => {
        console.error(error);
      });
  }, []);

  function handleReturn(id) {
    Swal({
      title: "Are you sure?",
      text: "Done bang!",
      icon: "warning",
      buttons: true,
    }).then((willReturn) => {
      if (willReturn) {
        listRentDetailByRentId(id)
         .then((response) => {
            const rentDetails = response.data.data;
  
            const camerasToUpdate = rentDetails.map((detail) => ({
              cam_id: detail.camId,
              cam_status: 1,
            }));
  
            const rent = trans.find((transaction) => transaction.rntId === id);
            const returnDate = new Date(rent.rentReturn);
            const today = new Date();
            let charge = 0;
            if (returnDate < today) {
              const diffInDays = Math.ceil((today - returnDate) / (1000 * 3600 * 24));
              charge = diffInDays * 100000;
            }
  
            const rentsToUpdate = {
              rnt_id: id,
              rnt_status: 1,
              rnt_charge: charge,
            };
  
            // Array of promises for updating cameras
            const updateCameraPromises = camerasToUpdate.map((camera) =>
              updateCamera(camera).catch((error) => {
                console.error("Error updating camera status:", error);
                throw error;
              })
            );
  
            // Promise for updating rent
            const updateRentPromise = updateRent(rentsToUpdate).catch((error) => {
              console.error("Error updating rent status:", error);
              throw error;
            });
  
            // Waiting for all updates to finish
            Promise.all([...updateCameraPromises, updateRentPromise])
             .then(() => {
                // Update trans status
                const updatedTrans = trans.map((transaction) => {
                  if (transaction.rntId === id) {
                    return {...transaction, rnt_status: 1, rnt_charge: charge };
                  }
                  return transaction;
                });
                setTrans(updatedTrans);
  
                // Show success message and navigate
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
                // Handle errors
                console.error("Error updating camera and rent status:", error);
                Swal("Error", "Failed to update camera and rent status", "error");
              });
          })
         .catch((error) => {
            console.error("Error fetching rent details:", error);
            Swal("Error", "Failed to fetch rent details", "error");
          });
      } else {
        Swal("Your camera data is safe!");
      }
    });
  }



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
export default ListTransaksi