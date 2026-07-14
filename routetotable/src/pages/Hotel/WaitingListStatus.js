import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';

const WaitingListStatus = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link to="/" className="flex items-center gap-2 text-gray-500 mb-8 hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="card p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
          
          <div className="w-24 h-24 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Your Waiting Status</h2>
          <p className="text-gray-500 mb-8 italic">Highway Hills Resort</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Position</p>
              <p className="text-3xl font-black text-primary">#4</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Est. Wait</p>
              <p className="text-3xl font-black text-primary">12m</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 text-left mb-8">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              We'll notify you when your table is ready. Your pre-ordered food will start preparation as soon as you are seated.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm py-2 px-4 bg-gray-50 rounded-lg">
              <span className="text-gray-500 flex items-center gap-2"><Users className="w-4 h-4" /> Guests</span>
              <span className="font-bold">4 People</span>
            </div>
            <div className="flex justify-between items-center text-sm py-2 px-4 bg-gray-50 rounded-lg">
              <span className="text-gray-500">Scheduled Arrival</span>
              <span className="font-bold">07:30 PM</span>
            </div>
          </div>
        </div>

        <button className="w-full text-center mt-8 text-gray-400 hover:text-red-500 font-medium transition-colors">
          Cancel Booking
        </button>
      </div>
    </div>
  );
};

export default WaitingListStatus;
