var React = require('react');
var event = require('../events');

var Message = React.createClass({
  getInitialState: function() {
    return {
      message: ''
    };
  },
  handleNewMessage: function(event) {
    var that= this;
    
    this.setState({
      message: event.message
    });
    
    setTimeout(function() {
      that.setState({
        message: ''
      });
    }, event.duration);
    
  },
  componentDidMount: function() {
    event.on('show_message', this.handleNewMessage);
  },
  componentWillUnmount: function() {
    event.off('show_message', this.handleNewMessage);
  },
  render: function() {
    var message = this.state.message;
    
    return (
      message ? <div className="top-message">{message}</div> : null
    );
  }
});

module.exports = Message;