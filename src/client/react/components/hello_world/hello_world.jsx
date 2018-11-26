import React from 'react';
import { Alert } from 'react-bootstrap';

class HelloWorld extends React.Component {

  render() {
    const { name } = this.props;

    return (
      <Alert variant='info'>
        Hello { name }
      </Alert>
    );
  }
}



export default HelloWorld;
