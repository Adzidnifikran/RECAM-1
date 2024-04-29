import React from "react";

const HeaderComponent = () => {
  return (
    <div id="content-wrapper" className="d-flex flex-column">
      {/* Main Content */}
      <div id="content">
        {/* Topbar */}
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          {/* Sidebar Toggle (Topbar) */}
          <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
            <i className="fa fa-bars" />
          </button>
          <span className="navbar-brand mx-auto text-primary">Kamera Lengkap, Mantap, Bisa Memperpanjang Segala Macam Foto</span>
        </nav>
      </div>
    </div>
  );
};

export default HeaderComponent;






















