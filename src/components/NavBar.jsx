import React from 'react';
const navItems = [
	{page: "Job Page", link: "/notyourmom"},
	{page: "Profile", link: "/yourprofile"},
	{page: "Create", link: "/yourcreate"},
	{page: "Listings", link: "/yourlistings"},
	{page: "Sign Out", link: "/yoursignout"}
]

const currentPage = window.location.pathname
console.log(currentPage)

function NavBar() {
	return (
		<nav className="block w-fit ml-auto bg-white p-5">
			<ul className="flex list-none m-0 p-0 gap-2">
				{navItems.map((item) => (
					<li key={item.page} className={`${currentPage === item.link ? "bg-gray-50 border border-gray-300 rounded-lg" : ""} p-1`}>
						<a href={item.link} className="no-underline">
							{item.page}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default NavBar
