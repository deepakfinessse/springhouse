import React from "react";

export default function AboutCta() {
  return (
    <section className="call-back ptb60" id="sohna-road">
      <div className="container-fluid">
        <div className="row pe-3 ps-3">
          <div className="col-md-12 pt-3 ">
            <div className="call-tab">
              <h2 className="text-center mb-4">
                Let’s continue the conversation
              </h2>
              <a
                href="#exampleModaltwo"
                className="themebtn themebtn1 d-block m-auto"
                data-bs-toggle="modal"
                data-bs-target="#exampleModaltwo"
              >
                Request A Callback
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
