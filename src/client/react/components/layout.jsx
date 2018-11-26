import React, { Component } from 'react'
import { Container, Row, Col } from "react-bootstrap";

import Navigation from "./navigation/navigation";
import RouterOutler from "./router_outlet";
import Footer from "./footer/footer";

import { Route, Redirect, Switch, withRouter } from "react-router-dom";

export class Layout extends Component {
  render() {
    return (
      // A common pattern in React is for a component to return multiple elements.
      // React.Fragment let you group a list of children without adding extra nodes to the DOM.
      <div>
        <React.Fragment>
          <Navigation />
          <Container>
            <Row>
              <Col xs={2} />
              <Col xs={8}>


                <RouterOutler />


              </Col>
              <Col xs={2} />
            </Row>
          </Container>

          <Footer />

        </React.Fragment>
      </div>
    )
  }
}

export default Layout
