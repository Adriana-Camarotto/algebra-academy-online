import React from "react";
import { useSearchParams } from "react-router-dom";

// Temporary version without Stripe dependencies
const CheckoutPageTemp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const clientSecret = searchParams.get("client_secret");
  const bookingIds = searchParams.get("booking_ids");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Payment Processing
        </h1>

        <div className="space-y-4">
          <p className="text-gray-600">
            Stripe integration is being configured...
          </p>

          {clientSecret && (
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <p className="text-sm text-green-800">
                ✅ Payment session created successfully
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Client Secret: {clientSecret.slice(0, 20)}...
              </p>
            </div>
          )}

          {bookingIds && (
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                📅 Booking IDs: {bookingIds}
              </p>
            </div>
          )}

          <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Installing Stripe dependencies...
            </p>
            <p className="text-xs text-gray-600 mt-1">
              The payment form will be available once the installation
              completes.
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            ← Back to Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageTemp;
