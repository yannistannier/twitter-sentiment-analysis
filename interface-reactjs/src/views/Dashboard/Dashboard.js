import React, { Component } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import {
  Badge,
  Row,
  Col,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Button,
  ButtonToolbar,
  ButtonGroup,
  ButtonDropdown,
  Label,
  Input,
  Table
} from 'reactstrap';


class Dashboard extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      radioSelected: 2
    };
  }

   
  render() {
    return (
      <div className="animated fadeIn">
      	
        <Row>
          <Col xs="12" sm="12" md="12">
            <Card>
              <CardHeader >
                <div className="text-center" style={{fontSize:24}}><b>A Real Time Stream and Big Data Project – Experimental Sentiment Analysis on Twitter</b> </div>
              </CardHeader>
              <CardBody style={{fontSize:16}}>
                <div className="text-center">Welcome on the web-based interface for the DataBase Project at Paris-Descartes</div>
                <div className="text-center"> <br/>This project is currently consisting of two sub-projects :</div>
                <div className="text-center"> - Analysis on an archive of Twitter containing tweets a sample of 6To between January and December 2017.</div>
                <div className="text-center"> - Analysis in real time trends Twitter.</div>
                
                <Row>
                  <Col xs="12" sm="6" md="6" className="text-center">
                    <div className="text-center" style={{paddingTop:40}}> <a href="#/archive">Access to the complete archive of 2017 </a> </div>
                  </Col>

                  <Col xs="12" sm="6" md="6" className="text-center">
                    <div className="text-center" style={{paddingTop:40}}> <a href="#/realtime">Access to the real-time stream analysis</a> </div>
                  </Col>

                </Row>

              </CardBody>
            </Card>

            <Card>
              <CardHeader >
                <div className="text-center" style={{fontSize:24}}> <b>Team</b> </div>
              </CardHeader>
              <CardBody>
                <Row style={{paddingTop:20}}>
                    <Col xs="12" sm="3" md="3" style={{paddingBottom:10}} className="text-center">
                      <img style={{maxWidth:150}} src="https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/15442141_10211263213879918_5475885353763559368_n.jpg?oh=28b7469a8b749398346cdb34231651d4&oe=5B087792" className="img-avatar" />
                      <div style={{paddingTop:20, fontSize:20, color:"black", fontWeight:"bold"}}>Tannier Yannis</div>
                      <div style={{paddingTop:5, fontSize:18, color:"grey"}}>DevOps & Technical Evangelist</div>
                    </Col>

                    <Col xs="12" sm="3" md="3" style={{paddingBottom:10}} className="text-center">
                      <img style={{maxWidth:150}} src="https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/20707990_10213848869726749_5391777343957258299_n.jpg?oh=36da986b8cd6586ecfdad4215ef612ca&oe=5B0FCE76" className="img-avatar" />
                      <div style={{paddingTop:20, fontSize:20, color:"black", fontWeight:"bold"}}>Mohamed Ben Hamdoune</div>
                      <div style={{paddingTop:5, fontSize:18, color:"grey" }}>Linuxien, Expert Bash, Mec trop balaise WESH</div>
                    </Col>

                    <Col xs="12" sm="3" md="3" style={{paddingBottom:10}} className="text-center">
                      <img style={{maxWidth:150}} src="https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/26167425_1999443233405843_2095566501425035776_n.jpg?oh=286be05eb7ac61c9e168fd0e6e14b139&oe=5B0A00AE" className="img-avatar" />
                      <div style={{paddingTop:20, fontSize:20, color:"black", fontWeight:"bold"}}>Vima Haddad</div>
                      <div style={{paddingTop:5, fontSize:18, color:"grey" }}>Dev</div>
                    </Col>

                    <Col xs="12" sm="3" md="3" style={{paddingBottom:10}} className="text-center">
                      <img style={{maxWidth:150}} src="https://scontent-cdt1-1.xx.fbcdn.net/v/t31.0-1/p960x960/19983445_1922788397998264_5269582026849858177_o.jpg?oh=11e1f85d3651cee8fbc9a86e31547b76&oe=5B078951" className="img-avatar" />
                      <div style={{paddingTop:20, fontSize:20, color:"black", fontWeight:"bold"}}>Rihab Bédoui</div>
                      <div style={{paddingTop:5, fontSize:18, color:"grey" }}>Dev</div>
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

export default Dashboard;
