import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import {
	Container,
	Hero,
	HeroBody,
	HeroHeader,
	Navbar,
	NavbarBrand,
	NavbarEnd,
	NavbarItem,
	NavbarMenu,
	Title,
} from 'bloomer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ActiveLink from '../components/active-link';
import RulesModal from '../components/rules-modal';
import { S3_URL } from '../api/constants';

interface Props {
	authenticated: boolean;
	hasSubmitted: boolean;
	isAdmin: boolean;
}

const Navigation = ({
	authenticated,
	hasSubmitted,
	isAdmin,
}: Props): JSX.Element => {
	const [showRulesModal, setShowRulesModal] = useState(false);

	const toggleRules = (): void => {
		setShowRulesModal(value => !value);
	};

	return (
		<Hero isColor="primary" isSize="small">
			<HeroHeader>
				<Navbar>
					<NavbarBrand>
						<NavbarItem isHidden="mobile">
							<Title isSize={3}>
								<Link href="/">
									<a># </a>
								</Link>
							</Title>
							<Title isSize={5}>
								<Link href="/">
									<a>&nbsp; Death Pool</a>
								</Link>
							</Title>
						</NavbarItem>
						<Link href="/">
							<NavbarItem isHidden="tablet" href="/">
								GoT
							</NavbarItem>
						</Link>
						{authenticated && (
							<Fragment>
								<ActiveLink isHidden="tablet" href="/">
									<FontAwesomeIcon icon="home" />
								</ActiveLink>
								<NavbarItem
									isHidden="tablet"
									href="javascript:void(0);"
									onClick={toggleRules}>
									<FontAwesomeIcon icon="question-circle" />
								</NavbarItem>
								{!hasSubmitted && (
									<ActiveLink href="/picks/make" isHidden="tablet">
										<FontAwesomeIcon icon="users" />
									</ActiveLink>
								)}
								{isAdmin && (
									<ActiveLink href="/admin/users" isHidden="tablet">
										<FontAwesomeIcon icon="user-cog" />
									</ActiveLink>
								)}
								{isAdmin && (
									<ActiveLink href="/admin/pool" isHidden="tablet">
										<FontAwesomeIcon icon="book-dead" />
									</ActiveLink>
								)}
								{isAdmin && (
									<ActiveLink href="/admin/logs" isHidden="tablet">
										<FontAwesomeIcon icon="receipt" />
									</ActiveLink>
								)}
								<ActiveLink href="/logout" isHidden="tablet">
									<FontAwesomeIcon icon="sign-out-alt" />
								</ActiveLink>
							</Fragment>
						)}
					</NavbarBrand>
					<NavbarMenu>
						{authenticated ? (
							<NavbarEnd isHidden="mobile">
								<ActiveLink href="/">Home</ActiveLink>
								<NavbarItem
									href="javascript:void(0);"
									isActive={showRulesModal}
									onClick={toggleRules}>
									Rules
								</NavbarItem>
								{!hasSubmitted && (
									<ActiveLink href="/picks/make">Make Picks</ActiveLink>
								)}
								{isAdmin && <ActiveLink href="/admin/users">Users</ActiveLink>}
								{isAdmin && <ActiveLink href="/admin/pool">Kills</ActiveLink>}
								{isAdmin && <ActiveLink href="/admin/logs">Logs</ActiveLink>}
								<ActiveLink href="/logout">Log Out</ActiveLink>
							</NavbarEnd>
						) : null}
					</NavbarMenu>
				</Navbar>
			</HeroHeader>
			{!authenticated && (
				<HeroBody>
					<Container hasTextAlign="centered">
						<img src={`${S3_URL}/images/gameOfThronesBckgrd.jpg`} />
					</Container>
				</HeroBody>
			)}

			{showRulesModal ? <RulesModal toggleRules={toggleRules} /> : null}
		</Hero>
	);
};

export default Navigation;
