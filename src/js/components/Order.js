var React = require('react');
// link to data module that's storing the inputted info
var data = require('../data');

var Order = React.createClass({
  getInitialState: function() {
    // get initial empty state or retrive from data storage object
    var customer = data.getData('customer') || {};
    return {
      customer: {
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        street: customer.street || '',
        city: customer.city || '',
        province: customer.province || '',
        postalcode: customer.postalcode || ''
      },
      isDisabled: true
     };
  },
  componentDidMount: function() {
    // check if any customer data already exists, such as in the case of returning to the order page, and if so (i.e. all the fields are already complete) enable the button
    if (data.getData('customer')) {
      this.setState({
        isDisabled: false
      });
    }
  },
  onChange: function(value, e) {
    var newCustomer = this.state.customer;
    newCustomer[value] = e.target.value;
    this.setState({customer: newCustomer});
    this.checkData();
  },
  continueOrder: function() {
    data.setData('customer', this.state.customer);
    // this way of programmatically navigating is deprecated. it still works in the current react-router version but will become unavailable soon
    this.props.history.push('/choose');
  },
  checkData: function() {
    var checked = 0;
    
    for(var prop in this.state.customer){
      if(this.state.customer.hasOwnProperty(prop)){
        if(this.state.customer[prop].length > 0){
          checked = checked + 1;
        } else if(this.state.customer[prop].length === 0 && checked != 0) {
          checked = checked - 1;
        }
      }
    }
    if(checked === 7){
      this.setState({isDisabled: false});
    } else {
      this.setState({isDisabled: true});
    }
  },
  render: function() {
    return (
      <div className="main orderPage">
        <h1 className="pageTitle">Please enter your contact details</h1>
        <form className="alignCenter" method="post">
          <input type="text" name="name" placeholder="name" value={this.state.customer.name} onChange={this.onChange.bind(this, 'name')}/>
          <input type="email" name="email" placeholder="email address" value={this.state.customer.email} onChange={this.onChange.bind(this, 'email')}/>
          <input type="tel" name="phone" placeholder="phone number" value={this.state.customer.phone} onChange={this.onChange.bind(this, 'phone')}/>
          <input type="text" name="street" placeholder="street address" value={this.state.customer.street} onChange={this.onChange.bind(this, 'street')}/>
          <input type="text" name="city" placeholder="city" value={this.state.customer.city} onChange={this.onChange.bind(this, 'city')}/>
          <input type="text" name="province" placeholder="province" value={this.state.customer.province} onChange={this.onChange.bind(this, 'province')}/>
          <input type="text" name="postalcode" placeholder="postal code" value={this.state.customer.postalcode} onChange={this.onChange.bind(this, 'postalcode')}/>
          <button onClick={this.continueOrder} type="button" disabled={this.state.isDisabled}>Continue order</button>
        </form>
      </div>
    );
  }
});

module.exports = Order;