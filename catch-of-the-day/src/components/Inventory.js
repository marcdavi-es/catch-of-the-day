import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
	state = {
		uid: null,
		owner: null
	};

	static propTypes = {
		fishes: React.PropTypes.object.isRequired,
		updateFish: React.PropTypes.func.isRequired,
		deleteFish: React.PropTypes.func.isRequired,
		addFish: React.PropTypes.func.isRequired,
		loadSamples: React.PropTypes.func.isRequired,
		storeId: React.PropTypes.string.isRequired
	}

	componentDidMount() {
		base.onAuth((user) => {
			if(user){
				this.authHandler(null, { user });
			}
		})
	}

	handleChange = (e, key) => {
		const fish = this.props.fishes[key];
		// copy and update the fish state
		const updatedFish = {
			...fish,
			[e.target.name]: e.target.value
		}
		this.props.updateFish(key, updatedFish);
	};

	authenticate = (provider) => {
		base.authWithOAuthPopup(provider, this.authHandler);
	};

	authHandler = (err, authData) => {
		if (err) return console.log(err);
		// query firebase for the data for this store
		const storeRef = base.database().ref(this.props.storeId);
		storeRef.once('value', (snapshot) => {
			const store = snapshot.val() || {};
			if (!store.owner) {
				storeRef.set({
					owner: authData.user.uid
				})
			}
			this.setState({
				uid: authData.user.uid,
				owner: store.owner || authData.user.uid
			})
		})
	};

	logout = () => {
		base.unauth();
		this.setState({ uid: null});
	};

	renderLogin = () => {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's inventory</p>
				<button className="google" onClick={() => this.authenticate('google')}>Log in with Google</button>
				<button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
				<button className="twitter" onClick={() => this.authenticate('twitter')}>Log in with Twitter</button>
			</nav>
		)
	};

	renderInventory = (key) => {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
				<input 
					type="text" 
					name="name" 
					value={fish.name} 
					placeholder="Fish Name"
					onChange={(e) => this.handleChange(e,key)}
				/>
				<input 
					type="text" 
					name="price" 
					value={fish.price} 
					placeholder="Fish Price"
					onChange={(e) => this.handleChange(e,key)}
				/>
				<select 
					type="text" 
					name="status" 
					value={fish.status} 
					placeholder="Fish Status"
					onChange={(e) => this.handleChange(e,key)}
				>
					<option value="available">Fresh!</option>
					<option value="unavailable">Sold Out!</option>
				</select>
				<textarea 
					type="text" 
					name="desc" 
					value={fish.desc} 
					placeholder="Fish Desc"
					onChange={(e) => this.handleChange(e,key)}
				></textarea>
				<input 
					type="text" 
					name="image" 
					value={fish.image} 
					placeholder="Fish Image"
					onChange={(e) => this.handleChange(e,key)}
				/>
				<button onClick={() => this.props.deleteFish(key)}>Delete fish</button>
			</div>
		)
	};

	render() {
		const logout = <button onClick={this.logout}>Log out</button>;
		if(!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}
		if(this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry, you aren't the owner of this store</p>
					{logout}
				</div>
			)
		}
		return ( 
			<div>
				<h2>Inventory</h2>
				{logout}
				{
					Object
						.keys(this.props.fishes)
						.map(this.renderInventory)
				}
				<AddFishForm addFish={this.props.addFish} /> {/* pass addFish to AddFishForm as a prop */}
				<button onClick={this.props.loadSamples}>Load sample fishes</button>
			</div>
		)
	}
}

export default Inventory
