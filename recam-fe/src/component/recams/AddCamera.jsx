import React from 'react';
import { Link } from 'react-router-dom';

const AddCamera  = () => {
return (
  <div className="container-fluid">
        <br />
        <div className='row'>
            <div className='card'>
                <div className='card-body'>
                    <form>
                        <div className='form-group mb-2'>
                            <label className="form-label">Name :</label>
                            <input type="text" className="form-control" />
                            <label className="form-label">Type:</label>  
                            <input type="text" className="form-control" /> 
                            <label className="form-label">Price :</label>
                            <input type="text" className="form-control" />
                            <label className="form-label">Status :</label>
                            <input type="text" className="form-control" />
                        </div>
                        <button className="btn btn-success bg-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
};
export default AddCamera