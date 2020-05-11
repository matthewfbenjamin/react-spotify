(this["webpackJsonpspotify-playlist-manager"]=this["webpackJsonpspotify-playlist-manager"]||[]).push([[0],{35:function(e,t,a){e.exports=a(66)},40:function(e,t,a){},64:function(e,t,a){},66:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(28),o=a.n(c),i=(a(40),a(13)),s=a(6),l=Object(n.createContext)({}),u={ACCESS_TOKEN:{key:"accessToken",type:"string"},ME:{key:"me",type:"object"}},p=function(e){var t=e.children;return r.a.createElement(l.Provider,{value:{APP_STATE_VALUES:u,getPersistedState:function(e){try{if("object"===e.type){var t=localStorage.getItem(e.key);return t?JSON.parse(t):null}return localStorage.getItem(e.key)}catch(a){localStorage.clear()}},setPersistedState:function(e,t){"object"===e.type?localStorage.setItem(e.key,JSON.stringify(t)):localStorage.setItem(e.key,t)}}},t)},d=a(7),m=a(32),f=a(11),v="dev"===Object({NODE_ENV:"production",PUBLIC_URL:"/react-spotify",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).REACT_APP_STAGE?"localhost:3000":"http://matthewfbenjamin.github.io/react-spotify",E=["user-read-private","user-read-email","playlist-read-collaborative","playlist-modify-public","playlist-read-private","playlist-modify-private"],b=window.location.hash.substring(1).split("&").reduce((function(e,t){if(t){var a=t.split("=");e[a[0]]=decodeURIComponent(a[1])}return e}),{}),h=function(){var e=Object(n.useContext)(l),t=e.APP_STATE_VALUES.ACCESS_TOKEN,a=e.setPersistedState,c=Object(n.useState)(!1),o=Object(d.a)(c,2),i=o[0],u=o[1],p=Object(n.useState)(!1),h=Object(d.a)(p,2),y=h[0],S=h[1];return Object(n.useEffect)((function(){var e=b.access_token;e&&(a(t,e),S(!0))}),[a,t]),y?r.a.createElement(s.a,{to:"/home"}):r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},i?r.a.createElement(m.a,{animation:"border",role:"status"}):r.a.createElement("a",{className:"btn btn--loginApp-link",href:"".concat("https://accounts.spotify.com/authorize","?client_id=").concat("7719deb8aec14035bd2d6d603b240f78","&redirect_uri=").concat(v,"&scope=").concat(E.join("%20"),"&response_type=token&show_dialog=true"),onClick:function(){return u(!0)}},r.a.createElement(f.a,{variant:"success"},"Login to Spotify"))))},y=a(34),S=a(5),g=a.n(S),k=a(12),O=a(33),j=a.n(O),x=function(){var e=Object(n.useContext)(l),t=e.APP_STATE_VALUES,a=t.ACCESS_TOKEN,c=t.ME,o=e.getPersistedState,i=e.setPersistedState,u=Object(n.useState)(!1),p=Object(d.a)(u,2),m=p[0],v=p[1],E=Object(n.useState)({isLoading:!1,didLoad:!1}),b=Object(d.a)(E,2),h=b[0],S=b[1],O=Object(n.useState)(null),x=Object(d.a)(O,2),_=x[0],w=x[1],A=o(a),C=j.a.create({baseURL:"https://api.spotify.com/v1",headers:{Authorization:"Bearer ".concat(A)}});Object(n.useEffect)((function(){var e=function(){var e=Object(k.a)(g.a.mark((function e(){var t,a;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,C.get("/me");case 3:t=e.sent,a=t.data,i(c,a),w(a),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),v(!0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}(),t=o(c);t?w(t):e()}),[c,A,o,i,C]);var P=function(){var e=Object(k.a)(g.a.mark((function e(){var t,a,n,r,c;return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,S(Object(y.a)({},h,{isLoading:!0})),e.next=4,C.get("/playlists/".concat("37i9dQZF1EfMJO4KCTeoFL"));case 4:if(!((t=e.sent).data&&t.data.tracks&&t.data.tracks.items&&t.data.tracks.items.length>0&&_)){e.next=22;break}return e.next=8,C.get("/me/playlists");case 8:if(e.sent.data.items.forEach((function(e){"Daily Drive (No Podcasts)"===e.name&&(a=e.id)})),n=t.data.tracks.items.reduce((function(e,t,a){return a>=0&&"track"===t.track.type&&e.push(t.track.uri),e}),[]),!a){e.next=16;break}return e.next=14,L(a,n);case 14:e.next=22;break;case 16:return e.next=18,C.post("/users/".concat(_.id,"/playlists"),{name:"Daily Drive (No Podcasts)",public:!1,collaborative:!1});case 18:return r=e.sent,c=r.data,e.next=22,T(c.id,n);case 22:e.next=27;break;case 24:e.prev=24,e.t0=e.catch(0),S({isLoading:!1,didLoad:!0,error:e.t0});case 27:case"end":return e.stop()}}),e,null,[[0,24]])})));return function(){return e.apply(this,arguments)}}(),T=function(){var e=Object(k.a)(g.a.mark((function e(t,a){return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C.post("/playlists/".concat(t,"/tracks"),{uris:a});case 2:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),L=function(){var e=Object(k.a)(g.a.mark((function e(t,a){return g.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C.put("/playlists/".concat(t,"/tracks"),{uris:a});case 2:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}();return!A||m?r.a.createElement(s.a,{to:"/login"}):r.a.createElement("div",{style:{padding:"30px",minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"space-between"}},r.a.createElement("div",null,_&&r.a.createElement(f.a,{variant:"success",onClick:P},"Remove Podcasts from Daily Drive")),r.a.createElement("div",null,r.a.createElement(f.a,{variant:"danger",onClick:function(){return v(!0)}},"Logout")))},_=(a(64),function(){return r.a.createElement(p,null,r.a.createElement(i.a,null,r.a.createElement(s.d,null,r.a.createElement(s.b,{path:"/login"},r.a.createElement(h,null)),r.a.createElement(s.b,{path:"/home"},r.a.createElement(x,null)),r.a.createElement(s.b,{path:"/"},r.a.createElement(s.a,{to:"/login"})))))});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(65);o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(_,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[35,1,2]]]);
//# sourceMappingURL=main.36199dc5.chunk.js.map