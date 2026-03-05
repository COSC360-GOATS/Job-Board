function LandingPage() {
    const buttonStyle = "rounded-full border bg-gray-800 px-6 py-2 cursor-pointer hover:bg-gray-700";

    return (
        <section className="min-w-screen min-h-screen flex px-[10%]">
            <div className="grow flex flex-col items-start justify-center gap-y-4">
                <h1 className="font-bold text-6xl">Get that Job</h1>
                <p className="text-left mb-4 text-lg">
                    Find your next role with personalized job recommendations tailored <br />
                    to your expertise and preferences. Create a dynamic profile, upload <br />
                    your resume, and stand out to top employers today.
                </p>
                <div className="flex justify-start items-center gap-x-3">
                    <button className={buttonStyle}>Start Exploring</button>
                    <button className={buttonStyle}>Sign In</button>
                    <a className="text-[#3373ff] underline opacity-75 hover:opacity-100 cursor-pointer">Don't have an account? Sign Up</a>
                </div>
            </div>
            <div className="grow flex items-center justify-center text-[256px]">
                🤑
            </div>
        </section>
    );
}

export default LandingPage;