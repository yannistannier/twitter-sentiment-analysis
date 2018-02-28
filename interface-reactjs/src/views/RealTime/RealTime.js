import React, { Component } from 'react';
import {HorizontalBar, Line, Pie, Bar} from 'react-chartjs-2';
import {
  Badge,
  Row,
  Col,
  Progress,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Button,
  ListGroupItem,
  Label,
  Input,
  Table
} from 'reactstrap';
import { ClipLoader } from 'react-spinners';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import axios from 'axios'

import AWSIoTData from 'aws-iot-device-sdk';


class RealTime extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      now : null,
      trend:[],
      load:false,
      filter:"Trump",
      result:null,
      analysing:false,
      emotion:[],
      sentiment:[],
      tweets : 0,
      retweets:0,
      hashtags:{},
      list_hash:[],
      emotion_total:[0,0,0,0,0]
    };
    this.mqttClient=null
    this.messages=[]
  }

  reset(){
    this.setState({now : null,
      load:false,
      result:null,
      analysing:false,
      emotion:[],
      sentiment:[],
      tweets : 0,
      retweets:0,
      hashtags:{},
      list_hash:[],
      emotion_total:[0,0,0,0,0]})
  }

  componentDidMount() {
     this.getTrend()
     this.mqttClient = AWSIoTData.device({
       region: "eu-west-1",
       host:"xxxxxxxxxxx.iot.eu-west-1.amazonaws.com",
       clientId: "10",
       protocol: 'wss',
       maximumReconnectTimeMs: 8000,
       debug: true,
       accessKeyId: 'xxxxxxxxxxx',
       secretKey: 'xxxxxxxxxxx',
    })

    this.mqttClient.on('connect', function() {
        this.mqttClient.publish('stream', JSON.stringify({ action: "STOP"}));
        this.mqttClient.subscribe('resultat');
        console.log('ok')
      }.bind(this));

    this.mqttClient
      .on('message', function(topic, payload) {
        // console.log('message', topic, payload.toString());
        var item = JSON.parse(payload.toString())
        // console.log(item)
        this.setState({
          emotion_total:[
            this.state.emotion_total[0]+item.emotions.joy,
            this.state.emotion_total[1]+item.emotions.fear,
            this.state.emotion_total[2]+item.emotions.anger,
            this.state.emotion_total[3]+item.emotions.surprise,
            this.state.emotion_total[4]+item.emotions.sadness,
          ],
          emotion:[
            ( item.emotions.joy / item.total ) * 100,
            ( item.emotions.fear / item.total ) * 100,
            ( item.emotions.anger / item.total ) * 100,
            ( item.emotions.surprise / item.total ) * 100,
            ( item.emotions.sadness / item.total ) * 100,
          ],
          sentiment:[
            ( item.sentiments.positive / item.total ) * 100,
            ( item.sentiments.neutral / item.total ) * 100,
            ( item.sentiments.negative / item.total ) * 100
          ],
          tweets: this.state.tweets + item.total,
          retweets: this.state.retweets + item.retweet,
        })
        var hs = this.state.hashtags
        for (const [key, value] of Object.entries(item.hashtags)) {

          if (key in hs) {
              hs[key] = hs[key] + value;
          }else{
            hs[key] = value;
          }
        }
        
        var listhash = Object.keys(hs).map(function(key) {
            return [key, hs[key]];
        });

        // Sort the array based on the second element
        listhash.sort(function(first, second) {
            return second[1] - first[1];
        });
        this.setState({hashtags:this.state.hashtags, list_hash:listhash.slice(0,7)})

        for (var i in item.messages) {
          this.messages.unshift({text:item.messages[i]})
        }

      }.bind(this));
  }

  getTrend(){
    axios.get('https://xxxxxxxxx.execute-api.eu-west-1.amazonaws.com/twitter/trend')
      .catch(function(response) {
        console.log(response)
      })
      .then(function(res) {

        this.setState({trend:res.data[0].trends.slice(0,15)})

      }.bind(this));
  }

  goAnalyse(cell){
    console.log(cell)
  }

  goSearch(search=null){
      this.reset()
      this.setState({analysing:true, load:true})
      if(!search){
        search = this.state.filter 
      }
      this.mqttClient.publish('stream', JSON.stringify({ action: "GO", filter:search}));
  }

  stopSearch(){
      this.setState({load:false})
      this.mqttClient.publish('stream', JSON.stringify({ action: "STOP"}));
  }

  clickTrend(search){
      this.goSearch(search)
      this.setState({filter:search})
  }
   
  render() {
    return (
      <div className="animated fadeIn">
      	
        <Row>

          <Col xs="12" sm="12" md="12">
            <Card>
              <CardHeader >
                <div className="text-center" style={{fontSize:16}}> <b>Analyse en temps reel</b> </div>
              </CardHeader>
              <CardBody style={{fontSize:16}}>
                  <Row style={{marginBottom:0}} >
                      <Col xs="12" sm="3" md="3"> </Col>
                      <Col xs="12" sm="4" md="4">
                            <Input onChange={(e) => this.setState({filter:e.currentTarget.value})} type="text" id="cvv" placeholder="Saisir un mot clé"/>
                      </Col>
                      <Col xs="12" sm="2" md="2">
                          {this.state.load && 
                              <Row>
                                <Col xs="12" sm="12" md="12" className="container justify-content-md-center text-center">
                                  <Button width="150" outline block active type="submit" onClick={() => this.stopSearch() }>
                                      <i className="fa fa-dot-circle-o"></i> Stop
                                    </Button>
                                </Col>
                              </Row>
                            ||
                            <Button outline block active type="submit" color="success" onClick={() => this.goSearch() }>
                              <i className="fa fa-dot-circle-o"></i> Analyse
                            </Button>
                          }
                      </Col>
                      <Col xs="12" sm="3" md="3"> </Col>
                    </Row>

                    <hr />

                    <Row style={{marginBottom:0}} >
                      <Col xs="12" sm="12" md="12"> 
                          <div className="text-center" style={{fontSize:15}}> <b>Tendances du moment</b> </div>
                      </Col>
                      <Col xs="12" sm="12" md="12" className="text-center"> 
                          {this.state.trend.map((item, index) => (
                              <span key={index} onClick={() => this.clickTrend(item.name) } style={{color:'#1DA1F2', fontWeight:'bold', fontSize:14, cursor:"pointer"}}> &nbsp; &nbsp;{item.name} &nbsp; &nbsp;</span> 
                          ))}
                      </Col>
                    </Row>
                    
              </CardBody>
            </Card>

            <Card>
              <CardBody style={{fontSize:16}}>
                 {this.state.load && 
                  <Row>
                    <Col xs="12" sm="12" md="12" className="container justify-content-md-center text-center">
                      <div style={{display: 'flex', justifyContent: 'center', paddingTop:10}}>
                        <ClipLoader
                          color={'#0056FF'} 
                          loading={true} 
                          size={30}
                        />
                      </div>
                    </Col>
                  </Row>
                } 
                
                {this.state.analysing && 
                  <div>
                  <Row>
                    <Col xs="12" sm="12" md="12" style={{paddingBottom:10, paddingTop:20}}>
                         <div className="text-center" style={{ fontSize:18 }}><b> {this.state.filter} </b><br/></div>
                    </Col>
                    </Row>
                    <hr />
                    <Row style={{paddingTop:20, paddingBottom:20}}>
                      <Col xs="12" sm="6" md="6" style={{paddingBottom:10}}>  
                          <ListGroupItem>Total tweet analysée: <b>{this.state.tweets}</b> </ListGroupItem>
                      </Col>
                      <Col xs="12" sm="6" md="6" style={{paddingBottom:10}}> 
                           <ListGroupItem>Total retweets: <b>{this.state.retweets}</b></ListGroupItem>
                      </Col>
                    </Row>

                    <hr />

                    <Row>
                      <Col xs="12" sm="5" md="5">
                          <Col xs="12" sm="12" md="12">
                            <div className="text-center" style={{ fontSize:16, paddingBottom:20 }}><b>Hashtag associés</b><br/></div>
                          </Col>
                          <Table responsive>
                              <tbody>
                              {this.state.list_hash.map((item, index) => (
                                  <tr key={index}>
                                    <td style={{color:'#1DA1F2', fontWeight:'bold', fontSize:14}}>#{item[0]}</td>
                                    <td>{item[1]}</td>
                                  </tr>
                              ))}
                            </tbody>
                          </Table>
                          
                      </Col>
                      <Col xs="12" sm="7" md="7">
                          <Col xs="12" sm="12" md="12">
                            <div className="text-center" style={{ fontSize:16 }}><b>Analyse instantanné</b><br/></div>
                          </Col>
                                <Bar 
                                data={{
                                    labels: ['Joy', 'Fear', 'Anger', 'Surprise', 'Sadness'],
                                    datasets: [
                                      {
                                        label: 'Emotion',
                                         data: this.state.emotion,
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
                  </Row>

                  <hr />

                    <Row>
                      <Col xs="12" sm="12" md="12">
                            <Col xs="12" sm="12" md="12">
                                <div className="text-center" style={{ fontSize:16, paddingBottom:20 }}><b>Analyse psychologique global</b><br/></div>
                            </Col>
                        </Col>
                        <Col xs="12" sm="2" md="2"></Col>
                        <Col xs="12" sm="8" md="8">
                            <div className="chart-wrapper">
                                  <Pie data={{
                                    labels: ['Joy', 'Fear', 'Anger', 'Surprise', 'Sadness'],
                                    datasets: [{
                                      data: this.state.emotion_total,
                                      backgroundColor: [
                                        '#4fc644',
                                        '#fee400',
                                        '#ff302c',
                                        '#00d0ff',
                                        '#2774be',
                                      ]
                                    }]
                                  }}
                              />
                              </div>
                          </Col>
                          <Col xs="12" sm="2" md="2"></Col>
                    </Row>

                     <hr />

                     <Row>
                       <Col xs="12" sm="12" md="12" style={{paddingTop:30}}>
                          <BootstrapTable
                            data={ this.messages }
                            pagination>
                            <TableHeaderColumn dataAlign='center' isKey={true} dataField='text'>Flux de Tweet</TableHeaderColumn>
                          </BootstrapTable>
                        </Col>
                      </Row>
                  </div>
                }

              </CardBody>
            </Card>

          </Col>
        </Row>
        

      </div>
    )
  }
}

export default RealTime;
