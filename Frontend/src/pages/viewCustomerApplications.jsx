import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEntries } from "../controllers/formController";
import { useOfferContext } from "../context/offerContext";

export const ViewCustomerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [openedAppIndex, setOpenedAppIndex] = useState(null);
  const [citySort, setCitySort] = useState(""); // Text input for city sort
  const [provinceSort, setProvinceSort] = useState(""); // Text input for province sort
  const navigate = useNavigate();

  const { updateOfferData } = useOfferContext();

  useEffect(() => {
    getAllEntries()
      .then((response) => {
        setApplications(response.entries || []);
      })
      .catch((error) => console.log(error));
  }, []);

  const parseValue = (val) => {
    if (!val) return "";
    if (val.S) return val.S;
    if (val.N) return val.N;
    if (val.L) return val.L.map(parseValue).join(", ");
    return "";
  };

  const filterEmptyValues = (formData) => {
    const result = {};
    for (let key in formData) {
      const value = parseValue(formData[key]);
      if (value && value !== "") {
        result[key] = value;
      }
    }
    return result;
  };

  const sortedApplications = [...applications].sort((a, b) => {
    const aFormData = a.formData || {};
    const bFormData = b.formData || {};

    const aCity = parseValue(aFormData.kaupunki) || "";
    const bCity = parseValue(bFormData.kaupunki) || "";
    const aProvince = parseValue(aFormData.maakunta) || "";
    const bProvince = parseValue(bFormData.maakunta) || "";

    // Convert both values and inputs to lowercase to make substring matching case-insensitive
    const aCityLower = aCity.toLowerCase();
    const bCityLower = bCity.toLowerCase();
    const aProvinceLower = aProvince.toLowerCase();
    const bProvinceLower = bProvince.toLowerCase();

    const citySearch = citySort.toLowerCase();
    const provinceSearch = provinceSort.toLowerCase();

    // Helper function to check if a string contains the substring (city or province)
    const matchSubstring = (value, search) => {
      return value.includes(search);
    };

    // Sorting logic for both city and province, if both are provided
    if (citySort && provinceSort) {
      const cityMatchA = matchSubstring(aCityLower, citySearch);
      const cityMatchB = matchSubstring(bCityLower, citySearch);
      if (cityMatchA !== cityMatchB) {
        return cityMatchA ? -1 : 1; // Give priority to matched city
      }

      const provinceMatchA = matchSubstring(aProvinceLower, provinceSearch);
      const provinceMatchB = matchSubstring(bProvinceLower, provinceSearch);
      return provinceMatchA === provinceMatchB ? 0 : provinceMatchA ? -1 : 1; // Then match province if city match is the same
    }

    // Sorting by city alone if province sort is not specified
    else if (citySort) {
      const cityMatchA = matchSubstring(aCityLower, citySearch);
      const cityMatchB = matchSubstring(bCityLower, citySearch);
      return cityMatchA === cityMatchB ? 0 : cityMatchA ? -1 : 1; // Give priority to matched city
    }

    // Sorting by province alone if city sort is not specified
    else if (provinceSort) {
      const provinceMatchA = matchSubstring(aProvinceLower, provinceSearch);
      const provinceMatchB = matchSubstring(bProvinceLower, provinceSearch);
      return provinceMatchA === provinceMatchB ? 0 : provinceMatchA ? -1 : 1; // Give priority to matched province
    }

    // Default: no sorting
    return 0;
  });

  const handleToggle = (index) => {
    setOpenedAppIndex(index === openedAppIndex ? null : index);
  };

  const handleOffer = (userId, entryId, formData) => {
    updateOfferData(userId, entryId, formData);
    navigate("/offer");
  };

  // Handle changes to the city sort input
  const handleCitySortChange = (e) => {
    setCitySort(e.target.value); // Update citySort based on text input
    setProvinceSort(""); // Reset province sort
  };

  // Handle changes to the province sort input
  const handleProvinceSortChange = (e) => {
    setProvinceSort(e.target.value); // Update provinceSort based on text input
    setCitySort(""); // Reset city sort
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-6">
          View Customer Applications
        </h1>

        {/* Sort controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="citySort"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort by City (Kaupunki)
            </label>
            <input
              id="citySort"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={citySort}
              onChange={handleCitySortChange} // Use the updated handler
              placeholder="Enter city"
            />
          </div>
          <div>
            <label
              htmlFor="provinceSort"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort by Province (Maakunta)
            </label>
            <input
              id="provinceSort"
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={provinceSort}
              onChange={handleProvinceSortChange} // Use the updated handler
              placeholder="Enter province"
            />
          </div>
        </div>

        {sortedApplications.length === 0 ? (
          <p className="text-gray-600">No applications to display yet.</p>
        ) : (
          <div>
            {sortedApplications.map((app, index) => {
              const formData = filterEmptyValues(app.formData);
              const city = formData.kaupunki || `Application ${index + 1}`;

              return (
                <div key={app.entryId} className="mb-4">
                  <div
                    className="cursor-pointer bg-gray-200 p-4 rounded-lg flex justify-between items-center"
                    onClick={() => handleToggle(index)}
                  >
                    <div className="text-left">
                      <h2 className="text-lg font-semibold">{city}</h2>
                      <p className="text-gray-600">Status: {app.status}</p>
                      {formData.maakunta && (
                        <p className="text-gray-600">
                          Province: {formData.maakunta}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOffer(app.userId, app.entryId, formData);
                      }}
                      className="ml-4 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Offer
                    </button>
                  </div>

                  {/* Application details */}
                  {openedAppIndex === index && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                      {/* Here you can show the application details */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
