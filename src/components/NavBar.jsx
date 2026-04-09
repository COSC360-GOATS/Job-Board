import { NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, getUserDisplayName, getUserInitial, getUserRole } from '../utils/user'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function resolveImageUrl(url) {
	if (!url) return ''
	return /^https?:\/\//i.test(url) ? url : `${API_BASE}${url}`
}

function getNavItems(user) {
	const role = getUserRole(user);

	const base = [
		{ page: 'Home', link: '/' },
		{ page: `${role === 'employer' ? 'Manage' : 'Explore'} Jobs`, link: role === 'employer' ? '/jobs/employers' : '/jobs' },
		{ page: 'Profile', link: '/profile' }
	];

	if (role === 'admin') {
		return [
			{ page: 'Home', link: '/' },
			{ page: 'Admin', link: '/admin' },
			{ page: 'Profile', link: '/profile' }
		];
	}

	return base;
}

function NavBar({ transparent = false }) {
	const navigate = useNavigate();
	const user = getCurrentUser();
	const displayName = getUserDisplayName(user);
	const navItems = getNavItems(user);
	const avatarSrc = resolveImageUrl(user?.profilePicture || user?.profile || user?.logo)

	const navClassName = `ml-auto w-full rounded-2xl border px-5 py-4 ${transparent ? 'border-transparent bg-transparent shadow-none' : 'border-slate-200 bg-white shadow-sm'}`;
	const navItemClassName = (isActive) =>
		transparent
			? `rounded-lg border px-3 py-2 text-sm font-medium text-white transition ${isActive ? 'border-white/40 bg-white/20' : 'border-white/25 bg-white/10 hover:bg-white/20'}`
			: `rounded-lg border px-3 py-2 text-sm font-medium transition ${isActive ? 'border-violet-200 bg-violet-50 text-violet-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`;

	const authButtonClassName = `rounded-lg border px-3 py-2 text-sm font-medium transition ${transparent ? 'border-white/25 bg-white/10 text-white hover:bg-white/20' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`;

	const handleSignOut = () => {
		localStorage.removeItem('user');
		navigate('/signout', { replace: true });
	};

	return (
		<nav className={navClassName}>
			<div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
				<div className="min-w-0 justify-self-start">
					<p className={`font-semibold text-2xl ${transparent ? 'text-white' : 'text-black'}`}>
						Get that Job<span className="text-xs">.com</span>
					</p>
				</div>

				<div className="flex items-center gap-2 justify-self-center">
					{navItems.map((item) => (
						<NavLink
							key={item.page}
							to={item.link}
							className={({ isActive }) => navItemClassName(isActive)}
						>
							{item.page}
						</NavLink>
					))}
				</div>

				<div className="flex min-w-0 items-center justify-end gap-3">
					{user ? (
						<>
							<div className="min-w-0">
								<p className={`text-xs uppercase tracking-wide ${transparent ? 'text-white/70' : 'text-slate-500'}`}>Signed in as</p>
								<p className={`truncate text-sm font-semibold ${transparent ? 'text-white' : 'text-slate-900'}`}>{displayName}</p>
							</div>
							<div className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border text-lg font-semibold ${transparent ? 'border-white/40 bg-white/15 text-white' : 'border-violet-200 bg-violet-50 text-violet-300'}`}>
								{avatarSrc ? (
									<img src={avatarSrc} alt={displayName || 'Signed in user'} className="h-full w-full object-cover" />
								) : (
									<span>{getUserInitial(user)}</span>
								)}
							</div>
							<button
								type="button"
								onClick={handleSignOut}
								className={authButtonClassName}
							>
								Sign Out
							</button>
						</>
					) : (
						<NavLink
							to="/login"
							className={({ isActive }) => navItemClassName(isActive)}
						>
							Login
						</NavLink>
					)}
				</div>
			</div>
		</nav>
	)
}

export default NavBar
