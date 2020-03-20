import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
//import Image from "../components/image"
import SEO from "../components/seo"
import './index.css';
import fetch from 'node-fetch';


class IndexPage extends React.Component{
  setLocationNameOnChange(evt){
    this.setState({
      locationName: evt.target.value
    });

  }

  getLatLong(locationName){
  
    fetch(`https://us1.locationiq.com/v1/search.php?key=93413dd7e03322&q=${locationName}&format=json`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      this.setState({
        location: {
          lat: data[0].lat,
          lon: data[0].lon
        }
      })
      this.getRestaurantData(data[0].lat, data[0].lon);
    });
  }

  getRestaurantData(Lat,Long){
    try{
      fetch(`https://developers.zomato.com/api/v2.1/search?lat=${Lat}&lon=${Long}&entity_type=landmark&radius=100`,
    {
     method: "GET",
     headers:{
      'accept': 'application/json',
      'user-key': "402f8842a1e6605bdc5f03d9d9c202db"
     } 
    })
    .then(res => res.json())
      .then(data =>{
        //console.log(data.restaurants)
        this.setState({
          restaurants: data.restaurants
        });
        
      })
      
  
    }
    catch(e){
      console.log(e);
    }
  }

  handleOnClick(){
    // console.log(this.state.locationName);
    this.getLatLong(this.state.locationName);
  }

  render (){
    return (
      <Layout>
      <SEO title="Home" />
      {/* <h1>My Gatsby Site</h1> */}
      {/* <p>Welcome to your new Gatsby site.</p> */}
      {/* <p>Now go build something great.</p> */}
      {/* <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div> */}
      <div className="location-search">
            <input placeholder="Enter the location" onChange={(evt) => this.setLocationNameOnChange(evt)}/>
            <button onClick={(evt) => this.handleOnClick(evt)}>Search</button>
          </div>
          <br></br>
          <br></br>
      
          </Layout>
  )
  }
}

export default IndexPage
