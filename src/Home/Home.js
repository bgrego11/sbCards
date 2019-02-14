import React, { Component } from 'react';
import io from 'socket.io-client';
import {USER_CONNECTED, LOGOUT, CURRENTPLAYS} from '../Events';
// import Sidebar from './Sidebar'
import './Home.css';
import Game from '../Game/Game';
import axios from 'axios'


const socketUrl = "/home"

class Home extends Component {
  
    constructor(props) {
      super(props);
    
      this.state = {
                socket: null, 
                user: null,
                allPlayers: [{
                  name: "buddy",
                  id: "noid",
                  picture: "https://accounts.google.com/SignOutOptions?hl=en&continue=https://www.google.com/_/chrome/newtab%3Fei%3DTzxeXM25L7Kt_Qanya_wCQ%26rlz%3D1C1JZAP_enUS715US715"
                }],
                profile: "hello"
      };
      }
  

      componentWillMount() {
        const socket = io()
  
//         const addUserName = async () => { const res = await axios.get('wild-rice-5480.auth0.com', { headers: {"Authorization" : `Bearer ${localStorage.access_token}`}})
//         return await res.data;
// }
    
    
    socket.on("connect", () => {
      console.log(socket.id)
      // addUserName().then(name => {
        let plays = {
          name: "buddy",
          id: socket.id,
          picture: "https://accounts.google.com/SignOutOptions?hl=en&continue=https://www.google.com/_/chrome/newtab%3Fei%3DTzxeXM25L7Kt_Qanya_wCQ%26rlz%3D1C1JZAP_enUS715US715"
        }
          this.setState({
            profile: "buddy"
          })           

socket.emit(CURRENTPLAYS, plays)
      // })
      
    })

    socket.on("disconnect", () => {
     let removeUserArr = this.state.allPlayers
      for(let i=0; i < removeUserArr.length; i++) {
        if (removeUserArr[i].id === socket.id) {
          removeUserArr.splice(i,1)
        }
      }
      this.setState({
        allPlayers: removeUserArr
      })
      
    })
    
        this.setState({'socket': socket
      })
      }

      componentDidMount() {
        const {socket} = this.state  
        this.setState({
         user: socket.id
       })


       socket.on(CURRENTPLAYS, (currentUsers) => {
        this.setState({
          allPlayers: currentUsers
        })
      })
      }


      
      socketUser = () => {
        axios.get('https://snydz.auth0.com/userinfo', { headers: {"Authorization" : `Bearer ${localStorage.access_token}`}})
    .then(response => this.setState({profile: response.data.name}))
    }
  
      setUser = (user) => {
          const {socket} = this.state
          socket.emit(USER_CONNECTED, user);
          this.setState({user})

  
      }

      checkstate = () => {
        console.log(this.state)
      }
  
      logout = ()=> {
          const {socket} = this.state
          socket.emit(LOGOUT)
          this.setState({user:null})
      }
  
      render() {
      const { socket } = this.state
      let { allPlayers } = this.state
      return (
        <div className="homeContainer">
              {this.state.user === null ? <div>sign in</div> : 
                  <Game socket={socket} currentUsers={allPlayers}/> 
              }
              
                  </div>
      );
    }
  }
  


export default Home;