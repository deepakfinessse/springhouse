"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { isValidEmail, isValidPhone } from "@/utils/validation";

export default function CareerForm({ careerFormImage }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    applyingFor: "",
    linkedinURL: "",
    whyWannaJoin: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({
    email: "",
    contactNumber: "",
    resume: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email:
          value && !isValidEmail(value)
            ? "Please enter a valid email address."
            : "",
      }));
    } else if (name === "contactNumber") {
      setErrors((prev) => ({
        ...prev,
        contactNumber:
          value && !isValidPhone(value)
            ? "Please enter a valid 10-digit phone number."
            : "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: "Resume size is limited to 5 MB maximum.",
        }));
        e.target.value = "";
        setResumeFile(null);
        return;
      }
      setErrors((prev) => ({ ...prev, resume: "" }));
      setResumeFile(file);
    } else {
      setErrors((prev) => ({ ...prev, resume: "Please upload your resume." }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comprehensive validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.applyingFor ||
      !resumeFile
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all required fields and upload your resume.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (errors.email || errors.contactNumber || errors.resume) {
      Swal.fire({
        title: "Error!",
        text: "Please fix the validation errors before submitting.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("contactNumber", formData.contactNumber);
      data.append("applyingFor", formData.applyingFor);
      data.append("linkedinURL", formData.linkedinURL);
      data.append("whyWannaJoin", formData.whyWannaJoin);

      if (resumeFile) {
        data.append("resume", resumeFile);
      }

      const response = await fetch("/api/careers", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      Swal.fire({
        title: "Application Submitted!",
        text: "Thank you for applying. We will review your application and get back to you soon.",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        contactNumber: "",
        applyingFor: "",
        linkedinURL: "",
        whyWannaJoin: "",
      });
      setErrors({
        email: "",
        contactNumber: "",
        resume: "",
      });
      setResumeFile(null);
      // Reset file input
      const fileInput = document.getElementById("resume");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setSubmitting(false);
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
                  <div className="get-image-bottom mt20 relative">
                    <div className="get-image">
                      <img
                        src={
                          careerFormImage ||
                          "/frontend_assets/img/get-touch.png"
                        }
                        alt="Join Spring House Team"
                      />
                    </div>
                    <div className="circle-arrow">
                      <div className="arrow">
                        <img
                          src="/frontend_assets/img/arrow-left.png"
                          alt="Spring House Careers"
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
                      join our <span>team</span>
                    </h2>
                  </div>
                  <div className="get-right-form-design mt20">
                    <form id="career_form" onSubmit={handleSubmit} noValidate>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          name="fullName"
                          placeholder="Full Name *"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              placeholder="Email Address *"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                            {errors.email && (
                              <div className="text-danger small mt-1">
                                {errors.email}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <input
                              type="tel"
                              className="form-control"
                              id="contactNumber"
                              name="contactNumber"
                              placeholder="Contact Number *"
                              value={formData.contactNumber}
                              onChange={handleChange}
                              required
                            />
                            {errors.contactNumber && (
                              <div className="text-danger small mt-1">
                                {errors.contactNumber}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <input
                              type="text"
                              className="form-control"
                              id="applyingFor"
                              name="applyingFor"
                              placeholder="Applying For (Position) *"
                              value={formData.applyingFor}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <input
                              type="url"
                              className="form-control"
                              id="linkedinURL"
                              name="linkedinURL"
                              placeholder="LinkedIn Profile URL"
                              value={formData.linkedinURL}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="resume"
                              className="form-label"
                              style={{ fontSize: "14px", color: "#6b7280" }}
                            >
                              Upload Resume (PDF, DOC, DOCX - Max 5 MB) *
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="resume"
                              name="resume"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              required
                            />
                            {errors.resume && (
                              <div className="text-danger small mt-1">
                                {errors.resume}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <textarea
                              className="form-control"
                              id="whyWannaJoin"
                              name="whyWannaJoin"
                              placeholder="Why do you want to join Spring House?"
                              rows="4"
                              value={formData.whyWannaJoin}
                              onChange={handleChange}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        name="submit-btn"
                        className="themebtn themebtn2 mx-auto d-block"
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
