'use client'
import React, { useState, useEffect } from 'react';
import { db } from '@/app/firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const DriversPage = () => {
  const [itinerary, setItinerary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const q = query(collection(db, 'packages'), orderBy('deliveryDate'));
        const querySnapshot = await getDocs(q);
        setItinerary(querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          deliveryDate: doc.data().deliveryDate?.toDate().toLocaleString(),
          shipDate: doc.data().shipDate?.toDate().toLocaleString(),
        })));
      } catch (err) {
        setError('Failed to fetch data');
        console.error("Error fetching data:", err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Driver's Itinerary</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itinerary.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p><strong>Customer ID:</strong> {item.customerId}</p>
              <p><strong>Delivery Date:</strong> {item.deliveryDate}</p>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Package Dimensions:</strong> {item.packageDimensions}</p>
              <p><strong>Package Weight:</strong> {item.packageWeight} lbs</p>
              <p><strong>Ship Date:</strong> {item.shipDate}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Tracking Number:</strong> {item.trackingNumber}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriversPage;
