import React from 'react';
import { formatPrice } from '../helpers';

class Fish extends React.Component {
	static propTypes = {
		details: React.PropTypes.object.isRequired,
		addToOrder: React.PropTypes.func.isRequired,
		index: React.PropTypes.string.isRequired
	};

	render() { 
		const { details, addToOrder, index } = this.props;
		const isAvailable = details.status === 'available';
		const buttonText = isAvailable ? 'Add to order' : 'Sold out';
		return (
			<li className="menu-fish">
				<img src={details.image} alt={details.name} />
				<h3 className="fish-name">
					{details.name}
					<span className="price">{formatPrice(details.price)}</span>
				</h3>
				<p>{details.desc}</p>
				<button 
					disabled={!isAvailable}
					onClick={() => addToOrder(index)}
				>
					{buttonText}
				</button>
			</li>
		)
	}
}

export default Fish
