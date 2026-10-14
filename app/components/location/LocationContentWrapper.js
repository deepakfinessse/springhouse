"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AboutLocation from "./AboutLocation";
import AvailableProperties from "../solutions/AvailableProperties";

export default function LocationContentWrapper({ 
  city, 
  cityProperties, 
  activeSolutions,
  areas 
}) {
  const searchParams = useSearchParams();
  const [selectedSolution, setSelectedSolution] = useState("");
  const [selectedArea, setSelectedArea] = useState(""); // "" means 'All Areas'

  useEffect(() => {
    const sol = searchParams.get("solution");
    if (sol) {
      setSelectedSolution(sol);
    }
  }, [searchParams]);

  // Filter properties based on selected solution ONLY
  const filteredProperties = cityProperties.filter((property) => {
    // Check Solution filter
    let matchSolution = true;
    if (selectedSolution) {
      matchSolution = property.activeSolutions?.some(
        (sol) => sol.slug === selectedSolution || sol._id === selectedSolution
      );
    }
    return matchSolution;
  });

  // Calculate available areas based on filtered properties
  const availableAreas = areas?.filter((area) => {
    return filteredProperties.some((prop) => {
      const propAreaIdentity = prop.area?.slug || prop.area?._id || prop.area;
      const areaIdentity = area.slug || area._id;
      return propAreaIdentity === areaIdentity || prop.area?.name === area.name;
    });
  }) || [];

  return (
    <>
      <AboutLocation
        city={city}
        activeSolutions={activeSolutions}
        selectedSolution={selectedSolution}
        onSolutionChange={setSelectedSolution}
        areas={availableAreas}
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
      />
      <AvailableProperties properties={filteredProperties} />
    </>
  );
}
