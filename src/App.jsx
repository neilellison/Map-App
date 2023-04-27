import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  state = {
    lat: null,
    lng: null,
    breweries: [],
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const address = event.target.elements.address.value;

    try {
      const { lat, lng } = await getLatLngFromAddress(address);
      const breweries = await getBreweries(lat, lng);
      const nearestBreweries = findNearestBreweries(breweries, lat, lng);
      this.setState({ lat, lng, breweries: nearestBreweries });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { lat, lng, breweries } = this.state;

    return (
      <div className="App">
        <div className="container">
          <div className="card">
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <label htmlFor="address">Enter your address:</label>
                <div className="mb-3">
                  <input type="text" name="address" className="form-control" id="address" placeholder="123 rd..." />
                </div>
                <button type="submit" className="btn btn-outline-dark">
                  Find closest locations
                </button>
              </form>
              {lat && lng && <Map lat={lat} lng={lng} breweries={breweries} />}
              {breweries.length > 0 && <Breweries breweries={breweries} />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const getLatLngFromAddress = async (address) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    }`
  );
  const data = await response.json();
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
};

const getBreweries = async (lat, lng) => {
  const breweries = [];

  const csv = require("csv-parse");
  const fs = require("fs");

  fs.createReadStream("breweries.csv")
    .pipe(
      csv({
        columns: true,
      })
    )
    .on("data", async (row) => {
      const breweryAddress = `${row.address}, ${row.city}, ${row.state} ${row.zip}`;

      const { lat, lng } = await getLatLngFromAddress(breweryAddress);

      breweries.push({ ...row, latitude: lat, longitude: lng });
    })
    .on("end", () => {
      console.log(`Found ${breweries.length} breweries`);
    });

  return breweries;
};

export default App;
