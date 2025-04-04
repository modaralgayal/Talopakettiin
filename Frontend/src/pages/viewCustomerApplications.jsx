import React, { useEffect } from "react";
import { getAllEntries } from "../controllers/formController";

export const ViewCustomerApplications = () => {

  useEffect(() => {
    getAllEntries()
      .then((response) => {
        console.log("This is the response from the server", response);
      })
      .catch((error) => console.log(error));
  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-6">
          View Customer Applications
        </h1>
        <p className="text-gray-600">No applications to display yet.</p>
      </div>
    </div>
  );
};
