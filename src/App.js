import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js';

class App extends Component {
  constructor() {
    super();
    this.state = {
      // currentItem: '',
      // username: '',
      travelreason: '',
      location: '',
      year: '',
      entry: '',
      items: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      travelreason: this.state.travelreason,
      location: this.state.location,
      year: this.state.year,
      entry: this.state.entry
    }
    itemsRef.push(item);
    this.setState({
      // currentItem: '',
      // username: '',
      travelreason: '',
      location: '',
      year: '',
      entry: ''
    });
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          travelreason: items[item].travelreason,
          location: items[item].location,
          year: items[item].year,
          entry: items[item].entry,
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='app' >
        <header>
            <div className="wrapper">
              <h1>Travel Journal</h1>

            </div>
        </header>
        <div className='container'>
          <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="travelreason" placeholder="Travel Reason" onChange={this.handleChange} value={this.state.travelreason} />
                  <input type="text" name="location" placeholder="Location" onChange={this.handleChange} value={this.state.location} />
                  <input type="text" name="year" placeholder="Year Traveled" onChange={this.handleChange} value={this.state.year} />
                  <input type="text" name="entry" placeholder="Journal Entry" onChange={this.handleChange} value={this.state.entry} />
                  <button>Add Item</button>
                </form>
          </section>
          <section className='display-item'>
              <div className="wrapper">
                <ul>
                  {this.state.items.map((item) => {
                    return (
                      <li key={item.id}>
                        <h3>{item.travelreason}</h3>
                        <p>location: {item.location}
                        <p>year traveled: {item.year}</p>
                        <p>journal entry: {item.entry}</p>
                          <button onClick={() => this.removeItem(item.id)}>Remove Item</button>
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </section>
        </div>
      </div>
    );
  }
}
export default App;
