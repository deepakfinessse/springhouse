export default function PropertyLocationMap({ locationOnMap }) {
  if (!locationOnMap) return null;

  return (
    <div className="managed-office-section office-sec ptb10">
      <div className="container-fluid">
        <div className="managed-office-bg1 relative">
          <div className="row">
            <div className="mapouter" style={{ width: "100%" }}>
              <div
                className="gmap_canvas"
                style={{
                  overflow: "hidden",
                  height: "400px",
                  width: "100%",
                  borderRadius: "10px",
                }}
                dangerouslySetInnerHTML={{ __html: locationOnMap }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
