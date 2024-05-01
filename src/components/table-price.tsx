"use client";

import React, { useEffect } from "react";

export const StripePricingTable = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "http://js.stripe.com/v3/pricing-table.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return React.createElement("stripe-pricing-table", {
    "pricing-table-id": process.env.PRICING_TABLE_ID,
    "publishable-key": process.env.PUBLISHABLE_KEY,
  });
};
