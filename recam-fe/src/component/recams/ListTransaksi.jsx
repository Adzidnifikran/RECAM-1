import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listRent } from '../../service/RentService';
import { addRentDetail } from '../../service/RentDetailService';
import { updateCamera } from '../../service/KameraService';
import Swal from 'sweetalert';

const ListTransaksi = () => {
  const [trans, setTrans] = useState([]);

  useEffect(() => {
    listRent()
      .then((response) => {
        setTrans(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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
                  <th>Rent ID</th>
                  <th>Customer</th>
                  <th>Rent Date</th>
                  <th>Rent Return</th>
                  <th>Time</th>
                  <th>Total</th>
                  <th>Charge</th>
                  <th>Return</th>
                  <th>Camera Status</th>
                </tr>
              </thead>
              <tbody>
                {trans.map((transaksi) => (
                  <tr key={transaksi.rnt_id}>
                    <td>{transaksi.rnt_id}</td>
                    <td>{transaksi.customer}</td>
                    <td>{transaksi.rent_date}</td>
                    <td>{transaksi.rent_return}</td>
                    <td>{transaksi.time}</td>
                    <td>{transaksi.total}</td>
                    <td>{transaksi.charge}</td>
                    <td>
                      {transaksi.rent_details.map((rentDetail) => (
                        <div key={rentDetail.rnt_detail_id}>
                          <input
                            type="checkbox"
                            checked={rentDetail.cam_status === 1}
                            onChange={() => handleUpdateCameraStatus(transaksi.rnt_id, rentDetail.cam_id)}
                          />
                        </div>
                      ))}
                    </td>
                    <td>
                      {transaksi.rent_details.map((rentDetail) => (
                        <div key={rentDetail.rnt_detail_id}>
                          {rentDetail.cam_status === 1 ? 'Active' : 'Inactive'}
                        </div>
                      ))}
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
};

export default ListTransaksi;