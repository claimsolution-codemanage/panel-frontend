import { Link } from "react-router-dom"
import { Helmet } from "react-helmet";
export default function Feedback(){
return (  
<>
<Helmet>
        <link rel="canonical" href="http://claimsolution.in/feedback" />
      </Helmet>
    {/* feedback para */}
    <div className="container-fluid py-5">
        <div className="container-px-5">
            <div className="h1 text-center fw-bold py-5">Feedback</div>
            <div className="color-2 fs-5">At ClaimSolution.in, your opinion matters! We value your feedback to enhance our services. Share your thoughts, suggestions, or concerns with us. Your insights guide us in delivering an exceptional experience. Let's work together to make ClaimSolution.in even better! <br />  <br /> <span className="color-5">How to Provide Feedback: </span> <br />  
                <ul>
                    <li>Online Form: Complete our user-friendly online feedback form.</li>
                    <li>Email: Send us an email at feedback@claimsolution.in.</li>
                    <li>Customer Support: Reach out to our dedicated customer support team.</li>
                    <li>Social Media: Connect with us on social media and share your thoughts.</li>
                </ul>
                <span className="color-5">What We Want to Know:</span> <br />  
                <ul>
                    <li>User Experience: Tell us about your experience navigating our website or using our services.</li>
                    <li>Suggestions: Share any ideas or features you'd like to see on ClaimSolution.in.</li>
                    <li>Concerns: If you've encountered challenges, let us know, so we can address them promptly.</li>
                    <li>Compliments: Positive experiences motivate us. Share what you appreciate!</li>
                </ul>
                <span className="color-5">Why Your Feedback Matters:</span> <br />  
                <ul>
                    <li>Helps us improve our services.</li>
                    <li>Guides future enhancements.</li>
                    <li>Ensures a user-centric platform.</li>
                    <li>Strengthens our commitment to excellence.</li>
                </ul>
                <Link to="#!" className="color-1 btn bg-color-4">Feedback form</Link>
            </div>
        </div>
    </div>

</>
)
}