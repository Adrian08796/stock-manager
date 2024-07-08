import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddStockForm from './AddStockForm';

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [stockToEdit, setStockToEdit] = useState(null);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:4800/api/stocks');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks', error);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4800/api/stocks/${id}`);
      setStocks(stocks.filter(stock => stock._id !== id));
    } catch (error) {
      console.error('Error deleting stock', error);
    }
  };

  const handleEdit = (stock) => {
    setStockToEdit(stock);
  };

  return (
    <div>
      <AddStockForm stockToEdit={stockToEdit} setStockToEdit={setStockToEdit} fetchStocks={fetchStocks} />
      <div className="stock-list">
        <h2>Stock List</h2>
        {stocks.map(stock => (
          <div key={stock._id} className="stock-card">
            <p>Product Name: {stock.productName}</p>
            <p>Organic: {stock.isOrganic}</p>
            <p>Quantity: {stock.quantity}</p>
            <p>Measure Unit: {stock.measureUnit}</p>
            <p>Price per Unit: {parseFloat(stock.pricePerUnit).toFixed(2)} $</p>
            <p className='date-created'>Created At: {new Date(stock.createdAt).toLocaleString()}</p>
            {stock.modifiedAt && <p className='date-edited'>Modified At: {new Date(stock.modifiedAt).toLocaleString()}</p>}
            <button onClick={() => handleEdit(stock)}>Edit</button>
            <button onClick={() => handleDelete(stock._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;
