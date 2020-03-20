import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
//import Image from "../components/image"
import SEO from "../components/seo"
import './index.css';
import fetch from 'node-fetch';

const RestrauntList = ({ restaurants, onClickHandler, favs }) => {
  return (
    restaurants ? <div className="restaurant-list">
      {restaurants.map(({restaurant}) => (
        <div className="restaurant-container" key={`restaurant${restaurant.id}`}>
          <span className="user-rating">{restaurant.user_rating.aggregate_rating}</span>
          <Link to={`/restaurant/?id=${restaurant.id}`}>
            <img src={restaurant.thumb} />
          </Link>
          <p>
            {restaurant.name}
            <i 
              onClick={() => onClickHandler(restaurant.id)} 
              className={`fa fa-heart ${favs.indexOf(restaurant.id) > -1 ? 'selected' : ''}`}
            ></i>
          </p>
        </div>
      ))}
    </div> : null
  )
}


class IndexPage extends React.Component{
  constructor() {
    super();

    this.state = {
      //restaurants: restaurantsData.restaurants,
      restaurants: null,
      location: '',
      favs: []
    };
  }


  setOnChange(evt){
    this.setState({
      location: evt.target.value
    });

  }

  getLocdata(location){
  
    fetch(`https://us1.locationiq.com/v1/search.php?key=1025bc1daf5454&q=${location}&format=json`,
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
      'user-key': "1ad408702fb95fe8c982b8f28cc9484b"
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

    this.getLocdata(this.state.location);
  }

  addToFavs(res_id) {
    const resIndex = this.state.favs.indexOf(res_id);
    let favs = [];

    if (resIndex > -1) {
      this.state.favs.splice(resIndex, 1);

      favs = [...this.state.favs];

      console.log(favs)
    } else {
      favs = [...this.state.favs, res_id]
    }

    this.setState({
      favs: favs
    });
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
            <input placeholder="Enter the location" onChange={(evt) => this.setOnChange(evt)}/>
            <button onClick={(evt) => this.handleOnClick(evt)}>Search</button>
          </div>
          <br></br>
          <br></br>
          {/* {console.log(this.state)} */}
      { this.state.restaurants
          ? <RestrauntList onClickHandler={(id) => this.addToFavs(id)} restaurants={this.state.restaurants} favs={this.state.favs} />
          : null
        }
        { this.state.loading && <div className="loading">
            <img src="https://icon-library.net//images/gif-loading-icon/gif-loading-icon-17.jpg" />
          </div>
        }
      
          </Layout>
  )
  }
}

export default IndexPage
