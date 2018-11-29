import React from 'react';
import { Container, Row, Col, Form, Button} from 'react-bootstrap';


const LoginComponent = ({ email, password, authenticate, onFieldChange, login,login2 }) => {

    return (
        <Container style={{alignItems: 'center',
        justifyContent: 'center'}}  >
      
      <div class="col-lg-10">
					<h3 style={{position: "fixed", left: "31%", top:"25%"}}>Connection with Auth0 Passwordless</h3>
				</div>
            
      <Button style={{position: "fixed", left: "30%", top:"40%"}} type="submit" onClick={login}> Using SMS</Button>
        <Button style={{position: "fixed", left: "55%", top:"40%"}} type="submit" onClick={login2}> Using Email</Button>
        </Container>
    );
};

export default LoginComponent;