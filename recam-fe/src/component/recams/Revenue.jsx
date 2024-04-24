import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { listRent } from '../../service/RentService';

function Revenue() {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    fetchMonthlyRevenue();
  }, []);

  const fetchMonthlyRevenue = () => {
    listRent()
      .then(response => {
        const rentalData = response.data.data;
        const monthlyRevenueData = calculateMonthlyRevenue(rentalData);
        setMonthlyRevenue(monthlyRevenueData);
      })
      .catch(error => {
        console.error('Error fetching rental data:', error);
      });
  };

  const calculateMonthlyRevenue = rentalData => {
    const monthlyRevenueData = Array.from({ length: 12 }, () => ({ month: '', amount: 0 }));

    rentalData.forEach(rental => {
      const date = new Date(rental.rentDate);
      const monthIndex = date.getMonth();
      monthlyRevenueData[monthIndex].month = date.toLocaleString('default', { month: 'long' });
      monthlyRevenueData[monthIndex].amount += rental.total;
    });

    return monthlyRevenueData;
  };

  return (
    <div className="card">
    <div className="card-body">
      <h5 className="card-title">Statistika Pendapatan</h5>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={monthlyRevenue}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
    </div>
    </div>
  );
}

export default Revenue;