(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{28:function(e,t,n){},43:function(e,t,n){e.exports=n(77)},7:function(e,t){e.exports={CHECK_USERNAME:"CHECK_USERNAME",USER_LOGGED_IN:"USER_LOGGED_IN",UPDATE_USER_LIST:"UPDATE_USER_LIST",USER_RECONNECTED:"USER_RECONNECTED",USER_DATA:"USER_DATA",GAME_LOG_MESSAGE:"GAME_LOG_MESSAGE"}},77:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),r=n(41),o=n.n(r),s=(n(28),n(1)),i=n(2),l=n(4),u=n(3),m=n(5),E=n(42),h=n.n(E),d=n(7),b=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).handleChange=function(e){n.setState({name:e.target.value})},n.handleSubmit=function(e){e.preventDefault(),n.props.socket.emit(d.CHECK_USERNAME,n.state.name,n.handleUsernameCheck)},n.handleUsernameCheck=function(e,t,a){t?n.setState({error:"This name is already taken."}):a?(n.setState({error:"A user with this name had disconnected. Are you trying to log back in as ".concat(e,"?")}),n.setState({logBackInAs:e})):(n.setState({error:"",logBackIn:""}),n.props.createUser(e))},n.handleLogBackIn=function(){console.log("Logging back in as ".concat(n.state.logBackInAs)),n.props.socket.emit(d.USER_RECONNECTED,n.state.logBackInAs)},n.state={name:"",error:"",logBackInAs:""},n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return c.a.createElement("div",null,c.a.createElement("form",{onSubmit:this.handleSubmit,className:"loginForm"},c.a.createElement("label",{htmlFor:"username"},"Name:",c.a.createElement("input",{type:"text",id:"username",value:this.state.username,onChange:this.handleChange})),c.a.createElement("input",{type:"submit",value:"Submit"})),c.a.createElement("div",{className:"error"},this.state.error,this.state.logBackInAs?c.a.createElement("button",{onClick:this.handleLogBackIn},"Log back in"):null))}}]),t}(c.a.Component),f=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).state={userList:[]},n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.socket;t&&t.on(d.UPDATE_USER_LIST,function(t){e.setState({userList:t})})}},{key:"render",value:function(){var e=this.state.userList;return c.a.createElement("div",null,"Players: ",e.join(", "))}}]),t}(c.a.Component),p=n(15),k=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).scrollDown=function(){var e=n.container.current;e.scrollTop=e.scrollHeight},n.container=c.a.createRef(),n.state={logMessages:[]},n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.props.socket.on(d.GAME_LOG_MESSAGE,function(t){e.setState(function(e,n){return{logMessages:[].concat(Object(p.a)(e.logMessages),[t])}})})}},{key:"componentDidUpdate",value:function(){this.scrollDown()}},{key:"render",value:function(){return c.a.createElement("div",{className:"GameLog"},c.a.createElement("h3",null,"Game Log"),c.a.createElement("div",{className:"LogMessageContainer",ref:this.container},this.state.logMessages.map(function(e,t){return c.a.createElement("div",{key:t,className:"LogMessage"},e)})))}}]),t}(c.a.Component),v=n(26),O=n(13),g=function(e){function t(){return Object(s.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e;switch(this.props.die.value){case"blank":e=c.a.createElement(O.e,null);break;case"two":e=c.a.createElement(O.d,null);break;case"four":e=c.a.createElement(O.b,null);break;case"trio":e=c.a.createElement(O.c,null);break;default:e=c.a.createElement(O.a,null)}return c.a.createElement("span",{className:"Die",style:{color:this.props.die.color}},e)}}]),t}(c.a.Component),S=function(e){function t(){var e,n;Object(s.a)(this,t);for(var a=arguments.length,c=new Array(a),r=0;r<a;r++)c[r]=arguments[r];return(n=Object(l.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(c)))).roll=function(){var e=["blank","two","two","four","four","trio"],t=e[Math.floor(Math.random()*e.length)];n.props.setDie(n.props.die,t)},n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this,t=this.props.die;return c.a.createElement("div",{className:"DieContainer"},c.a.createElement(g,{die:t}),c.a.createElement("button",{onClick:this.roll},"Roll"),c.a.createElement("button",{onClick:function(){return e.props.putBack(t)}},"Put back"))}}]),t}(c.a.Component),j="green",C="purple",D="orange",y=function(e){function t(e){var n;Object(s.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).drawDie=function(){n.state.diceInBag.length>0&&n.setState(function(e,t){var n=e.diceInBag,a=e.diceOnTable,c=n[Math.floor(Math.random()*n.length)];return{diceInBag:n.filter(function(e){return e!==c}),diceOnTable:[].concat(Object(p.a)(a),[c])}})},n.putBack=function(e){var t=Object(v.a)({},e,{value:null});n.setState(function(e,n){var a=e.diceInBag,c=e.diceOnTable;return{diceInBag:[].concat(Object(p.a)(a),[t]),diceOnTable:c.filter(function(e){return e.id!==t.id})}})},n.setDie=function(e,t){n.setState(function(n,a){var c=n.diceOnTable,r=[];return c.forEach(function(n){if(n===e){var a=Object(v.a)({},e,{value:t});r.push(a)}else r.push(n)}),{diceOnTable:r}})};var a=[];return[j,C,D].forEach(function(e){for(var t=0;t<4;t++){var c={color:e,id:n.props.username+"_"+e+t,value:null};a.push(c)}}),n.state={diceInBag:a,diceOnTable:[]},n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this,t=this.state,n=t.diceInBag,a=t.diceOnTable;return c.a.createElement("div",{className:"DiceContainer"},c.a.createElement("div",{className:"DiceInBagContainer"},c.a.createElement("p",null,"Dice in bag:"),n.map(function(e){return c.a.createElement(g,{key:e.id,die:e})})),c.a.createElement("button",{onClick:this.drawDie},"Draw"),c.a.createElement("div",{className:"DiceOnTableContainer"},c.a.createElement("p",null,"Dice on table:"),a.map(function(t){return c.a.createElement(S,{key:t.id,socket:e.props.socket,die:t,putBack:e.putBack,setDie:e.setDie})})))}}]),t}(c.a.Component),A=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(l.a)(this,Object(u.a)(t).call(this,e))).createUser=function(e){var t={name:e};n.setState({user:t}),n.state.socket.emit(d.USER_LOGGED_IN,t)},n.sendAhoy=function(){n.state.socket.emit("ahoy",n.state.user.name)},n.state={socket:null,user:null},n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=h()("/");t.on("connect",function(){e.state.user?(t.emit(d.USER_RECONNECTED,e.state.user.name),console.log("Reconnected to server, my socket ID is ".concat(t.id))):console.log("Connected to server, my socket ID is ".concat(t.id))}),t.on(d.USER_DATA,function(t){return e.setState({user:t})}),this.setState({socket:t})}},{key:"render",value:function(){var e=this.state,t=e.socket,n=e.user;return c.a.createElement("div",{className:"App"},n?c.a.createElement("div",{className:"layout"},c.a.createElement("span",null,"Logged in! Welcome ",n.name,"."),c.a.createElement(f,{socket:t}),c.a.createElement(y,{socket:t,username:n.name}),c.a.createElement(k,{socket:t}),c.a.createElement("br",null),c.a.createElement("button",{onClick:this.sendAhoy},"Ahoy!")):c.a.createElement(b,{socket:t,createUser:this.createUser}))}}]),t}(c.a.Component);o.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(A,null)),document.getElementById("root"))}},[[43,2,1]]]);
//# sourceMappingURL=main.0113645b.chunk.js.map