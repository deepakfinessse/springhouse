import connectDB from "@/utils/db";
import { Header as HeaderModel } from "@/model/header.model";
import Link from "next/link";

export default async function Header() {
  await connectDB();
  const headerData = (await HeaderModel.findOne({})) || {};

  const logoUrl = headerData?.logo || null;
  const menuData = headerData?.menu || [];

  return (
    <header>
      <div className="nav__container">
        <div className="nav__mobile">
          <div className="nav__logo">
            <Link href="/">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="working space – SpringHouse coworking office view"
                />
              )}
            </Link>
          </div>
          <div className="nav__btn">
            <a aria-label="Mobile menu" className="nav-toggle">
              <span></span>
              <span className="mrg"></span>
              <span className="mrg"></span>
            </a>
          </div>
        </div>
        <nav className="menu-toggle">
          <ul className="nav__menu">
            {menuData.map((item, index) => {
              const hasSubMenu = item.links && item.links.length > 0;

              if (hasSubMenu) {
                return (
                  <li
                    className={
                      item.title === "Solutions" ? "dropdown drop1" : "dropdown"
                    }
                    key={index}
                  >
                    <a
                      className={item.title === "Solutions" ? "arrow1" : ""}
                      href={item.url || "#"}
                    >
                      {item.title}
                    </a>
                    {item.title === "Solutions" && (
                      <a
                        className="nav-link dropdown-toggle dropdown-toggle-split"
                        href="#"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></a>
                    )}
                    <ul>
                      {item.links.map((subLink, subIndex) => (
                        <li key={subIndex}>
                          <a href={subLink.url || "#"}>{subLink.label}</a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              } else {
                return (
                  <li key={index}>
                    <a
                      href={item.url || "/"}
                      className={
                        item.title === "Managed Office" ? "managed-office" : ""
                      }
                    >
                      {item.title}
                    </a>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
        <div className="navbar-btn-box">
          <a
            href="#exampleModaltwo"
            data-bs-toggle="modal"
            data-bs-target="#exampleModaltwo"
            className="themebtn themebtn2 lets-talk"
          >
            Let&apos;s Talk!
          </a>
        </div>
      </div>
    </header>
  );
}
