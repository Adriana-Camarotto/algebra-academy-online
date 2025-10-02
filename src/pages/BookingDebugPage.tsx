import React from "react";
import { useAuthStore } from "@/lib/auth";
import { useBookingLogic } from "@/hooks/useBookingLogic";

const BookingDebugPage: React.FC = () => {
  const { user, language } = useAuthStore();
  const {
    currentStep,
    selectedService,
    selectedDate,
    selectedTime,
    termsAccepted,
    isProcessing,
    setTermsAccepted,
    handleConfirmBooking,
  } = useBookingLogic();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Booking Debug Page</h1>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>User ID:</strong> {user?.id || "No user"}
            </div>
            <div>
              <strong>Language:</strong> {language}
            </div>
            <div>
              <strong>Current Step:</strong> {currentStep}
            </div>
            <div>
              <strong>Selected Service:</strong> {selectedService || "None"}
            </div>
            <div>
              <strong>Selected Date:</strong> {selectedDate || "None"}
            </div>
            <div>
              <strong>Selected Time:</strong> {selectedTime || "None"}
            </div>
            <div>
              <strong>Terms Accepted:</strong>{" "}
              {termsAccepted ? "✅ YES" : "❌ NO"}
            </div>
            <div>
              <strong>Is Processing:</strong>{" "}
              {isProcessing ? "✅ YES" : "❌ NO"}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Button State Tests</h3>

            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span>Toggle Terms Acceptance</span>
                </label>
              </div>

              <div>
                <strong>Button Should Be:</strong>{" "}
                {!termsAccepted || isProcessing ? "DISABLED" : "ENABLED"}
              </div>

              <div>
                <strong>Disabled Reason:</strong>{" "}
                {!termsAccepted && "Terms not accepted"}
                {isProcessing && "Currently processing"}
                {termsAccepted && !isProcessing && "Should be enabled"}
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={!termsAccepted || isProcessing}
                className={`px-4 py-2 rounded font-medium min-w-[180px] ${
                  !termsAccepted || isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                }`}
              >
                {isProcessing ? "Processing..." : "Test Confirm Booking"}
              </button>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">
              Required Fields Check
            </h3>
            <div className="space-y-2">
              <div>✅ User: {user?.id ? "Present" : "❌ Missing"}</div>
              <div>
                ✅ Service: {selectedService ? "Present" : "❌ Missing"}
              </div>
              <div>✅ Date: {selectedDate ? "Present" : "❌ Missing"}</div>
              <div>✅ Time: {selectedTime ? "Present" : "❌ Missing"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDebugPage;
