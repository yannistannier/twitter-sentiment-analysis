import React, { Component } from 'react';
import {Badge, Row, Col, Card, CardHeader, Button, CardFooter, CardBody, Label, Input, FormGroup,
ListGroup, ListGroupItem, Nav, NavItem, NavLink, Table} from 'reactstrap';
import {Bar, Doughnut, Line, Pie, Polar, Radar, HorizontalBar} from 'react-chartjs-2';
import { BounceLoader, BarLoader } from 'react-spinners';
import axios from 'axios'

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


class ArchiveUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "FoxNews",
      load:false,
      fetched:0,
      profil:null,

      month:[],
      sentiment:[],
      emotion:[],
      hashtags:[],

      graph:null,
      tweets:null,
      retweets:null

    };
  } 

  componentDidMount() {
    if(this.props.match.params.id){
      this.search(this.props.match.params.id)
    }else{
      this.search()
    }
  }

  search(username=null){
      if(!username){
        username = this.state.username
      }
      this.getStat(username)
      this.getUser(username)
  }

  goExemple(example){
    this.search(example)
  
  }

  getStat(username){
    this.setState({load:true, fetched:0})
    axios.get('https://xxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/user-stat?id='+username)
    .catch(function(response) {
      // console.log(response)
    })
    .then(function(res) {
      var fetched = 2
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
      var month = []

      res.data.stat.map(function(item) {
        emo["joy"].push( ( item.joy / item.total ) * 100 )
        emo["fear"].push( ( item.fear / item.total ) * 100 )
        emo["anger"].push( ( item.anger / item.total ) * 100 )
        emo["surprise"].push( ( item.surprise / item.total ) * 100 )
        emo["sadness"].push( ( item.sadness / item.total ) * 100 )

        sent["positive"].push( (item.positive / item.total ) * 100 )
        sent["neutral"].push( (item.neutral / item.total ) * 100 )
        sent["negative"].push( (item.negative / item.total ) * 100 )

        month.push(item.month)
        fetched = 1
      });

      var emotion_month = [{
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
          var rt = res.data.retweets ? res.data.retweets.total : 0

          this.setState({load:false, tweets:res.data.tweets, retweets:rt, hashtags: res.data.hashtags, fetched:fetched, month:month, emotion:emotion_month, sentiment:sentiment_month})

          if(res.data.hashtags.length > 0){
            this.graph(res.data.hashtags[0])
          }

    }.bind(this));
  }

  getUser(username){
    axios.get('https://xxxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/twitter?id='+username)
    .catch(function(response) {
      this.setState({ profil : null });
    }.bind(this))
    .then(function(res) {

      if(res){
        this.setState({ profil : res.data});
      }

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
                          <NavLink href="#/archive/month" >Par mois</NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink href="#/archive/user" active>Par utilisateur</NavLink>
                        </NavItem>
                      </Nav>  
                  </CardBody>
                </Card>
            </Col>

            <Col xs="12" sm="10" md="10">
                <Card>
              <CardHeader className="text-center">
                <span style={{fontWeight:'bold',fontSize:18}}>Analyse par utilisateur - 2017</span>
              </CardHeader>
              <CardBody>
    
                    <Row style={{marginBottom:0}} >
                      <Col xs="12" sm="3" md="3"> </Col>
                      <Col xs="12" sm="4" md="4">
                            <Input onChange={(e) => this.setState({username:e.currentTarget.value})} type="text" id="cvv" placeholder="Saisir un utilisateur"/>
                      </Col>
                      <Col xs="12" sm="2" md="2">
                            <Button outline block active type="submit" color="success" onClick={() => this.search() }>
                              <i className="fa fa-dot-circle-o"></i> Search
                            </Button>
                      </Col>
                      <Col xs="12" sm="3" md="3"> </Col>

                      <Col xs="12" sm="12" md="12"> 
                        <div style={{paddingTop:20}}> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("realDonaldTrump")}>realDonaldTrump</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("AppleSupport")}>AppleSupport</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("Google")}>Google</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("FoxNews")}>FoxNews</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("elonmusk")}>ElonMusk</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("AmazonHelp")}>AmazonHelp</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("ABC")}>ABC</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("PokemonGospace")}>PokemonGospace</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("NewsBossIndia")}>NewsBossIndia</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("CUBE_LiveFeed")}>CUBE_LiveFeed</span> 
                          <span style={{cursor:"pointer", color:"#20a8d8", marginLeft:10}} onClick={() => this.goExemple("TheEllenShow")}>TheEllenShow</span> 
                        </div>
                      </Col>
                    </Row>

              </CardBody>
              </Card>


                 <Card>
                    <CardHeader className="text-center">
                        <span style={{fontWeight:'bold',fontSize:18}}>Resultat</span>
                    </CardHeader>
                    <CardBody>
          
                          {this.state.profil && !this.state.load && this.state.fetched != 0 && 
                          <Row>
                              <Col xs="12" sm="12" md="12" className="container justify-content-md-center text-center">
                                  <img className="img-avatar" src={this.state.profil.image} />
                                  <div style={{paddingTop:10, fontSize:16, color:"#20a8d8"}}>{this.state.profil.name}</div>
                                  <div>@{this.state.profil.screen_name}</div>
                                  <div><small>{this.state.profil.description}</small></div>
                              </Col>
                          </Row>
                          }

                          { !this.state.profil && !this.state.load && this.state.fetched != 0 && 
                          <Row>
                              <Col xs="12" sm="12" md="12" className="container justify-content-md-center text-center">
                                  <div style={{paddingTop:10, fontSize:16, color:"#20a8d8"}}>{this.state.username}</div>
                                  <div><small style={{color:"red"}}>Compté bloqué</small></div>
                              </Col>
                          </Row>
                          }

                          <hr />

                          {this.state.load && 
                            <Row>
                              <Col xs="12" sm="12" md="12" className="container justify-content-md-center text-center">
                                <div style={{display: 'flex', justifyContent: 'center', paddingTop:50}}>
                                  <BounceLoader
                                    color={'#0056FF'} 
                                    loading={true} 
                                  />
                                </div>
                              </Col>
                            </Row>
                          }

                          {this.state.fetched == 1 && 
                              <div>
                                <Row style={{paddingTop:20, paddingBottom:20}}>
                                  <Col xs="12" sm="6" md="6" style={{paddingBottom:10}}>  
                                      <ListGroupItem>Total tweet: <b>{this.state.tweets.total}</b> </ListGroupItem>
                                  </Col>
                                  <Col xs="12" sm="6" md="6" style={{paddingBottom:10}}> 
                                       <ListGroupItem>Total retweet: <b>{this.state.retweets}</b></ListGroupItem>
                                  </Col>
                                </Row>
                                <hr />

                                <Row>

                                  <Col xs="12" sm="12" md="12" style={{paddingBottom:0}}>  
                                        <div className="text-center" style={{ fontSize:15 }}><b>Profil psychologique de l'utilisateur</b><br/></div>

                                        <Row>
                                            <Col xs="12" sm="3" md="3"> </Col>
                                            <Col xs="12" sm="6" md="6">
                                                <Bar 
                                                  data={{
                                                      labels: ['Joy', 'Fear', 'Anger', 'Surprise', 'Sadness'],
                                                      datasets: [
                                                        {
                                                          label: 'Emotion',
                                                          data: [this.state.tweets.joy, this.state.tweets.far, this.state.tweets.anger, this.state.tweets.surprise, this.state.tweets.sadness],
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
                                                />
                                            </Col>
                                            <Col xs="12" sm="3" md="3"> </Col>
                                        </Row>
                                  </Col>

                                </Row>

                                <hr />

                                <Row style={{paddingBottom:10}}>
                                  <Col xs="12" sm="12" md="12" style={{paddingBottom:10, paddingTop:20}}>
                                      <div className="text-center" style={{ fontSize:15 }}><b>Analyse Emotionnel au cours de l'année </b><br/></div>
                                  </Col>
                                  <Col xs="12" sm="6" md="6">
                                    <div className="chart-wrapper">
                                        <Line data={{
                                          labels: this.state.month,
                                          datasets: this.state.emotion
                                        }}
                                        />
                                    </div>
                                  </Col>
                                  <Col xs="12" sm="6" md="6">
                                    <div className="chart-wrapper">
                                        <Line data={{
                                          labels: this.state.month,
                                          datasets: this.state.sentiment
                                        }}
                                        />
                                    </div>
                                  </Col>
                                </Row>

                                <hr />

                                {this.state.hashtags.length > 0 && 
                                <Row>
                                    <Col xs="12" sm="12" md="12" style={{paddingBottom:10, paddingTop:20}}>
                                      <div className="text-center" style={{ fontSize:15 }}><b>Tendance de l'utilisateur</b><br/></div>
                                    </Col>
                                    <Col xs="12" sm="7" md="7" style={{paddingTop:20}}>
                                      <BootstrapTable
                                        data={ this.state.hashtags }
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
                            </div>
                          }

                        {this.state.fetched == 2 && 
                          <div className="text-center"> Aucune donnée pour cet utilisateur </div>
                        }

                    </CardBody>
                  </Card>




               </Col>
          </Row>
        
      </div>
    )
  }

}

export default ArchiveUser;
