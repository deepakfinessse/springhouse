"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { isValidEmail, isValidPhone } from "@/utils/validation";

export default function PropertyDescription({
  property,
  phone,
  dropdownOptions,
}) {
  const {
    cities = [],
    properties = [],
    solutions = [],
  } = dropdownOptions || {};
  const [deskCount, setDeskCount] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    work_email: "",
    contact_number: "",
    location: "",
    property: "",
    solution: "",
  });
  const [errors, setErrors] = useState({
    work_email: "",
    contact_number: "",
  });

  // Pre-fill location and property on initial load
  React.useEffect(() => {
    if (property) {
      setFormData((prev) => ({
        ...prev,
        location: property.city?.slug || "",
        property: property.slug || "",
      }));
    }
  }, [property]);

  if (!property) return null;

  const handleIncrement = () =>
    setDeskCount((prev) => (prev === "" ? 1 : prev + 1));
  const handleDecrement = () =>
    setDeskCount((prev) => (prev > 1 ? prev - 1 : ""));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "location") newData.property = "";
      return newData;
    });

    // Real-time validation
    if (name === "work_email") {
      setErrors((prev) => ({
        ...prev,
        work_email: value && !isValidEmail(value) ? "Please enter a valid email address." : "",
      }));
    } else if (name === "contact_number") {
      setErrors((prev) => ({
        ...prev,
        contact_number: value && !isValidPhone(value) ? "Please enter a valid 10-digit phone number." : "",
      }));
    }
  };

  const filteredProperties = formData.location
    ? properties.filter((p) => p.city?.slug === formData.location)
    : properties;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.full_name ||
      !formData.work_email ||
      !formData.contact_number
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields.",
        icon: "error",
      });
      return;
    }

    if (errors.work_email || errors.contact_number) {
      Swal.fire({
        title: "Error!",
        text: "Please fix the validation errors before submitting.",
        icon: "error",
      });
      return;
    }

    // Clean phone number: remove spaces/dashes but keep leading +
    const cleanedContact = formData.contact_number.replace(/[^\d+]/g, '');

    try {
      fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          contact_number: cleanedContact,
          desk_required: deskCount || 1 
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              title: "Success!",
              text: "Your request has been submitted successfully.",
              icon: "success",
            });
            setFormData({
              full_name: "",
              company_name: "",
              work_email: "",
              contact_number: "",
              location: property.city?.slug || "",
              property: property.slug || "",
              solution: "",
            });
            setErrors({
              work_email: "",
              contact_number: "",
            });
            setDeskCount("");
          } else {
            Swal.fire({
              title: "Error!",
              text: "Something went wrong. Please try again later.",
              icon: "error",
            });
          }
        });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <div className="get-touch pb-4" id="enquiry-form">
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-lg-5">
            <div className="get-left-touch relative pe-md-5">
              <h1>
                <span style={{ fontSize: 18 }}>
                  {property.name} ({property.propertyCode})
                </span>
              </h1>
              <div className="mt-3" style={{ whiteSpace: "pre-line" }}>
                {property.description}
              </div>
              <p className="mt-4">
                <b>Total Sqft Area:</b> {property.size?.toLocaleString()}
              </p>
              <p>
                <b>Address:</b> {property.fullAddress}
              </p>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="get-right-touch pe-md-5">
              <div className="get-right-head">
                <h2 className="font46 textcenter">
                  get in touch <span>with us</span>
                </h2>
              </div>
              <div className="get-call mt-4">
                <div className="get-call-icon relative">
                  <div className="icon-shape-circle" />
                  <div className="call-icon">
                    <img
                      src="https://springhouse.in/frontend_assets/img/call.png"
                      alt="coworking spaces"
                    />
                  </div>
                </div>
                <div className="get-call-no">
                  <a href={`tel:${phone || "+919899936669"}`}>
                    {phone || "+91 9899936669"}
                  </a>
                </div>
              </div>
              <div className="get-right-form-design mt20">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        name="full_name"
                        placeholder="Full Name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                      />
                  </div>
                  <div className="row">
                    <div className="col-lg-5">
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          name="company_name"
                          placeholder="Company Name"
                          value={formData.company_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-7">
                      <div className="mb-3">
                            <input
                              type="email"
                              className="form-control"
                              name="work_email"
                              placeholder="Work Email Address"
                              value={formData.work_email}
                              onChange={handleChange}
                              required
                            />
                            {errors.work_email && (
                              <div className="text-danger small mt-1">{errors.work_email}</div>
                            )}
                          </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="mb-3">
                            <input
                              type="text"
                              className="form-control"
                              name="contact_number"
                              placeholder="Contact Number"
                              value={formData.contact_number}
                              onChange={handleChange}
                              required
                            />
                            {errors.contact_number && (
                              <div className="text-danger small mt-1">{errors.contact_number}</div>
                            )}
                          </div>
                    </div>
                    <div className="col-lg-7">
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Location</option>
                          {cities.map((city) => (
                            <option key={city._id} value={city.slug}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="property"
                          value={formData.property}
                          onChange={handleChange}
                          required
                          disabled={!formData.location}
                        >
                          <option value="">Property</option>
                          {filteredProperties.map((prop) => (
                            <option key={prop._id} value={prop.slug}>
                              {prop.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-7">
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="solution"
                          value={formData.solution}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Solution</option>
                          {solutions.map((sol) => (
                            <option key={sol._id} value={sol.slug}>
                              {sol.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3 input-box relative">
                        <input
                          type="number"
                          className="form-control"
                          name="desk_required"
                          placeholder="Desk Required"
                          min="1"
                          value={deskCount}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              setDeskCount("");
                            } else {
                              setDeskCount(Math.max(1, parseInt(val) || 1));
                            }
                          }}
                          required
                        />
                        <div className="desk-additionbox">
                          <span
                            className="incre"
                            style={{ cursor: "pointer" }}
                            onClick={handleIncrement}
                          >
                            +
                          </span>
                          <span
                            className="decre"
                            style={{ cursor: "pointer" }}
                            onClick={handleDecrement}
                          >
                            -
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="themebtn themebtn2 mx-auto d-block"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .get-call-icon .call-icon img {
            max-width: 40px;
            transition: 0.5s;
        }
      `,
        }}
      />
    </div>
  );
}
