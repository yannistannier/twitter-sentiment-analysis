import React, { Component } from 'react';
import {Badge, Row, Col, Card, CardHeader, Button, CardFooter, CardBody, Label, Input, FormGroup,
ListGroup, ListGroupItem, Nav, NavItem, NavLink, Table} from 'reactstrap';
import {Bar, Doughnut, Line, Pie, Polar, Radar, HorizontalBar} from 'react-chartjs-2';
import { BounceLoader, BarLoader } from 'react-spinners';
import axios from 'axios'

import Hashtag from "./year/Hashtag";
import User from "./year/User";
import Retweet from "./year/Retweet";


class Archive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page:0,
      emotion_month : [],
      sentiment_month: [],
      emotion_hour: [],
      sentiment_hour:[]
    };
  }

  componentDidMount() {
      axios.get('https://xxxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/year?id=0')
      .catch(function(response) {
        console.log(response)
        
      })
      .then(function(res) {
        
        var emo = {
          "joy" : [],
          "fear" : [],
          "anger" : [],
          "surprise" : [],
          "sadness" : [],
        }
        var sent = {
          "positive" : [],
          "neutral" : [],
          "negative" : [],
        }

        res.data.month.map(function(item) {
          emo["joy"][item.id-1] = ( item.joy / item.total ) * 100
          emo["fear"][item.id-1] = ( item.fear / item.total ) * 100
          emo["anger"][item.id-1] = ( item.anger / item.total ) * 100
          emo["surprise"][item.id-1] = ( item.surprise / item.total ) * 100
          emo["sadness"][item.id-1] = ( item.sadness / item.total ) * 100

          sent["positive"][item.id-1] = ( item.positive / item.total ) * 100
          sent["neutral"][item.id-1] = ( item.neutral / item.total ) * 100
          sent["negative"][item.id-1] = ( item.negative / item.total ) * 100
        });

        var month = [{
            label: 'Joy',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#5bc21e',
            borderColor: '#5bc21e',
            data: emo["joy"]
          },
          {
            label: 'Fear',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#c03bbe',
            borderColor: '#c03bbe',
            data: emo["fear"]
          },
          {
            label: 'Anger',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#ff2400',
            borderColor: '#ff2400',
            data: emo["anger"]
          },
          {
            label: 'surprise',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#ffd751',
            borderColor: '#ffd751',
            data: emo["surprise"]
          },
          {
            label: 'sadness',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#0277bd',
            borderColor: '#0277bd',
            data: emo["sadness"]
          }]

        var sentiment_month = [
          {
            label: 'Positive',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#5bc21e',
            borderColor: '#5bc21e',
            data: sent["positive"]
          },
          {
            label: 'Neutral',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#c5c5c5',
            borderColor: '#c5c5c5',
            data: sent["neutral"]
          },
          {
            label: 'Negative',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#9e1901',
            borderColor: '#9e1901',
            data: sent["negative"]
          }
        ]

          this.setState({emotion_month:month, sentiment_month:sentiment_month})

          emo = {
            "joy" : [],
            "fear" : [],
            "anger" : [],
            "surprise" : [],
            "sadness" : [],
          }
          sent = {
            "positive" : [],
            "neutral" : [],
            "negative" : [],
          }
          res.data.hour.map(function(item) {
            emo["joy"][item.id] = ( item.joy / item.total ) * 100
            emo["fear"][item.id] = ( item.fear / item.total ) * 100
            emo["anger"][item.id] = ( item.anger / item.total ) * 100
            emo["surprise"][item.id] = ( item.surprise / item.total ) * 100
            emo["sadness"][item.id] = ( item.sadness / item.total ) * 100
            sent["positive"][item.id-1] = ( item.positive / item.total ) * 100
            sent["neutral"][item.id-1] = ( item.neutral / item.total ) * 100
            sent["negative"][item.id-1] = ( item.negative / item.total ) * 100
          });

          month[0]["data"] = emo["joy"]
          month[1]["data"] = emo["fear"]
          month[2]["data"] = emo["anger"]
          month[3]["data"] = emo["surprise"]
          month[4]["data"] = emo["sadness"]
          sentiment_month[0]["data"] = sent["positive"]
          sentiment_month[1]["data"] = sent["neutral"]
          sentiment_month[2]["data"] = sent["negative"]
          
          this.setState({emotion_hour:month, sentiment_hour:sentiment_month})

      }.bind(this));
  }


  render() {

    return (
    	<div className="animated fadeIn">

        <Row>
          <Col xs="12" sm="2" md="2">

              <Card>
                <CardHeader className="text-center">
                  Menu
                </CardHeader>
                <CardBody>
                    <Nav vertical pills>
                      <NavItem>
                        <NavLink href="#/archive" active>Summary</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="#/archive/month">Par mois</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="#/archive/user">Par utilisateur</NavLink>
                      </NavItem>
                    </Nav>  
                </CardBody>
              </Card>
          </Col>
          <Col xs="12" sm="10" md="10">
              
            <Card>
              <CardHeader className="text-center">
                <span style={{fontWeight:'bold',fontSize:20}}>Sentiment Analysis - Full Archive 2017</span>
              </CardHeader>
              <CardBody>
                  <Row>
                      <Col xs="12" sm="12" md="12">
                        <div style={{paddingTop:20}}> L'archive tweet 2017 a été téléchargé sur <a href="https://archive.org/details/twitterstream">Archive.org</a> pour un total de <b>5,8 Terabytes</b> de données et <b>1.7 milliard</b> de tweet. </div>
                        <div> Pour des raisons techniques, l'analyse sentimental et emotionnel a été realisé que sur les tweets écrit en anglais.</div>
                        <Row style={{paddingTop:40, fontSize:14}}>
                          <Col xs="4" sm="4" md="4">
                              <div className="text-center" >Total tweets<br/><b>1,7 milliard</b></div>
                          </Col>
                          <Col xs="4" sm="4" md="4">
                              <div className="text-center">Total tweets analysés<br/><b>875 819 651</b></div>
                          </Col>
                          <Col xs="4" sm="4" md="4">
                              <div className="text-center">Total hashtags<br/><b>9 385 952</b></div>
                          </Col>
                        </Row>
                      </Col>
                  </Row>

                  <Row style={{paddingTop:40}}>
                      <Col xs="12" sm="6" md="6">
                        <div className="text-center"><b>Analyse Emotionnel suivant les mois</b><br/></div>
                        <div className="chart-wrapper">
                          <Line data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            datasets: this.state.emotion_month
                          }}
                          />
                        </div>

                        <div className="chart-wrapper">
                          <Line data={{
                            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            datasets: this.state.sentiment_month
                          }}
                          />
                        </div>

                      </Col>
                      <Col xs="12" sm="6" md="6">
                        <div className="text-center"><b>Analyse Emotionnel suivant le moment de la journée</b><br/></div>
                        <div className="chart-wrapper">
                          <Line data={{
                                labels: ['Minuit', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', 'Midi', '13h', '14h' ,'15h' ,'16h', '17h' ,'18h' ,'19h', '20h', '21h', '22h', '23h'],
                                datasets : this.state.emotion_hour
                              }}
                          />
                        </div>
                        <div className="chart-wrapper">
                          <Line data={{
                                labels: ['Minuit', '1h', '2h', '3h', '4h', '5h', '6h', '7h', '8h', '9h', '10h', '11h', 'Midi', '13h', '14h' ,'15h' ,'16h', '17h' ,'18h' ,'19h', '20h', '21h', '22h', '23h'],
                                datasets : this.state.sentiment_hour
                              }}
                          />
                        </div>
                      </Col>
                  </Row>

                  

                  <Nav tabs style={{marginTop:50}}>
                    <NavItem>
                      <NavLink onClick={() => this.setState({page:0})} href="#" active={this.state.page == 0 && true || false}>Tendances hashtag 2017</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink onClick={() => this.setState({page:1})} href="#" active={this.state.page == 1 && true || false}>Les plus gros tweeters 2017</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink onClick={() => this.setState({page:2})} href="#" active={this.state.page == 2 && true || false}>Les plus retweeter 2017</NavLink>
                    </NavItem>
                </Nav>
                  {this.state.page == 0 &&
                    <Hashtag/> 
                  }

                  {this.state.page == 1 &&
                    <User/> 
                  }

                  {this.state.page == 2 &&
                    <Retweet/> 
                  }

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}

export default Archive;