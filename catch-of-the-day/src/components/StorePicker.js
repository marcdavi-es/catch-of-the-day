import React from 'react';
import { getFunName } from '../helpers';

// create component syntax
class StorePicker extends React.Component { // upper case because it can be reused
	goToStore (event) {
		event.preventDefault();
		// grab text from box
		const storeId = this.storeInput.value;
		// go to /store/:storeId
		this.context.router.transitionTo(`/store/${storeId}`);
	}

	render() { // all components MUST have a render method
		return ( 
			<form 
				className="store-selector" 
				onSubmit={ (e) => this.goToStore(e) } // function call in StorePicker scope so this within goToStore is Storepicker  
			> {/* each component can render only one DOM parent. This is JSX comment syntax */}
				<h2>Please Enter A Store</h2>
				<input 
					type="text" 
					required placeholder="Store Name" 
					defaultValue={getFunName()}
					ref={(input) => { this.storeInput = input }}
				/>
				<button type="submit">Visit Store ></button>
			</form>
		)
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
}

export default StorePicker
