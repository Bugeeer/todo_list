import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div className="main-footer">
          <p className="col-sm">
            &copy;{new Date().getFullYear()} THIS IS FOOTER
          </p>
    </div>
  );
}

export default Footer;