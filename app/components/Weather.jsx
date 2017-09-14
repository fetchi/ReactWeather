var React = require('react');
var WeatherForm = require('WeatherForm');
var WeatherMessage = require('WeatherMessage');
var openWeatherMap = require('openWeatherMap');
var ErrorModal = require('ErrorModal');

var Weather = React.createClass({
  getInitialState: function () {
    return {
      isloading: false

    }
  },
  handleSearch: function (location) {
    var that = this;

   //debugger;
    this.setState({
      isloading: true, 
      errorMessage: undefined,
      location: undefined,
      temp: undefined
    });

    openWeatherMap.getTemp(location).then(function (temp) {
      that.setState({
        location: location,
        temp: temp,
        isloading: false
      });
    }, function (e) {
        that.setState({
          isloading:false,
          errorMessage: e.message
        });
       

    });
  },
  componentDidMount: function(){
    var location = this.props.location.query.location;
    if(location && location.length > 0){
      this.handleSearch(location); 
      window.location.hash = '#/';
    }
  },
  componentWillReceiveProps:function(newProps){
    var location = newProps.location.query.location;
    if(location && location.length > 0){
      this.handleSearch(location); 
      window.location.hash = '#/';
    }
  },
  render: function () {
    var {temp, location, isloading, errorMessage} = this.state;

    function renderMessage(){
        if (isloading){
            return <h3 className="text-center">Fetching weather...</h3>
        }else if (temp && location){
            return <WeatherMessage temp={temp} location={location}/>
        }
    }

    function renderError(){
      if(typeof errorMessage === 'string'){
        return (
            <ErrorModal message={errorMessage}/>
          )
      }
    }

    return (
      <div>
        <h2 className="text-center page-title">Get Weather</h2>
        <WeatherForm onSearch={this.handleSearch}/>
        {renderMessage()}
        {renderError()}
      </div>
    )
  }
});

module.exports = Weather;
