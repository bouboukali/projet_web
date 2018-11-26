import React from 'react';
import { Container, Row, Col, Form, Button, } from 'react-bootstrap';


const CallbackComponent = ({ email, name, phone, inscription, onFieldChange }) => {

    return (
        <Container>
            <Row>
                <Col xs={{ span: 8, offset: 2 }} style={{ marginTop: "200px" }}>
                    <Form onSubmit={inscription}>
                        <Form.Group as={Row} controlId="formHorizontalEmail">
                            <Form.Label column sm={2}>
                                Email
                            </Form.Label>
                            <Col sm={10}>

                                <Form.Control name="email" type="email" placeholder="Email" value={email} onChange={onFieldChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="formHorizontalName">
                            <Form.Label column sm={2}>
                                Nom
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control name="name" type="text" placeholder="Nom" value={name} onChange={onFieldChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formHorizontalPhone">
                            <Form.Label column sm={2}>
                                GSM
                            </Form.Label>
                            <Col sm={10}>

                                <Form.Control name="phone" type="tel" placeholder="GSM" value={phone} onChange={onFieldChange} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Col sm={{ span: 10, offset: 2 }}>
                                <Button type="submit">S'inscrire</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CallbackComponent;