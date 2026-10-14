"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { isValidEmail, isValidPhone } from "@/utils/validation";

export default function ContactForm({ phone, dropdownOptions, contactFormImage }) {
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

  const handleIncrement = () =>
    setDeskCount((prev) => (prev === "" ? 1 : prev + 1));
  const handleDecrement = () =>
    setDeskCount((prev) => (prev > 1 ? prev - 1 : ""));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "location") {
        newData.property = "";
        newData.solution = "";
      }
      if (name === "property") {
        newData.solution = "";
      }
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

  const filteredSolutions = formData.property
    ? properties.find((p) => p.slug === formData.property)?.activeSolutions || []
    : solutions;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (
      !formData.full_name ||
      !formData.company_name ||
      !formData.work_email ||
      !formData.contact_number ||
      !formData.location ||
      !formData.solution
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (errors.work_email || errors.contact_number) {
      Swal.fire({
        title: "Error!",
        text: "Please fix the validation errors before submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, desk_required: deskCount || 1 }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      Swal.fire({
        title: "Success!",
        text: "Your request has been submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Reset form
      setFormData({
        full_name: "",
        company_name: "",
        work_email: "",
        contact_number: "",
        location: "",
        property: "",
        solution: "",
      });
      setErrors({
        work_email: "",
        contact_number: "",
      });
      setDeskCount("");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="get-touch ptb60">
      <div className="container">
        <div className="row">
          <div className="col-sm-11 mx-auto">
            <div className="row d-flex align-items-center justify-content-center">
              <div className="col-lg-5">
                <div className="get-left-touch relative">
                  <div className="get-call">
                    <div className="get-call-icon relative">
                      <div className="icon-shape-circle"></div>
                      <div className="call-icon">
                        <img src="/frontend_assets/img/call.png" alt="" />
                      </div>
                    </div>
                    <div className="get-call-no">
                      <a href={`tel:${phone || "+919899936669"}`}>
                        {phone || "+91 9899936669"}
                      </a>
                    </div>
                  </div>
                  <div className="get-image-bottom mt20 relative">
                    <div className="get-image">
                      <img src={contactFormImage || "/frontend_assets/img/get-touch.png"} alt="" />
                    </div>
                    <div className="circle-arrow">
                      <div className="arrow">
                        <img
                          src="/frontend_assets/img/arrow-left.png"
                          alt="coworking spaces – SpringHouse coworking office view"
                        />
                      </div>
                    </div>
                    <div className="shape-bottom-right">
                      <div className="shape-right-top">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                          style={{
                            width: "1.0rem",
                            height: "1.0rem",
                            stroke: "#ffffff",
                          }}
                        >
                          <path
                            d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                            fill="#fff"
                          ></path>
                        </svg>
                      </div>
                      <div className="shape-left-bottom">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                          style={{
                            width: "1.0rem",
                            height: "1.0rem",
                            stroke: "#ffffff",
                          }}
                        >
                          <path
                            d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                            fill="#0e0f11"
                            style={{ fill: "#ffffff" }}
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="get-right-touch">
                  <div className="get-right-head">
                    <h2 className="font46 textcenter">
                      get in touch <span>with us</span>
                    </h2>
                  </div>
                  <div className="get-right-form-design mt20">
                    <form id="form_submit" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="full_name"
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
                              id="company_name"
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
                              id="work_email"
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
                              type="tel"
                              className="form-control"
                              id="contact_number"
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
                              id="location"
                              value={formData.location}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select Location</option>
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
                              id="property"
                              value={formData.property}
                              onChange={handleChange}
                              required
                              disabled={!formData.location}
                            >
                              <option value="">Select Property</option>
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
                              id="solution"
                              value={formData.solution}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select Solution</option>
                              {filteredSolutions.map((sol) => (
                                <option key={sol._id} value={sol.slug}>
                                  {sol.name ? sol.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : sol.name}
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
                              id="desk_required"
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
                        name="submit-btn"
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
