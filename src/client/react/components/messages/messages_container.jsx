import React from "react";
import MessagesComponent from "./messages_component";
import sendApiRequest from "react/utils/api";
import axios from 'axios';
import auth0Client from 'entries/Auth';
class MessagesContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { messages: [] };

    this.deleteMessage = this.deleteMessage.bind(this);
  }


  async fetchMessages() {

    const messages = (await axios.get('/api/messages', {
      headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
  })).data;
    this.setState({
      messages,
    });
  }

  deleteMessage(message) {

    const url = `/api/messages/${message._id}`

    sendApiRequest({
      url,
      method: "DELETE",
    })
      .then((_ignored) => {
        const { messages } = this.state;

        const messageIndex = messages.indexOf(message);
        if (messageIndex > -1) {
          messages.splice(messageIndex, 1);
        }
        this.setState({
          messages: messages,
        })
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          messages: [],
        })
      })
  }

  componentDidMount() {
    this.fetchMessages()
  }


  render() {
    return (
      <MessagesComponent
        messages={this.state.messages}
        deleteMessage={this.deleteMessage}
      />
    );
  }
}

export default MessagesContainer;
