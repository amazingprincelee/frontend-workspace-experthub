
import { Spin } from 'antd';
import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, card, wallet }) => {
  if (!isOpen) return null;

  const [loader, setLoading] = useState(false)
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 !z-[999999]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
        <p className="mb-6">Choose your payment method:</p>
        {loader ? <div className='w-full text-center'>
          <Spin size="large" />
        </div> : <div className="flex flex-col gap-4">
          <button onClick={() => { setLoading(true); wallet() }} className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Pay with Wallet
          </button>
          <button onClick={() => card()} className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Pay with Card
          </button>
        </div>}
        <button
          className="mt-6 py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
