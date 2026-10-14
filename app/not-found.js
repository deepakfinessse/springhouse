import Link from "next/link";
import Header from "@/app/components/home/Header";
import Footer from "@/app/components/home/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="error-page-wrapper ptb100" style={{ 
        minHeight: "70vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center"
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="error-content">
                <h1 className="font100 mb-3" style={{ 
                  fontSize: "120px", 
                  fontWeight: "900", 
                  color: "#0e0f11",
                  lineHeight: "1"
                }}>404</h1>
                <h2 className="font46 mb-4" style={{ textTransform: "uppercase" }}>
                  <span>Opps!</span> Page Not Found
                </h2>
                <p className="mb-5 text-muted" style={{ fontSize: "18px", maxWidth: "600px", margin: "0 auto 40px" }}>
                  The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link href="/" className="themebtn themebtn2">
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style dangerouslySetInnerHTML={{ __html: `
        .font100 {
          font-family: 'gobold', sans-serif;
        }
        .ptb100 {
          padding-top: 100px;
          padding-bottom: 100px;
        }
      `}} />
    </>
  );
}
