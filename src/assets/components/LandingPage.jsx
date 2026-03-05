function LandingPage() {
    return (
        <section className="min-w-screen min-h-screen flex">
            <div className="grow flex flex-col items-start justify-center gap-y-6">
                <h1 className="font-bold text-8xl">Get that Job</h1>
                <p className="text-left">
                    Find your next role with personalized job recommendations tailored <br />
                    to your expertise and preferences. Create a dynamic profile, upload <br />
                    your resume, and stand out to top employers today.
                </p>
                <div className="flex justify-start items-center gap-x-3">
                    <button>Start Exploring</button>
                    <button>Sign In</button>
                    <a className="text-[#3373ff] underline opacity-75 hover:opacity-100 cursor-pointer">Don't have an account? Sign Up</a>
                </div>
            </div>
            <div className="grow flex items-center justify-center">
                right side :)
            </div>
        </section>
    );
}

export default LandingPage;