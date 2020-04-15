import React, { useState } from 'react';

import Typeahead from 'jlc-react-typeahead';
import 'jlc-react-typeahead/dist/index.css';

const App = () => {
	const [ data, setData ] = useState({});

	function query(q) {
		fetch('https://api.covid19api.com/summary').then((response) => response.json()).then((theData) => {
			setData(theData.countries.filter((country) => country.indexOf(q) > 0));
		});
	}

	return (
		<Typeahead onSearch={query} itemProp="item" labelProp="item" placeholder="Type in a country">
			{data.map((item, index) => <div item={item} key={index} />)}
		</Typeahead>
	);
};

export default App;
