var React = require('react');

var event = require('../events');

var InvalidPcMessage = React.createClass({
  getInitialState: function() {
    return {
      message: ''
    };
  },
  handleInvalidPCMessage: function(event) {
      var that= this;
      
    this.setState({
      message: event.message
    });
    
    setTimeout(function() {
      that.setState({
        message: ''
      });
    }, event.duration)
    
  },
  componentDidMount: function() {
    
    event.on('show_message', this.handleInvalidPCMessage);
  },
  componentWillUnmount: function() {
    event.off('show_message', this.handleInvalidPCMessage);
  },
  render: function() {
    
    var message = this.state.message;
    
    return (
      message ? <div className="top-message">{message}</div> : null
    );
  }
});

module.exports = InvalidPcMessage;