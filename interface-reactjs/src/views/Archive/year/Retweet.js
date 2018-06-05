import React, { Component } from 'react';
import {Badge, Row, Col, Card, CardHeader, Button, CardFooter, CardBody, Label, Input, FormGroup,
ListGroup, ListGroupItem, Nav, NavItem, NavLink, Table} from 'reactstrap';
import {HorizontalBar, Doughnut, Line, Pie, Polar, Radar} from 'react-chartjs-2';
import { BounceLoader } from 'react-spinners';
import axios from 'axios'


class Retweet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results:[],
      graph:null,
      load:false
    };
  }

  componentDidMount() {
      this.setState({ load: true });
      if(this.state.results.length == 0) {

          axios.get('https://xxxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/best-retweet?id=0')
          .catch(function(response) {
            console.log(response)
          })
          .then(function(res) {
            console.log(res.data[0])
            this.graph(res.data[0])
            this.setState({ load: false, results : res.data});

          }.bind(this));

      }
  }

  graph(item){
    var g = {
      "user" : item.retweet,
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

  maxEmotion(item){
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

  maxSentiment(item){
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

  render() {


    return (
        <Row>
          
          <Col xs="12" sm="12" md="12">

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


              {this.state.results.length > 0 && 
              <Row style={{paddingTop:30}}>
                  <Col xs="12" sm="6" md="6">
                    <div className="" style={{paddingBottom:20}}><b>Biggest trends on 2017</b><br/></div>

                    <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                      <thead className="thead-light">
                      <tr>
                        <th>Users</th>
                        <th>Retweets</th>
                        <th>Sentiment</th>
                        <th>Emotion</th>
                        <th></th>
                      </tr>
                      </thead>
                      <tbody>

                      {this.state.results.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div style={{color:'#1DA1F2', fontWeight:'bold', fontSize:14}}><a href={"#/archive/user/" + item.retweet}>{item.retweet}</a></div>
                          </td>
                          <td >
                            {item.total}
                          </td>
                          <td>
                            <div className="clearfix">
                              {this.maxEmotion(item)}
                            </div>
                          </td>
                          <td>
                            <div className="clearfix">
                              {this.maxSentiment(item)}
                            </div>
                          </td>
                          <td>
                            <div className="clearfix">
                              <Button onClick={() => this.graph(item)} color="primary" size="sm"><i className="fa fa-arrow-right"></i></Button>
                            </div>
                          </td>
                        </tr>
                      ))}


                      </tbody>
                    </Table>
                  </Col>


                  <Col xs="12" sm="6" md="6">
                      {this.state.graph && 
                      <div className="text-center" style={{fontWeight:'bold', paddingTop:20}}>Plot for <b><span style={{color:'#1DA1F2'}}>{this.state.graph["user"]}</span></b><br/></div>
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
              
          </Col>
        </Row>
    )
  }

}

export default Retweet;