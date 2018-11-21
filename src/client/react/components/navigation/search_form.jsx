import React from 'react';

import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import { withRouter } from 'react-router-dom';


const SearchForm = ({
    history,
}) => {
    let searchInput = null;

    function handleSearch() {
        const path = `/hello/${searchInput.value}`;
        history.push(path);
    }

    return (
        <Form inline onSubmit={handleSearch}>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" ref={(input) => { searchInput = input }} />
            <Button variant="outline-info">Search</Button>
        </Form>
    );
}

// You can get access to the history object’s properties and the closest <Route>'s match via the withRouter higher-order component. 
// withRouter will pass updated match, location, and history props to the wrapped component (Navigation de navigation.jsx je crois) 
// whenever it renders.
const SearchFormWithRouter = withRouter(SearchForm);
export default SearchFormWithRouter;