import React from 'react';
import { Link } from 'react-router-dom';

const Kamera = () => {
  return (
    <div className="container-fluid">
      {/* Page Heading */}
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Kamera</h1>
        <Link to="/add-camera" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          <i className="fas fa-plus fa-sm text-white-50"></i> Add Camera
        </Link>
      </div>
      {/* DataTales Example */}
      <div className="card shadow mb-4">
        <div className="card-header py-3 bg-primary">
          <h6 className="m-0 font-weight-bold text-white">Kamera Data</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing={0}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </tfoot>
              <tbody>
                <tr>
                  <td>Tiger Nixon</td>
                  <td>Nikon</td>
                  <td>12800</td>
                  <td>1</td>
                  <td class="action-buttons">
                    <a href="#" className="btn btn-primary btn-circle">
                      <i className="fas fa-edit" />
                    </a>
                    <a href="#" className="btn btn-danger btn-circle">
                      <i className="fas fa-trash" />
                    </a>
                </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kamera;
