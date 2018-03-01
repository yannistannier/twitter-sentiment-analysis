import React, { Component } from 'react';
import {Badge, Row, Col, Card, CardHeader, Button, CardFooter, CardBody, Label, Input, FormGroup,
ListGroup, ListGroupItem, Nav, NavItem, NavLink, Table} from 'reactstrap';
import {Bar, Doughnut, Line, Pie, Polar, Radar, HorizontalBar} from 'react-chartjs-2';
import { BounceLoader, BarLoader } from 'react-spinners';
import axios from 'axios'

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


class ArchiveMonth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      day:[],
      sentiment:[],
      emotion:[],
      graph:null,
      hashtag:[],
      user:[],
      retweet:[]
    };
  }

  componentDidMount() {
      this.getData(1)
  }

  getData(id){
    this.getTendance(id)
    this.getDay(id)
    this.getUser(id)
    this.getRetweete(id)
  }

  getTendance(id){
      axios.get('https://xxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/hashtag?id='+id)
      .catch(function(response) {
        console.log(response)
      })
      .then(function(res) {

        this.graph(res.data[0])
        this.setState({ load: false, hashtag : res.data});

      }.bind(this));
  }

  getUser(id){
      axios.get('https://xxxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/best-user?id='+id)
      .catch(function(response) {
        console.log(response)
      })
      .then(function(res) {
        this.setState({ user : res.data});

      }.bind(this));
  }

  getRetweete(id) {
    axios.get('https://xxxxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/best-retweet?id='+id)
    .catch(function(response) {
      console.log(response)
    })
    .then(function(res) {
      this.setState({ retweet : res.data});

    }.bind(this));
  }

  graph(item){
    var g = {
      "user" : item.hashtag,
      "sentiment" : [
        (item.positive/item.total)*100, 
        (item.neutral/item.total)*100, 
        (item.negative/item.total)*100
      ],
      "emotion" : [
        (item.joy/item.total)*100,
        (item.fear/item.total)*100,
        (item.anger/item.total)*100,
        (item.surprise/item.total)*100,
        (item.sadness/item.total)*100
      ]
    }
    this.setState({graph:g})
  }

  getDay(id){
      this.setState({page:id})
      axios.get('https://xxxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/tweet-by-month?id='+id)
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
          var day = []

          res.data.map(function(item) {
            emo["joy"][item.day-1] = ( item.joy / item.total ) * 100
            emo["fear"][item.day-1] = ( item.fear / item.total ) * 100
            emo["anger"][item.day-1] = ( item.anger / item.total ) * 100
            emo["surprise"][item.day-1] = ( item.surprise / item.total ) * 100
            emo["sadness"][item.day-1] = ( item.sadness / item.total ) * 100

            sent["positive"][item.day-1] = ( item.positive / item.total ) * 100
            sent["neutral"][item.day-1] = ( item.neutral / item.total ) * 100
            sent["negative"][item.day-1] = ( item.negative / item.total ) * 100

            day.push(item.day)
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

          this.setState({day:day, emotion:month, sentiment:sentiment_month})

      }.bind(this));

  }

  maxEmotion(cell, row){
    if(row) {
      var item = row
      var max = item.joy
      var libelle = (<div style={{color:'green'}}>Joy</div>)
      if(item.fear > max){
        max = item.fear
        libelle = (<div style={{color:'#c03bbe'}}>Fear</div>)
      }
      if(item.anger > max){
        max = item.anger
        libelle = (<div style={{color:'#ff2700'}}>Anger</div>)
      }
      if(item.surprise > max){
        max = item.surprise
        libelle = (<div style={{color:'#ffd750'}}>Surprise</div>)
      }
      if(item.sadness > max){
        max = item.sadness
        libelle = (<div style={{color:'#0477bd'}}>Sadness</div>)
      }
      return libelle
    }
  }

  maxSentiment(cell, row){
    if(row) {
      var item = row
      var max = item.positive
      var libelle = (<div style={{color:'green'}}>Positive</div>)
      if(item.neutral > max){
        max = item.neutral
        libelle = (<div style={{color:'#2c2d2d'}}>Neutral</div>)
      }
      if(item.negative > max){
        max = item.negative
        libelle = (<div style={{color:'#ff2700'}}>Negative</div>)
      }
      return libelle
    }
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
                        <NavLink href="#/archive" >Summary</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="#/archive/month" active>Monthly</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="#/archive/user">User</NavLink>
                      </NavItem>
                    </Nav>  
                </CardBody>
              </Card>
          </Col>
          <Col xs="12" sm="10" md="10">
              
            <Card>
              <CardHeader className="text-center">
                <span style={{fontWeight:'bold',fontSize:18}}>Monthly analysis about 2017</span>
              </CardHeader>
              <CardBody>
                  <div className="text-center" style={{paddingBottom:20}}>
                    {this.state.page == 1 && 
                      <Button onClick={() => this.getData(1)} color="primary">January</Button>
                    || 
                      <Button onClick={() => this.getData(1)}  outline color="primary">January</Button>
                    } &nbsp;

                    {this.state.page == 2 && 
                      <Button onClick={() => this.getData(2)}  color="primary">February</Button> 
                    || 
                      <Button onClick={() => this.getData(2)}  outline color="primary">February</Button> 
                    } &nbsp;

                    {this.state.page == 3 && 
                      <Button onClick={() => this.getData(3)}  color="primary">March</Button> 
                    || 
                      <Button onClick={() => this.getData(3)}  outline color="primary">March</Button> 
                    } &nbsp;

                    {this.state.page == 4 && 
                      <Button onClick={() => this.getData(4)}  color="primary">April</Button> 
                    || 
                      <Button onClick={() => this.getData(4)}  outline color="primary">April</Button> 
                    } &nbsp;

                    {this.state.page == 5 && 
                      <Button onClick={() => this.getData(5)}  color="primary">May</Button> 
                    || 
                      <Button onClick={() => this.getData(5)}  outline color="primary">May</Button> 
                    } &nbsp;

                    {this.state.page == 6 && 
                      <Button onClick={() => this.getData(6)}  color="primary">June</Button> 
                    || 
                      <Button onClick={() => this.getData(6)}  outline color="primary">June</Button> 
                    } &nbsp;

                    {this.state.page == 7 && 
                      <Button onClick={() => this.getData(7)}  color="primary">July</Button> 
                    || 
                      <Button onClick={() => this.getData(7)}  outline color="primary">July</Button> 
                    } &nbsp;

                    {this.state.page == 8 && 
                      <Button onClick={() => this.getData(8)}  color="primary">August</Button> 
                    || 
                      <Button onClick={() => this.getData(8)}  outline color="primary">August</Button> 
                    } &nbsp;

                    {this.state.page == 9 && 
                      <Button onClick={() => this.getData(9)}  color="primary">September</Button> 
                    || 
                      <Button onClick={() => this.getData(9)}  outline color="primary">September</Button> 
                    } &nbsp;

                    {this.state.page == 10 && 
                      <Button onClick={() => this.getData(10)}  color="primary">October</Button> 
                    || 
                      <Button onClick={() => this.getData(10)}  outline color="primary">October</Button> 
                    } &nbsp;

                    {this.state.page == 11 && 
                      <Button onClick={() => this.getData(11)}  color="primary">November</Button> 
                    || 
                      <Button onClick={() => this.getData(11)}  outline color="primary">November</Button> 
                    } &nbsp;

                    {this.state.page == 12 && 
                      <Button onClick={() => this.getData(12)}  color="primary">December</Button> 
                    || 
                      <Button onClick={() => this.getData(12)}  outline color="primary">December</Button> 
                    } &nbsp;

                  </div>

                  <hr/>
                  
                  <Row style={{paddingTop:10}}>
                      <Col xs="12" sm="12" md="12" style={{paddingBottom:10}}>
                          <div className="text-center" style={{ fontSize:16 }}><b>Sentiment analysis following days</b><br/></div>
                      </Col>
                      <Col xs="12" sm="6" md="6">
                        <div className="chart-wrapper">
                            <Line data={{
                              labels: this.state.day,
                              datasets: this.state.emotion
                            }}
                            />
                        </div>
                      </Col>
                      <Col xs="12" sm="6" md="6">
                        <div className="chart-wrapper">
                            <Line data={{
                              labels: this.state.day,
                              datasets: this.state.sentiment
                            }}
                            />
                        </div>
                      </Col>
                  </Row>

                  <hr />


                  {this.state.hashtag.length > 0 && 
                  <Row style={{paddingTop:10}}>
                      <Col xs="12" sm="12" md="12" style={{paddingBottom:20}}>
                          <div className="text-center" style={{ fontSize:16 }}><b>Trends on months</b><br/></div>
                        </Col>
                      <Col xs="12" sm="7" md="7">
                        
                        <BootstrapTable
                          data={ this.state.hashtag }
                          pagination>
                          <TableHeaderColumn width='200' dataField='hashtag' dataFormat={(row, cell) => <div style={{color:'#1DA1F2', fontWeight:'bold', fontSize:14}}>#{cell.hashtag}</div>} isKey>Hashtag</TableHeaderColumn>
                          <TableHeaderColumn dataField='total'>Nb</TableHeaderColumn>
                          <TableHeaderColumn dataFormat={this.maxSentiment}>Sentiment</TableHeaderColumn>
                          <TableHeaderColumn dataFormat={this.maxEmotion}>Emotion</TableHeaderColumn>
                          <TableHeaderColumn width='60' dataFormat={(row, cell) => (
                                  <Button onClick={() => this.graph(cell)} color="primary" size="sm">
                                      <i className="fa fa-arrow-right"></i>
                                  </Button> 
                                )
                              }>
                          </TableHeaderColumn>
                        </BootstrapTable>

                      </Col>


                      <Col xs="12" sm="5" md="5">
                          {this.state.graph && 
                          <div className="text-center" style={{fontWeight:'bold', paddingTop:10}}><b><span style={{color:'#1DA1F2'}}>#{this.state.graph["user"]}</span></b><br/></div>
                          }
                          
                          {this.state.graph && 
                          <div className="chart-wrapper" style={{paddingTop:20}}>
                              <HorizontalBar
                              data={{
                                  labels: ['Joy', 'Fear', 'Anger', 'Surprise', 'Sadness'],
                                  datasets: [
                                    {
                                      label: 'Emotion',
                                      data: this.state.graph["emotion"],
                                       backgroundColor: [
                                          '#4fc644',
                                          '#fee400',
                                          '#ff302c',
                                          '#aeda48',
                                          '#2774be',
                                      ],
                                    }
                                  ]
                                }} 

                              options={{ 
                                  pointLabels: {
                                      fontSize: 12,
                                      fontColor: '#000'
                                    },
                                }}
                            />
                            </div>
                          }
                          {this.state.graph && 
                          <div className="chart-wrapper" style={{paddingTop:20}}>
                              <Pie data={{
                                      labels: [
                                        'Positive',
                                        'Neutral',
                                        'Negative'
                                      ],
                                      datasets: [{
                                        data: this.state.graph["sentiment"],
                                        backgroundColor: [
                                          '#4dbd74',
                                          '#36A2EB',
                                          '#FF6384'
                                        ],
                                        hoverBackgroundColor: [
                                          '#4dbd74',
                                          '#36A2EB',
                                          '#FF6384'
                                        ]
                                      }]
                                    }}
                                />
                            </div>
                          }

                      </Col>
                  </Row>
              }
                

              <hr/>

              <Row>
                  <Col xs="12" sm="6" md="6">
                    <div className="text-center" style={{ fontSize:16, paddingBottom:15 }}><b>Biggest Tweeter users</b><br/></div>
                    <BootstrapTable
                      data={ this.state.user }
                      pagination>
                      <TableHeaderColumn width='200' dataField='usename' 
                            dataFormat={(row, cell) => <div style={{color:'#1DA1F2', fontWeight:'bold', fontSize:14}}><a href={"#/archive/user/" + cell.username}>{cell.username}</a></div>} isKey>
                            Utilisateur
                      </TableHeaderColumn>
                      <TableHeaderColumn dataField='total'>Tweet</TableHeaderColumn>
                      <TableHeaderColumn dataFormat={this.maxSentiment}>Sentiment</TableHeaderColumn>
                      <TableHeaderColumn dataFormat={this.maxEmotion}>Emotion</TableHeaderColumn>
                
                    </BootstrapTable>
                  </Col>

                  <Col xs="12" sm="6" md="6">
                    <div className="text-center" style={{ fontSize:16, paddingBottom:15 }}><b>Most retweeted users</b><br/></div>
                    <BootstrapTable
                      data={ this.state.retweet }
                      pagination>
                      <TableHeaderColumn width='200' dataField='usename' 
                          dataFormat={(row, cell) => <div style={{color:'#1DA1F2', fontWeight:'bold', fontSize:14}}><a href={"#/archive/user/" + cell.retweet}>{cell.retweet}</a></div>} isKey>Utilisateur</TableHeaderColumn>
                      <TableHeaderColumn dataField='total'>Retweet</TableHeaderColumn>
                      <TableHeaderColumn dataFormat={this.maxSentiment}>Sentiment</TableHeaderColumn>
                      <TableHeaderColumn dataFormat={this.maxEmotion}>Emotion</TableHeaderColumn>
                
                    </BootstrapTable>
                  </Col>
              </Row>
                  

              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}

export default ArchiveMonth;