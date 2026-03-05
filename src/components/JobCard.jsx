function JobCard() {
    return (
        <div className="job-card">

            {/* Job card content goes here */}
            <div className="job-card-header">
                <h2 className="job-title">Job Title</h2>
                <h3 className="job-subtitle">Job Description</h3>

               <p className = "job-description">Job description goes here.</p>

               <div className="job-card-footer">100 views, 59 applications</div>

            </div>

            {/*About the company*/}
                <div className="company-info">
                    <h3 className="employer-name">Employer 1</h3>
                    <div className="employer-rating">Rating: 4.5/5</div>
                    <h3>About Us</h3>
                    <p className="company-description">Company description goes here.</p>
                </div>
                
                
        </div>
    )
}
export default JobCard;