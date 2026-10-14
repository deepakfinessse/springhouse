"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeroBanner({ dropdownOptions = {}, data = {} }) {
  const router = useRouter();
  
  // We can use the passed-in dropdownOptions as initial, but since we need properties for filtering,
  // we'll fetch exactly as the reference file did to ensure the exact same behavior if properties isn't passed down.
  const [cities, setCities] = useState(dropdownOptions.cities || []);
  const [properties, setProperties] = useState([]);
  const [allSolutions, setAllSolutions] = useState(dropdownOptions.solutions || []);
  const [filteredSolutions, setFilteredSolutions] = useState([]);
  
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSolution, setSelectedSolution] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        setLoading(true);
        // Fetch properties data
        const propertiesRes = await fetch("/api/properties");
        const propertiesResponse = await propertiesRes.json();
        if (propertiesResponse.success && propertiesResponse.data) {
          setProperties(propertiesResponse.data);
        }

        // Fetch cities if not provided
        if (!dropdownOptions.cities || dropdownOptions.cities.length === 0) {
          const citiesRes = await fetch("/api/cities");
          const citiesResponse = await citiesRes.json();
          if (citiesResponse.success && citiesResponse.data) {
            setCities(citiesResponse.data);
          }
        }

        // Fetch solutions if not provided
        if (!dropdownOptions.solutions || dropdownOptions.solutions.length === 0) {
          const solutionsRes = await fetch("/api/solutions");
          const solutionsResponse = await solutionsRes.json();
          if (solutionsResponse.success && solutionsResponse.data) {
            setAllSolutions(solutionsResponse.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data for filters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectData();
  }, [dropdownOptions.cities, dropdownOptions.solutions]);

  // Handle city selection and filter solutions
  const handleCityChange = (e) => {
    const citySlug = e.target.value; // wait, the reference was matching ID initially but value in old component was slug.
    // The reference file uses ID for the value. Let's stick to the slug in the value to match the redirect logic easily, 
    // or ID if we want to filter properties strictly. Let's look at the reference again.
    // Reference used _id for value and filtered by property.city._id
    
    // In original component, <option value={city.slug}>.
    // Let's use value for ID mapping for filtering, and we can find the slug later, similar to the reference.
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedSolution(""); // Reset solution when city changes

    if (!cityId || properties.length === 0 || allSolutions.length === 0) {
      setFilteredSolutions([]);
      return;
    }

    // Get all properties for this city
    const cityProperties = properties.filter(
      (property) => property.city && String(property.city._id) === String(cityId)
    );

    if (cityProperties.length === 0) {
      setFilteredSolutions([]);
      return;
    }

    // Extract solution IDs from these properties
    const solutionIdsSet = new Set();
    cityProperties.forEach((property) => {
      if (property.activeSolutions && Array.isArray(property.activeSolutions)) {
        property.activeSolutions.forEach((solution) => {
          if (solution && solution._id) {
            solutionIdsSet.add(String(solution._id));
          }
        });
      }
    });

    // Filter allSolutions based on the IDs found
    const filtered = allSolutions.filter((solution) => {
      return solution && solution._id && solutionIdsSet.has(String(solution._id));
    });

    setFilteredSolutions(filtered);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCity) {
      alert("Please select a city");
      return;
    }

    setSubmitting(true);

    // Get the city slug from selected city ID
    const selectedCityObj = cities.find((city) => String(city._id) === String(selectedCity));

    if (!selectedCityObj) {
      alert("City not found");
      setSubmitting(false);
      return;
    }

    // If solution is selected, find its slug
    let solutionSlug = "";
    if (selectedSolution) {
      const selectedSolutionObj = allSolutions.find(sol => String(sol._id) === String(selectedSolution));
      if (selectedSolutionObj) {
        // We use the ID as query parameter exactly like the reference file wanted
        solutionSlug = selectedSolutionObj.slug || String(selectedSolutionObj._id);
      }
    }

    let redirectUrl = `/coworking-space/${selectedCityObj.slug}`;
    
    if (solutionSlug) {
      redirectUrl += `?solution=${solutionSlug}`;
    }

    // Redirect to city page
    router.push(redirectUrl);
  };

  const videoRef = React.useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Force loading if source changes
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play was prevented (e.g., browser policy)
          console.log("Autoplay prevented:", error);
        });
      }
    }
  }, [data.heroVideo]);

  return (
    <div className="spring-housebaner relative">
      <div className="container-fluid p-lg-0 p-md-0 p-3 relative">
        <div className="springhouse-image ">
          
          {/* Main Visual: Video taking highest priority, fallback to Image */}
          {data.heroVideo ? (
            <video
              ref={videoRef}
              key={data.heroVideo}
              className="w-100 banner-video object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={data.mainBanner || ""}
              preload="auto"
            >
              <source src={data.heroVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : data.mainBanner ? (
            <img
              src={data.mainBanner}
              className="w-100 banner-video object-cover"
              alt="SpringHouse Hero Banner"
            />
          ) : (
            <img
              src="/assets/bannerimage/1747035219_home-banner.jpg"
              className="w-100 banner-video object-cover"
              alt="SpringHouse Hero Banner Fallback"
            />
          )}

          <div className="shape-bottom">
            <div className="shape-left-top">
              <svg
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-11 h-11"
                style={{ width: "2.0rem", height: "2.0rem", stroke: "#ffffff" }}
              >
                <path
                  d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                  fill="#fff"
                ></path>
              </svg>
            </div>
            <div className="shape-right-bottom-home">
              <svg
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-11 h-11"
                style={{ width: "2.0rem", height: "2.0rem", stroke: "#ffffff" }}
              >
                <path
                  d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                  fill="#0e0f11"
                  style={{ fill: "#ffffff" }}
                ></path>
              </svg>
            </div>
          </div>
          <div className="spring-content" data-aos="fade-up">
            {data.subHeading && (
              <span 
                className="section-span"
                style={{
                  fontSize: 15,
                  fontWeight: "400",
                  fontFamily: "montserrat",
                  letterSpacing: "30%",
                }}
              >
                {data.subHeading}
              </span>
            )}
            {data.heading && (
              <h2 className="section-title mt-2">
                <p
                  style={{
                    fontSize: "clamp(28px, 5vw, 46px)",
                    fontWeight: "400",
                    fontFamily: "Gobold",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: data.heading.replace(/\n/g, "<br />"),
                  }}
                />
              </h2>
            )}
          </div>
        </div>

        <div className="row1 b-lg-0 " data-aos="fade-up">
          <div className="col-md-7 offset-lg-5 offset-md-5 pe-lg-2 pe-0">
            <form id="filterForm" className="form-p" onSubmit={handleSubmit} style={{ display: "block" }}>
              <div className="row" style={{ justifyContent: "center" }}>
                
                {/* Cities Dropdown */}
                <div className="col-md-4">
                  <select
                    className="form-select js-states"
                    id="single"
                    name="location_id"
                    disabled={loading || submitting}
                    value={selectedCity}
                    onChange={handleCityChange}
                  >
                    <option value="">Select A City</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Solutions Dropdown */}
                <div className="col-md-4">
                  <select
                    className="form-select"
                    name="solution_id"
                    value={selectedSolution}
                    onChange={(e) => setSelectedSolution(e.target.value)}
                    disabled={
                      !selectedCity ||
                      loading ||
                      submitting ||
                      filteredSolutions.length === 0
                    }
                  >
                    <option value="">
                      {!selectedCity
                        ? "Select a City First"
                        : "Select a Solution"}
                    </option>
                    {filteredSolutions.map((solution) => (
                      <option key={solution._id} value={solution._id}>
                        {solution.name
                          ? solution.name.toLowerCase().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                          : solution.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Submit Button */}
                <div className="col-md-3">
                  <button
                    type="submit"
                    name="submit-btn"
                    className="themebtn explore themebtn2 d-block"
                    disabled={loading || submitting || !selectedCity}
                  >
                    {submitting ? "Loading..." : "Explore"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
