import React from "react";

export const MyApplications = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-6">
          View Your Applications
        </h1>
        <p className="text-gray-600">You don't have any applications yet.</p>
      </div>
    </div>
  );
};
