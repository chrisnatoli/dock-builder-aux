(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{2:function(e,t){e.exports={CHECK_USERNAME:"CHECK_USERNAME",USER_LOGGED_IN:"USER_LOGGED_IN",USER_RECONNECTED:"USER_RECONNECTED",START_GAME:"START_GAME",VOTE_TO_END_GAME:"VOTE_TO_END_GAME",END_GAME:"END_GAME",DICE__DRAW_DIE:"DICE__DRAW_DIE",DICE__PUT_BACK:"DICE__PUT_BACK",DICE__SET_DIE:"DICE__SET_DIE",HORIZON__DEAL_CARDS:"HORIZON__DEAL_CARDS",HORIZON__DRAFTED_CARDS:"HORIZON__DRAFTED_CARDS",LOG_BACK_IN:"LOG_BACK_IN",GAME_LOG_MESSAGE:"GAME_LOG_MESSAGE",UPDATE_USERNAME_LIST:"UPDATE_USERNAME_LIST",DICE__ENABLE_DRAWING:"DICE__ENABLE_DRAWING",DICE__UPDATE:"DICE__UPDATE",HORIZON__UPDATE_DECK:"HORIZON__UPDATE_DECK",HORIZON__UPDATE_HAND:"HORIZON__UPDATE_HAND",HORIZON__UPDATE_KEPT_CARDS:"HORIZON__UPDATE_KEPT_CARDS",HORIZON__ENABLE_DEALING:"HORIZON__ENABLE_DEALING",HORIZON__CHOSEN_CARD:"HORIZON__CHOSEN_CARD"}},29:function(e,t,a){},44:function(e,t,a){e.exports=a(78)},78:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),c=a(42),s=a.n(c),o=(a(29),a(3)),i=a(4),l=a(6),u=a(5),m=a(7),E=a(43),d=a.n(E),_=a(2),h=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).handleChange=function(e){a.setState({username:e.target.value})},a.handleSubmit=function(e){e.preventDefault(),a.props.socket.emit(_.CHECK_USERNAME,a.state.username,a.handleUsernameCheck)},a.handleUsernameCheck=function(e,t){switch(t){case"USER_DISCONNECTED":a.setState({logBackInAs:e,error:"A user with this name had disconnected. "+"Are you trying to log back in as ".concat(e,"?")});break;case"GAME_ALREADY_STARTED":a.setState({error:"Sorry, the game has already started."});break;case"USERNAME_TAKEN":a.setState({error:"This username is already taken."});break;case"USERNAME_BLANK":a.setState({error:"Your username cannot be blank."});break;default:a.setState({error:"",logBackInAs:null}),a.props.setUsername(e)}},a.handleLogBackIn=function(){var e=a.state.logBackInAs;console.log("Logging back in as ".concat(e)),a.props.socket.emit(_.USER_RECONNECTED,e)},a.textInput=r.a.createRef(),a.state={username:"",error:"",logBackInAs:null},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){this.textInput.current.focus()}},{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement("form",{onSubmit:this.handleSubmit,className:"LoginForm"},r.a.createElement("label",{htmlFor:"username"},"Name:"),r.a.createElement("input",{type:"text",id:"username",value:this.state.username,onChange:this.handleChange,ref:this.textInput}),r.a.createElement("input",{type:"submit",value:"Submit"})),r.a.createElement("div",{className:"error"},this.state.error,this.state.logBackInAs&&r.a.createElement("button",{onClick:this.handleLogBackIn},"Log back in")))}}]),t}(r.a.Component);var p=function(e){return r.a.createElement("div",{className:"UsernameList"},"Players: ",e.usernameList.map(function(t,a){return r.a.createElement("span",{key:t},a?", ":"",r.a.createElement("span",{className:"".concat(t===e.username?"ThisUsername":"")},t))}))},D=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).scrollDown=function(){var e=a.container.current;e.scrollTop=e.scrollHeight},a.container=r.a.createRef(),a.state={gameLogMessages:[]},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.props.socket.on(_.GAME_LOG_MESSAGE,function(t){return e.setState({gameLogMessages:t})})}},{key:"componentDidUpdate",value:function(){this.scrollDown()}},{key:"render",value:function(){return r.a.createElement("div",{className:"GameLog container"},r.a.createElement("h3",null,"Game Log"),r.a.createElement("div",{className:"LogMessageContainer",ref:this.container},this.state.gameLogMessages.map(function(e,t){return r.a.createElement("div",{key:t,className:"LogMessage"},e)})))}}]),t}(r.a.Component),O=a(14),f=function(e){function t(){return Object(o.a)(this,t),Object(l.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e;switch(this.props.die.value){case"blank":e=r.a.createElement(O.e,null);break;case"two":e=r.a.createElement(O.d,null);break;case"four":e=r.a.createElement(O.b,null);break;case"trio":e=r.a.createElement(O.c,null);break;default:e=r.a.createElement(O.a,null)}var t=this.props.die.color,a="orange"===t?"DarkOrange":t;return r.a.createElement("span",{className:"DieIcon",style:{color:a}},e)}}]),t}(r.a.Component),b=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).putBack=function(){var e=a.props,t=e.socket,n=e.die;t.emit(_.DICE__PUT_BACK,n)},a.roll=function(){var e=["blank","two","two","four","four","trio"],t=e[Math.floor(Math.random()*e.length)];a.setDie(t)},a.handleChange=function(e){var t=e.target.value;a.setState({selectedValue:t}),a.setDie(t)},a.setDie=function(e){var t=a.props,n=t.socket,r=t.die;n.emit(_.DICE__SET_DIE,r,e)},a.state={selectedValue:a.props.die.value||"cube"},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){var e=this.props.die;return r.a.createElement("div",{className:"DieContainer container"},r.a.createElement(f,{die:e}),r.a.createElement("button",{onClick:this.putBack},"Put back"),r.a.createElement("button",{onClick:this.roll},"Roll"),r.a.createElement("label",null,"Set value:"),r.a.createElement("select",{value:this.state.selectedValue,onChange:this.handleChange},r.a.createElement("option",{value:"cube",disabled:!0}),r.a.createElement("option",{value:"trio"},"Trio"),r.a.createElement("option",{value:"four"},"Four"),r.a.createElement("option",{value:"two"},"Two"),r.a.createElement("option",{value:"blank"},"Blank")))}}]),t}(r.a.Component),C=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).drawDie=function(){var e=a.state.dice.filter(function(e){return!e.isOnTable}),t=e[Math.floor(Math.random()*e.length)];a.props.socket.emit(_.DICE__DRAW_DIE,t)},a.state={dice:[],isDrawingEnabled:!1},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.socket;t.on(_.DICE__ENABLE_DRAWING,function(t){return e.setState({isDrawingEnabled:t})}),t.on(_.DICE__UPDATE,function(t,a){e.props.username===t&&e.setState({dice:a})})}},{key:"render",value:function(){var e,t=this.props,a=t.socket,n=t.username,c=t.isForThisUser,s=this.state,o=s.dice,i=s.isDrawingEnabled,l=c?"ThisUser":"Opponent",u=[],m=[];return o&&(u=o.filter(function(e){return!e.isOnTable}),m=o.filter(function(e){return e.isOnTable})),e=c?m.map(function(e){return r.a.createElement(b,{key:e.id,socket:a,die:e})}):m.map(function(e){return r.a.createElement(f,{key:e.id,die:e})}),r.a.createElement("div",{className:"DiceContainer container"},r.a.createElement("h3",null,"".concat(n,"'s dice")),r.a.createElement("div",{className:"DiceFlexbox ".concat(l)},r.a.createElement("div",{className:"DiceInBagContainer ".concat(l)},r.a.createElement("p",null,"Dice in bag"),u.map(function(e){return r.a.createElement(f,{key:e.id,die:e})}),c&&r.a.createElement("button",{disabled:0===u.length||!i,onClick:this.drawDie},"Draw")),r.a.createElement("div",{className:"DiceOnTableContainer ".concat(l)},r.a.createElement("p",null,"Dice on table"),e)))}}]),t}(r.a.Component),k=a(21),A=a(20);var N=function(e){var t=e.card,a=t.numGreen,n=t.numPurple,c=t.numOrange;return r.a.createElement("div",{className:"HorizonCard ".concat(e.checked?"highlighted":"")},r.a.createElement("p",null,Object(k.a)(Array(a).keys()).map(function(e){return r.a.createElement(A.a,{key:e,style:{color:"green"}})})),r.a.createElement("p",null,Object(k.a)(Array(n).keys()).map(function(e){return r.a.createElement(A.a,{key:e,style:{color:"purple"}})})),r.a.createElement("p",null,Object(k.a)(Array(c).keys()).map(function(e){return r.a.createElement(A.a,{key:e,style:{color:"DarkOrange"}})})))};var v=function(e){var t=e.topCard;return r.a.createElement(N,{card:t||{numGreen:0,numPurple:0,numOrange:0}})},S=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).dealCards=function(){a.props.socket.emit(_.HORIZON__DEAL_CARDS)},a.state={drawPile:[],discardPile:[],isDealingEnabled:!1},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.socket;t.on(_.HORIZON__UPDATE_DECK,function(t,a){return e.setState({drawPile:t,discardPile:a})}),t.on(_.HORIZON__ENABLE_DEALING,function(t){return e.setState({isDealingEnabled:t})})}},{key:"render",value:function(){var e=this.state,t=e.drawPile,a=e.discardPile,n=e.isDealingEnabled,c=0!==a.length?a[a.length-1]:null;return r.a.createElement("div",{className:"HorizonDeckContainer container"},r.a.createElement("h3",null,"Horizon deck"),r.a.createElement("div",{className:"DrawPileContainer"},r.a.createElement("p",null,"Draw pile"),r.a.createElement("p",{className:"NumCards"},"(".concat(t.length," card").concat(1!==t.length?"s":"",")")),r.a.createElement(v,null),r.a.createElement("button",{onClick:this.dealCards,disabled:!n},"Deal")),r.a.createElement("div",{className:"DiscardPileContainer"},r.a.createElement("p",null,"Discard pile"),r.a.createElement("p",{class:"NumCards"},"(".concat(a.length," card").concat(1!==a.length?"s":"",")")),r.a.createElement(v,{topCard:c})))}}]),t}(r.a.Component),g=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).handleChange=function(e){a.setState(function(t){if(!t.isSubmitted)return{selectedOption:e.target.value}})},a.handleSubmit=function(e){e.preventDefault(),a.setState({isSubmitted:!0});var t=a.state.selectedOption,n=a.props.socket,r=a.state.hand,c=r.find(function(e){return e.id===t}),s=r.filter(function(e){return e.id!==t});n.emit(_.HORIZON__DRAFTED_CARDS,c,s)},a.state={hand:[],keptCards:[],selectedOption:null,isSubmitted:!1},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=this.props.socket;t.on(_.HORIZON__UPDATE_HAND,function(t){return e.setState({hand:t,selectedOption:null})}),t.on(_.HORIZON__UPDATE_KEPT_CARDS,function(t){return e.setState({keptCards:t,isSubmitted:!1})}),t.on(_.HORIZON__CHOSEN_CARD,function(t){t&&e.setState({selectedOption:t.id,isSubmitted:!0})})}},{key:"render",value:function(){var e=this,t=this.state,a=t.hand,n=t.keptCards,c=t.selectedOption,s=t.isSubmitted,o=s||null===c;return 0===n.length&&0===a.length?null:r.a.createElement("div",{className:"HorizonHand container"},r.a.createElement("h3",null,"Your hand of Horizon cards"),n.length>0&&r.a.createElement("div",{className:"KeptCardsContainer"},r.a.createElement("p",null,"Cards you kept"),n.map(function(e){return r.a.createElement(N,{card:e})})),a.length>0&&r.a.createElement("div",{className:"CardsToDraftContainer"},r.a.createElement("p",null,"Cards to draft"),r.a.createElement("form",{onSubmit:this.handleSubmit},a.map(function(t){return r.a.createElement("label",{key:t.id},r.a.createElement("input",{type:"radio",value:t.id,checked:c===t.id,onChange:e.handleChange}),r.a.createElement(N,{card:t,checked:c===t.id}))}),r.a.createElement("input",{type:"submit",value:"Choose",disabled:o})),s&&r.a.createElement("p",null,"(Waiting for other players to choose.)")))}}]),t}(r.a.Component),I=function(e){function t(e){var a;return Object(o.a)(this,t),(a=Object(l.a)(this,Object(u.a)(t).call(this,e))).setUsername=function(e){a.setState({username:e}),a.state.socket.emit(_.USER_LOGGED_IN,e)},a.startGame=function(){a.state.socket.emit(_.START_GAME)},a.sendAhoy=function(){a.state.socket.emit("ahoy",a.state.username)},a.endGameVote=function(){a.state.socket.emit(_.VOTE_TO_END_GAME)},a.state={socket:null,username:null,usernameList:[],isGameStarted:!1},a}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=d()("/");this.setState({socket:t}),t.on("connect",function(){e.state.username?(t.emit(_.USER_RECONNECTED,e.state.username),console.log("Reconnected to server, my socket ID is ".concat(t.id))):console.log("Connected to server, my socket ID is ".concat(t.id))}),t.on(_.LOG_BACK_IN,function(t){return e.setState({username:t})}),t.on(_.UPDATE_USERNAME_LIST,function(t){return e.setState({usernameList:t})}),t.on(_.START_GAME,function(t){return e.setState({isGameStarted:t})}),t.on(_.END_GAME,function(){return e.setState({username:null,usernameList:[],isGameStarted:!1})})}},{key:"render",value:function(){var e,t=this.state,a=t.socket,n=t.username,c=t.usernameList,s=t.isGameStarted;return n&&(e=c.filter(function(e){return e!==n})),r.a.createElement("div",{className:"App"},n?r.a.createElement("div",{className:"Layout"},r.a.createElement(p,{username:n,usernameList:c}),s?r.a.createElement("div",{className:"GameUI"},r.a.createElement(C,{socket:a,username:n,isForThisUser:!0}),r.a.createElement("div",{className:"OpponentsDiceFlexbox"},e.map(function(e){return r.a.createElement(C,{key:e,socket:a,username:e,isForThisUser:!1})})),r.a.createElement("div",{className:"HorizonFlexbox"},r.a.createElement(S,{socket:a}),r.a.createElement(g,{socket:a}))):r.a.createElement("button",{onClick:this.startGame},"Start game"),r.a.createElement(D,{socket:a}),r.a.createElement("button",{onClick:this.sendAhoy},"Ahoy!"),r.a.createElement("button",{onClick:this.endGameVote},"Vote to end the game")):r.a.createElement(h,{socket:a,setUsername:this.setUsername}))}}]),t}(r.a.Component);s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(I,null)),document.getElementById("root"))}},[[44,2,1]]]);
//# sourceMappingURL=main.6767f769.chunk.js.map