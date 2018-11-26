import React from 'react';
import { Container, Row, Col, Form, Button, } from 'react-bootstrap';


const LoginComponent = ({ email, password, authenticate, onFieldChange, login }) => {

    return (
        <Container>
            <Row>
                <Col> <Button type="submit" onClick={login}> Auth0</Button></Col>
            </Row>
        </Container>
    );
};

export default LoginComponent;