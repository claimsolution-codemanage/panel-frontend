import { Link, useNavigate } from 'react-router-dom'
import '../styles/error.css'

export default function Error() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        // Navigate back to the previous page if history exists, otherwise go to home page
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <>
            <div className="error-page-wrapper">
                {/* Ambient floating blobs for dynamic styling */}
                <div className="error-bg-blob error-bg-blob-1"></div>
                <div className="error-bg-blob error-bg-blob-2"></div>

                <div className="container d-flex justify-content-center align-items-center">
                    <div className="error-card">

                        {/* Top Brand Logo */}
                        <div className="error-logo-container">
                            <Link to="/">
                                <img
                                    src="/Images/main-logo.jpg"
                                    alt="Claim Solution Logo"
                                    className="error-logo"
                                    onError={(e) => {
                                        // Fallback to text logo if image fails to load
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </Link>
                        </div>

                        {/* Split Page Layout */}
                        <div className="row align-items-center">

                            {/* Content Column */}
                            <div className="col-lg-6 order-2 order-lg-1 text-start">
                                <h1 className="error-title-huge">404</h1>
                                <h2 className="error-subtitle">Oops! Page Not Found</h2>
                                <p className="error-description">
                                    The page you are looking for might have been removed, had its name changed,
                                    or is temporarily unavailable. Let's get you back on track!
                                </p>

                                {/* Modern Navigation Actions */}
                                <div className="actions-container">
                                    <button
                                        onClick={handleGoBack}
                                        className="btn btn-secondary-brand d-inline-flex align-items-center"
                                    >
                                        <i className="bi bi-arrow-left"></i>
                                        Go Back
                                    </button>

                                    <Link to="/" className="btn btn-primary-brand d-inline-flex align-items-center">
                                        <i className="bi bi-house-fill"></i>
                                        Go to Portal Home
                                    </Link>
                                </div>

                                {/* Additional Links */}
                                <div className="mt-4 pt-3 border-top border-light d-flex gap-3">
                                    <a
                                        href="https://claimsolution.in/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-link-brand"
                                    >
                                        <i className="bi bi-globe"></i>
                                        Visit Main Website
                                    </a>

                                    <a
                                        href="https://claimsolution.in/contact-us"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-link-brand"
                                    >
                                        <i className="bi bi-chat-dots-fill"></i>
                                        Contact Support
                                    </a>
                                </div>
                            </div>

                            {/* Graphic Illustration Column */}
                            <div className="col-lg-6 order-1 order-lg-2 text-center mb-4 mb-lg-0">
                                <svg viewBox="0 0 500 500" className="floating-illustration" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Glowing circles in background */}
                                    <circle cx="250" cy="250" r="180" fill="url(#svg-gradient-bg)" opacity="0.08" />
                                    <circle cx="250" cy="250" r="140" stroke="url(#svg-gradient-border)" strokeWidth="2" strokeDasharray="8 8" opacity="0.3" />

                                    {/* Illustrative element: A styled browser window showing 404 */}
                                    <rect x="100" y="130" width="300" height="220" rx="20" fill="white" stroke="#182f59" strokeWidth="6" filter="drop-shadow(0 15px 35px rgba(24, 47, 89, 0.06))" />

                                    {/* Browser top header */}
                                    <path d="M100 176H400" stroke="#182f59" strokeWidth="4" />
                                    <circle cx="130" cy="153" r="7" fill="#ff5f56" />
                                    <circle cx="154" cy="153" r="7" fill="#ffbd2e" />
                                    <circle cx="178" cy="153" r="7" fill="#27c93f" />

                                    {/* Big 404 inside window */}
                                    <text x="250" y="260" fontFamily="'Nunito', sans-serif" fontWeight="900" fontSize="72" fill="#182f59" textAnchor="middle">404</text>

                                    {/* Supporting subtitle */}
                                    <text x="250" y="295" fontFamily="'Nunito', sans-serif" fontWeight="700" fontSize="15" fill="#fa9b23" letterSpacing="2" textAnchor="middle">PAGE NOT FOUND</text>

                                    {/* Glowing Sparkles / Star Elements */}
                                    <path d="M410 160L414 172L426 172L416 179L420 191L410 184L400 191L404 179L394 172L406 172L410 160Z" fill="#fa9b23" opacity="0.8" />
                                    <path d="M70 280L72 288L80 288L73 293L76 301L70 296L64 301L67 293L60 288L68 288L70 280Z" fill="#182f59" opacity="0.6" />
                                    <path d="M370 310L371.5 315.5L377 315.5L372.5 319L374 324.5L370 321.5L366 324.5L367.5 319L363 315.5L368.5 315.5L370 310Z" fill="#fa9b23" opacity="0.7" />

                                    {/* Magnifying Glass detailing */}
                                    <g transform="translate(20, 20)" stroke="#fa9b23" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="340" cy="270" r="32" fill="white" stroke="#182f59" strokeWidth="6" />
                                        <line x1="363" y1="293" x2="395" y2="325" stroke="#182f59" strokeWidth="8" />
                                        {/* lens reflection */}
                                        <path d="M328 258A14 14 0 0 1 342 244" stroke="#fa9b23" strokeWidth="3" />
                                    </g>

                                    {/* Gradient Definitions */}
                                    <defs>
                                        <linearGradient id="svg-gradient-bg" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
                                            <stop offset="0%" stopColor="#182f59" />
                                            <stop offset="100%" stopColor="#fa9b23" />
                                        </linearGradient>
                                        <linearGradient id="svg-gradient-border" x1="100" y1="130" x2="400" y2="350" gradientUnits="userSpaceOnUse">
                                            <stop offset="0%" stopColor="#182f59" />
                                            <stop offset="100%" stopColor="#fa9b23" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}