import React from 'react';
import { formatPrice } from '../helpers';
import CSSTransitionGroup from 'react-addons-css-transition-group';

class Order extends React.Component {
	constructor() {
		super();
		this.renderOrder = this.renderOrder.bind(this);
	}

	renderOrder(key) {
		const { order, fishes, deleteFromOrder } = this.props;
		const fish = fishes[key];
		const count = order[key];
		const removeButton = <button onClick={() => deleteFromOrder(key)}>&times;</button>;
		if(!fish || fish.status === 'unavailable') {
			return (
				<li key={key}>
					Sorry, {fish ? fish.name : 'fish'} is no longer available. Try again tomorrow 🎣
					{removeButton}
				</li>
			)
		}
		return (
			<li key={key}>
				<span>
				<CSSTransitionGroup
					component="span"
					className="count"
					transitionName="count"
					transitionEnterTimeout={250}
					transitionLeaveTimeout={250}
				>
					<span key={count}>
						{count}
					</span>
				</CSSTransitionGroup>
				lbs {fish.name} {removeButton}
				</span>
				<span className="price">{formatPrice(count * fish.price)}</span>
			</li>
		)
	}

	render() { 
		const { order, fishes } = this.props;
		const orderKeys = Object.keys(order);
		const total = orderKeys.reduce((prevTotal, key) => {
			const fish = fishes[key];
			const count = order[key];
			const isAvailable = fish && fish.status === 'available';
			if (isAvailable) {
				return prevTotal + (count * fish.price || 0);
			}
			return prevTotal;
		}, 0);
		return ( 
			<div className="order-wrap">
				<h2>Your Order</h2>
				<CSSTransitionGroup 
					className="order"
					component="ul"
					transitionName="order"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
				>
					{orderKeys.map(this.renderOrder)}
					<li className="total">
						<strong>Total:</strong>
						{formatPrice(total)}
					</li>
				</CSSTransitionGroup>
			</div>
		)
	}
}

Order.propTypes = {
	order: React.PropTypes.object.isRequired,
	fishes: React.PropTypes.object.isRequired,
	deleteFromOrder: React.PropTypes.func.isRequired
}

export default Order
