import React, { useEffect, useState } from 'react';
import { listRent } from '../../service/RentService';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import Revenue from './Revenue';

function Home() {
  const [totalDipinjam, setTotalDipinjam] = useState(0);
  const [totalDikembalikan, setTotalDikembalikan] = useState(0);

  useEffect(() => {
    listRent()
      .then(response => {
        const transaksiData = response.data.data; // Mengambil data dari response

        // Menghitung jumlah transaksi yang sedang dipinjam dan sudah dikembalikan
        const jumlahDipinjam = transaksiData.filter(transaksi => transaksi.status = 2).length;
        const jumlahDikembalikan = transaksiData.filter(transaksi => transaksi.status = 1).length;
        
        setTotalDipinjam(jumlahDipinjam);
        setTotalDikembalikan(jumlahDikembalikan);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const data = [
    { name: 'Sedang Dirental', value: totalDipinjam },
    { name: 'Sudah Dikembalikan', value: totalDikembalikan },
  ];

  return (
    <section className="section dashboard">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Statistika Rental</h5>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <div className="alert alert-primary" role="alert">
                      Sedang Dirental: {totalDipinjam}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="alert alert-success" role="alert">
                      Sudah Dikembalikan: {totalDikembalikan}
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="90%" height={350}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={160}
                      fill="#8884d8"
                      label
                    />
                    <Pie
                      dataKey="value"
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={160}
                      fill="#82ca9d"
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Render MostBorrowedBooks component here */}
          <div className="col-lg-6">
            <Revenue/>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;