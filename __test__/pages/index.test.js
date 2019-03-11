import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import IndexPage from '../../pages/index.js';

describe('IndexPage', () => {
	/**
	 * @type {import('enzyme').ShallowWrapper<any, any, any>} wrapper
	 */
	let wrapper;

	beforeEach(() => {
		wrapper = shallow(<IndexPage />);
	});

	it('renders', () => {
		expect(wrapper).toBe(true);
	});

	test.todo('add tests for IndexPage');

	it('matches snapshot', () => {
		const component = renderer.create(<IndexPage />);
		const tree = component.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
