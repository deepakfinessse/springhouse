export default function OurCommunity({ data = [] }) {
  const defaultLogos = [
    "/assets/homepage/community/1772913856887_91_Mobiles.webp",
    "/assets/homepage/community/1772913856888_Make_My_Trip.webp",
    "/assets/homepage/community/1772913856897_Mini_50.webp",
    "/assets/homepage/community/1772913856890_Axis_Max_Life_Insurance.webp",
    "/assets/homepage/community/1772913856897_Lenskart.webp",
    "/assets/homepage/community/1774327796375_Jimmys_Cocktails.png",
    "/assets/homepage/community/1772913856896_Hero.webp",
    "/assets/homepage/community/1772913856892_Godrej.webp",
    "/assets/homepage/community/1772913856891_Darwinbox.webp",
    "/assets/homepage/community/1772913856889_Adyogi.webp",
    "/assets/homepage/community/1772913856891_Cars_24.webp",
    "/assets/homepage/community/1772913856898_Yourstory.webp",
  ];

  const displayLogos = data?.length > 0 ? data : defaultLogos;

  return (
    <div className="our-comunity">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span" style={{ paddingLeft: 0 }}>
              Our Community
            </span>
          </div>
        </div>
        <div className="client-grid pt30">
          {displayLogos.map((src, index) => (
            <div className="client-grid-item" key={index}>
              <div className="client-logo">
                <img
                  src={src}
                  alt="coworking spaces – SpringHouse coworking office view"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

