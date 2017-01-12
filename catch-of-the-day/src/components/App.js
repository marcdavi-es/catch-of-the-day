import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

import base from '../base';

import sampleFishes from '../sample-fishes';

class App extends React.Component {
	constructor() {
		super();
		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.deleteFish = this.deleteFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.deleteFromOrder = this.deleteFromOrder.bind(this);
		// initial state
		this.state = {
			fishes: {},
			order: {}
		}
	}

	componentWillMount() {
		// create real time sync between React and Firebase :O !!!
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`, { 
			context: this,
			state: 'fishes'
		})
		// if there is order state in localStorage, get it
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if (localStorageRef) {
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order))
	}

	addFish(fish) {
		// update our state
		const fishes = {...this.state.fishes}; // create a fresh state, starting with the existing state
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish; // add new fish
		this.setState({ fishes }) // set state
	}

	updateFish(key, fish) {
		const fishes = {
			...this.state.fishes,
			[key]: {...fish}
		};
		this.setState({ fishes })
	}

	deleteFish(key) {
		const fishes = {...this.state.fishes};
		fishes[key] = null; // a null value triggers the Firebase sync (rather than `delete fishes[key]`)
		this.setState({ fishes })
	}

	loadSamples() {
		this.setState({ fishes: sampleFishes });
	}

	addToOrder(key) {
		const order = {...this.state.order}
		order[key] = order[key] + 1 || 1;
		this.setState({ order });
	}

	deleteFromOrder(key) {
		const order = {...this.state.order}
		delete order[key];
		this.setState({ order });
	}

	render() {
		return ( 
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/>
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map(key => <Fish 
															key={key}
															index={key /* because I can't access the key - that's just for React :) */} 
															details={this.state.fishes[key]}
															addToOrder={this.addToOrder}
															/>
										)
						}
					</ul>
				</div>
				<Order 
					fishes={this.state.fishes}
					order={this.state.order}
					params={this.props.params}
					deleteFromOrder={this.deleteFromOrder}
				/>
				<Inventory 
					addFish={this.addFish} 
					updateFish={this.updateFish}
					deleteFish={this.deleteFish}
					loadSamples={this.loadSamples}
					fishes={this.state.fishes}
				/> 
			</div>
		)
	}
}

export default App
