import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(){
    super();
    this.state = {
      title : 'Simple title Contry',
      countries : []
    }
  }

  // Make Ajax Calls Here
  componentDidMount(){
    var that = this;

    console.log('componente has mounted');

    fetch('http://localhost:3000/api/countries')
      .then(function(response){
        response.json()
          .then(function(data){
            that.setState({
              countries:data
            })
          })
          .catch(function(err){
              console.log(err);
            })
      })
      .catch(function(err){
        console.log('Error Fetch : ' + err);
      })
  }


  removeCountry(id){
    var that = this;
    let countries = this.state.countries;
    let country = countries.find(function(country){
      return country.id === id
    });

    var request = new Request('http://localhost:3000/api/remove/' + id, {
    method: 'DELETE'
    });

      fetch(request)
      .then(function(response) {
        countries.splice(countries.indexOf(country),1);
        that.setState({
          countries : countries
        })
        response.json()
          .then(function(data){
            console.log(data);
          })
      })
      .catch(function(err){
          console.log( 'Fetch Error :-S removeCountry ', err);
        });
      console.log(country);
  }


  addCountry(event){
    var that = this;

    event.preventDefault();

    let country_data = {
      country_name : this.refs.country_name.value,
      continent_name : this.refs.continent_name.value,
      id : Math.random().toFixed(3)
    };

    var request = new Request('http://localhost:3000/api/new-country', {
      method: 'POST',
      headers: new  Headers({'Content-Type':'application/json'}),
      body: JSON.stringify(country_data)
    });

    // xmlHttpRequest()
    fetch(request)
      .then(function(response){
        let countries = that.state.countries;

        countries.push(country_data);

        that.setState({
              countries: countries
        })
        response.json()
          .then(function(data){
            })
          })
      .catch(function(err){
        console.log( 'Fetch Error addCountry :-S', err);
      })
  }

  render() {
    let title = this.state.title;
    let countries = this.state.countries;

    return (
      <div className="App">
        <div className="container">

          <div className="row">
            <h1>{title}</h1>
            <form className="countryForm">
              <input type="text" ref="country_name" placeholder="country_name"></input>
              <input type="text" ref="continent_name" placeholder="continent_name"></input>
              <button onClick={this.addCountry.bind(this)}>Add Country</button>
              {/* <pre>{JSON.stringify(countries)}</pre> */}
            </form>

            <ul>
              {countries.map(country => <li key={country.id}> {country.country_name} {country.continent_name}
                <button onClick={this.removeCountry.bind(this, country.id)}>Remove</button> </li>)}

            </ul>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
