import { NavLink } from 'react-router-dom'

const navItems = [
	{page: "Home", link: "/"},
	{page: "Job Page", link: "/jobs"},
	{page: "Profile", link: "/profile"},
	{page: "Create", link: "/create"},
	{page: "Listings", link: "/listings"},
	{page: "Sign Out", link: "/signout"}
]


function NavBar() {
	return (
		<nav className="block w-fit ml-auto bg-white p-5">
			<ul className="flex list-none m-0 p-0 gap-2">
				{navItems.map((item) => (
					<li key={item.page} className="p-1">
						<NavLink
							to={item.link}
							className={({ isActive }) => `no-underline ${isActive ? "bg-gray-50 border border-gray-300 rounded-lg" : ""} p-1`}
						>
							{item.page}
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	)
}

export default NavBar
