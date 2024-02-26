import React from 'react'

export const Footer = () => {
  return (
    <div className="container-fluid p-0 bottom-0 bg-color-4 color-1">
    <footer className="text-center text-lg-start ">
      <div
        className="d-flex gap-1  justify-content-center text-center pt-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      >
        <p> © {new Date().getFullYear()} Copyright</p> 
        <a className="nav-items" href="https://ClaimSolution.in/">
          ClaimSolution.in 
        </a>
        All rights reserved.
      </div>
      {/* Copyright */}
    </footer>
  </div>
  )
}
