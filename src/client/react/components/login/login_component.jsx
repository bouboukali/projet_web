import React from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';


const LoginComponent = ({ email, password, authenticate, onFieldChange, login,login2 }) => {

    return (
        <Container style={{alignItems: 'center',
        justifyContent: 'center'}}  >
      
            
                <Button  type="submit" onClick={login}> Se connecter grâce à Auth0 Passwordless</Button>
                <Button  type="submit" onClick={login2}> Email</Button>
        </Container>
    );
};

export default LoginComponent;