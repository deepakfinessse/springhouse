"use client";

import Script from "next/script";

export default function GlobalScripts() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://jqueryniceselect.hernansartorio.com/js/jquery.nice-select.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="/frontend_assets/js/jquery.counterup.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="/frontend_assets/js/slider.js?var=0.3"
        strategy="lazyOnload"
      />
      <Script src="/frontend_assets/js/main.js" strategy="lazyOnload" />
      <Script
        src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/sweetalert2@11"
        strategy="lazyOnload"
      />

      {/* LightGallery */}
      <Script
        src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/lightgallery.umd.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/zoom/lg-zoom.umd.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/thumbnail/lg-thumbnail.umd.min.js"
        strategy="lazyOnload"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lightgallery/2.8.3/plugins/video/lg-video.min.js"
        strategy="lazyOnload"
      />

      {/* Owl Carousel */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"
        strategy="lazyOnload"
      />

      {/* Inline Initializations via a single script tag that runs after everything loads */}
      <Script id="global-init" strategy="lazyOnload">
        {`
          // Initialize nice-select
          function initGlobalScripts() {
            if (typeof $ !== 'undefined') {
              $(document).ready(function() {
                if ($.fn.niceSelect) {
                  $('.box').niceSelect();
                }
              });
            }
            
            // Initialize Bootstrap Tooltips
            if (typeof bootstrap !== 'undefined') {
              var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
              var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
                  return new bootstrap.Tooltip(tooltipTriggerEl);
              });
            }
          }

          // Run once on load
          if (document.readyState === 'complete') {
            initGlobalScripts();
          } else {
            window.addEventListener('load', initGlobalScripts);
          }
        `}
      </Script>
    </>
  );
}
