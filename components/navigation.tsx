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
								<Link href="/">
									<NavbarItem isHidden="tablet" href="/">
										<FontAwesomeIcon icon="home" />
									</NavbarItem>
								</Link>
								<NavbarItem
									isHidden="tablet"
									href="javascript:void(0);"
									onClick={toggleRules}>
									<FontAwesomeIcon icon="question-circle" />
								</NavbarItem>
								{!hasSubmitted && (
									<Link href="/picks/make">
										<NavbarItem isHidden="tablet" href="/picks/make">
											<FontAwesomeIcon icon="users" />
										</NavbarItem>
									</Link>
								)}
								{isAdmin ? (
									<Link href="/admin/users">
										<NavbarItem isHidden="tablet" href="/admin/users">
											<FontAwesomeIcon icon="user-cog" />
										</NavbarItem>
									</Link>
								) : null}
								{isAdmin ? (
									<Link href="/admin/pool">
										<NavbarItem isHidden="tablet" href="/admin/pool">
											<FontAwesomeIcon icon="book-dead" />
										</NavbarItem>
									</Link>
								) : null}
								{isAdmin ? (
									<Link href="/admin/logs">
										<NavbarItem isHidden="tablet" href="/admin/logs">
											<FontAwesomeIcon icon="receipt" />
										</NavbarItem>
									</Link>
								) : null}
								<Link href="/logout">
									<NavbarItem isHidden="tablet" href="/logout">
										<FontAwesomeIcon icon="sign-out-alt" />
									</NavbarItem>
								</Link>
							</Fragment>
						)}
					</NavbarBrand>
					<NavbarMenu>
						{authenticated ? (
							<NavbarEnd isHidden="mobile">
								<Link href="/">
									<a className="navbar-item">Home</a>
								</Link>
								<NavbarItem href="javascript:void(0);" onClick={toggleRules}>
									Rules
								</NavbarItem>
								{!hasSubmitted && (
									<Link href="/picks/make">
										<a className="navbar-item">Make Picks</a>
									</Link>
								)}
								{isAdmin ? (
									<Link href="/admin/users">
										<a className="navbar-item">Users</a>
									</Link>
								) : null}
								{isAdmin ? (
									<Link href="/admin/pool">
										<a className="navbar-item">Kills</a>
									</Link>
								) : null}
								{isAdmin ? (
									<Link href="/admin/logs">
										<a className="navbar-item">Logs</a>
									</Link>
								) : null}
								<Link href="/logout">
									<a className="navbar-item">Log Out</a>
								</Link>
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
