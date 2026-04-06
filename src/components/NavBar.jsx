import { NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, getUserDisplayName, getUserInitial } from '../utils/user'

const navItems = [
	{ page: 'Home', link: '/home' },
	{ page: 'Jobs', link: '/jobs' },
	{ page: 'Profile', link: '/profile' }
]

function NavBar() {
	const navigate = useNavigate();
	const user = getCurrentUser();
	const displayName = getUserDisplayName(user);

	const handleSignOut = () => {
		localStorage.removeItem('user');
		navigate('/login', { replace: true });
	};

	return (
		<nav className="ml-auto flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
			{user ? (
				<div className="flex min-w-0 items-center gap-3">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-200 bg-violet-50 text-lg font-semibold text-violet-300">
						{user.profile ? (
							<img src={user.profile} alt={displayName || 'Signed in user'} className="h-full w-full object-cover" />
						) : (
							<span>{getUserInitial(user)}</span>
						)}
					</div>
					<div className="min-w-0">
						<p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
						<p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
					</div>
				</div>
			) : (
				<div />
			)}

			<div className="flex items-center gap-2">
				{navItems.map((item) => (
					<NavLink
						key={item.page}
						to={item.link}
						className={({ isActive }) => `rounded-lg border px-3 py-2 text-sm font-medium transition ${isActive ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
					>
						{item.page}
					</NavLink>
				))}
				<button
					type="button"
					onClick={handleSignOut}
					className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
				>
					Sign Out
				</button>
			</div>
		</nav>
	)
}

export default NavBar
