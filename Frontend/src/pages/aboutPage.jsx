import React, { useState } from "react";

export const AboutPage = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="flex justify-center items-center flex-col">
      <h1 className="text-3xl py-2">About Page</h1>

      <p className="p-4">
        This is the About page where you can add details about your app.
      </p>
    </div>
  );
};
