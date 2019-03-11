import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Link from 'next/link';
import { Container, Hero, HeroBody, HeroHeader, HeroFooter, Nav, NavItem, NavCenter, NavLeft, NavRight, Title } from 'bloomer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import RulesModal from '../components/rules-modal';
import { S3_URL } from '../api/constants';

interface Props {
	authenticated: boolean;
	hasSubmitted: boolean;
	isAdmin: boolean;
}

const Navigation = ({ authenticated, hasSubmitted, isAdmin }: Props) => {
	const [showRulesModal, setShowRulesModal] = useState(false);
	const toggleRules = () => {
		setShowRulesModal(value => !value);
	};

	return (
		<Hero isColor="primary" isSize="small">
			<ToastContainer />
			<HeroHeader>
				<Nav>
					<NavLeft isHidden="mobile">
						<NavItem isBrand>
							<Title isSize={3}>
								<Link href="/"><a># </a></Link>
							</Title>
							<Title isSize={5}>
								<Link href="/"><a>&nbsp; Death Pool</a></Link>
							</Title>
						</NavItem>
					</NavLeft>
					<NavCenter isHidden="tablet">
						<NavItem>
							<Title isSize={3} isPaddingless># </Title>
						</NavItem>
					</NavCenter>
					{authenticated ? (
						<NavRight isMenu isHidden="mobile">
							<Link href="/"><a className="nav-item">Home</a></Link>
							<NavItem href="javascript:void(0);" onClick={toggleRules}>Rules</NavItem>
							{!hasSubmitted ? <Link href="/picks/make"><a className="nav-item">Make Picks</a></Link> : null}
							{isAdmin ? <Link href="/admin/users"><a className="nav-item">Users</a></Link> : null}
							{isAdmin ? <Link href="/admin/pool"><a className="nav-item">Kills</a></Link> : null}
							{isAdmin ? <Link href="/admin/logs"><a className="nav-item">Logs</a></Link> : null}
							<Link href="/logout"><a className="nav-item">Log Out</a></Link>
						</NavRight>
					)
						:
						null
					}
				</Nav>
			</HeroHeader>
			{!authenticated ? (
				<HeroBody>
					<Container hasTextAlign="centered">
						<img src={`${S3_URL}/images/gameOfThronesBckgrd.jpg`} />
					</Container>
				</HeroBody>
			)
				:
				<HeroFooter isHidden="tablet">
					<Nav>
						<NavLeft hasTextAlign="centered" >
							<Link href="/"><a className="nav-item"><FontAwesomeIcon icon="home" /></a></Link>
							<NavItem href="javascript:void(0);" onClick={toggleRules}><FontAwesomeIcon icon="question-circle" /></NavItem>
							<Link href="/picks/make"><a className="nav-item"><FontAwesomeIcon icon="users" /></a></Link>
							<Link href="/logout"><a className="nav-item"><FontAwesomeIcon icon="sign-out" /></a></Link>
						</NavLeft>
					</Nav>
				</HeroFooter>
			}

			{showRulesModal ? <RulesModal toggleRules={toggleRules} /> : null}
		</Hero>
	);
};

export default Navigation;
