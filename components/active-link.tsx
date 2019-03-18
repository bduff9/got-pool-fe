import { NavbarItem } from 'bloomer';
import Link from 'next/link';
import { withRouter, RouterProps } from 'next/router';
import React from 'react';

interface ActiveLinkProps {
	children: JSX.Element | string;
	href: string;
	isHidden?:
	| boolean
	| 'mobile'
	| 'tablet'
	| 'touch'
	| 'desktop'
	| 'widescreen'
	| 'tablet-only'
	| 'desktop-only'
	| undefined;
	router: RouterProps;
}

const ActiveLink = ({
	children,
	href,
	isHidden,
	router,
	...props
}: ActiveLinkProps): JSX.Element => {
	const isActive = router.pathname === href;

	return (
		<Link href={href} {...props}>
			<NavbarItem href={href} isActive={isActive} isHidden={isHidden}>
				{children}
			</NavbarItem>
		</Link>
	);
};

export default withRouter(ActiveLink);
