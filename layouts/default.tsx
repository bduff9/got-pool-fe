import React, { ReactNode } from 'react';
import { Section } from 'bloomer';

import Meta from '../components/meta';
import Navigation from '../components/navigation';

interface MetaObj {
	description?: string;
	title?: string;
}

const DefaultLayout = ({ children, meta, ...props }: { children: ReactNode, meta: MetaObj }) => (
	<div>
		<Meta {...meta} />
		<Navigation {...props} />
		<Section hasTextAlign="centered">
			{ children }
		</Section>
	</div>
);

export default DefaultLayout;
