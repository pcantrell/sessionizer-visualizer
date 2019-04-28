(function(e){function t(t){for(var n,a,r=t[0],c=t[1],l=t[2],h=0,d=[];h<r.length;h++)a=r[h],i[a]&&d.push(i[a][0]),i[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);u&&u(t);while(d.length)d.shift()();return o.push.apply(o,l||[]),s()}function s(){for(var e,t=0;t<o.length;t++){for(var s=o[t],n=!0,r=1;r<s.length;r++){var c=s[r];0!==i[c]&&(n=!1)}n&&(o.splice(t--,1),e=a(a.s=s[0]))}return e}var n={},i={app:0},o=[];function a(t){if(n[t])return n[t].exports;var s=n[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,a),s.l=!0,s.exports}a.m=e,a.c=n,a.d=function(e,t,s){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(a.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(s,n,function(t){return e[t]}.bind(null,n));return s},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/sessionizer-visualizer/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],c=r.push.bind(r);r.push=t,r=r.slice();for(var l=0;l<r.length;l++)t(r[l]);var u=c;o.push([0,"chunk-vendors"]),s()})({0:function(e,t,s){e.exports=s("cd49")},"072e":function(e,t,s){"use strict";var n=s("5c7c"),i=s.n(n);i.a},"4ac3":function(e,t,s){},"5c0b":function(e,t,s){"use strict";var n=s("5e27"),i=s.n(n);i.a},"5c7c":function(e,t,s){},"5e27":function(e,t,s){},"9f03":function(e,t,s){"use strict";var n=s("4ac3"),i=s.n(n);i.a},b59b:function(e,t,s){},be3d:function(e,t,s){"use strict";var n=s("b59b"),i=s.n(n);i.a},cd49:function(e,t,s){"use strict";s.r(t);s("cadf"),s("551c"),s("f751"),s("097d");var n=s("2b0e"),i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"app"}},[s("ScheduleGrid",{attrs:{schedule:e.schedule,options:e.options,annealerBestScore:e.annealer.bestScore}}),s("ComplaintPairs",{attrs:{schedule:e.schedule,options:e.options}}),s("div",{staticClass:"control-panel"},[s("button",{on:{click:function(t){return e.schedule.clear()}}},[e._v("clear")]),s("button",{on:{click:function(t){return e.schedule.randomizeSlots()}}},[e._v("rand slots")]),s("button",{on:{click:function(t){return e.schedule.randomizeVotes()}}},[e._v("rand votes")]),s("Toggle",{attrs:{label:"pairs"},model:{value:e.options.showPairs,callback:function(t){e.$set(e.options,"showPairs",t)},expression:"options.showPairs"}}),s("Toggle",{attrs:{label:"naive"},model:{value:e.options.showNaiveScores,callback:function(t){e.$set(e.options,"showNaiveScores",t)},expression:"options.showNaiveScores"}}),s("Toggle",{attrs:{label:"focused shape"},model:{value:e.options.showFocusedShape,callback:function(t){e.$set(e.options,"showFocusedShape",t)},expression:"options.showFocusedShape"}}),s("Toggle",{attrs:{label:"mini shapes"},model:{value:e.options.showMiniShapes,callback:function(t){e.$set(e.options,"showMiniShapes",t)},expression:"options.showMiniShapes"}}),s("Toggle",{attrs:{label:"focused rank"},model:{value:e.options.showRanking,callback:function(t){e.$set(e.options,"showRanking",t)},expression:"options.showRanking"}}),s("button",{on:{click:function(t){return e.schedule.randomizeRanks()}}},[e._v("rand rank")]),s("Toggle",{attrs:{label:"scores"},model:{value:e.options.showShapeScores,callback:function(t){e.$set(e.options,"showShapeScores",t)},expression:"options.showShapeScores"}}),s("button",{class:{active:e.annealer.running},on:{click:function(t){return e.annealer.toggle()}}},[e._v("anneal")])],1),e._m(0),e._m(1),e._m(2)],1)},o=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"hints"},[s("div",{staticClass:"hint"},[e._v("Click on the lower grid to vote for sessions.")]),s("div",{staticClass:"hint"},[e._v("Click on the upper grid to schedule sessions.")]),s("div",{staticClass:"hint"},[e._v("Click a name to focus / unfocus on that participant’s schedule.")]),s("div",{staticClass:"hint"},[e._v("Click “rand slots” and “rand votes” below to generate random schedule/votes.")]),s("div",{staticClass:"hint"},[e._v("Use checkboxes below to analyze the schedule in different ways.")]),s("div",{staticClass:"hint"},[e._v("(Note: “focused shape and “focused rank” are only visible when you select a person.)")]),s("div",{staticClass:"hint"},[e._v("Click “anneal” for a dramatic reenactment of the scheduler in action. Click again to stop.")]),s("div",{staticClass:"hint"},[e._v("(This visualization uses a simplified but representative version of the actual algorithm.)")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"links"},[s("div",{staticClass:"link"},[s("a",{attrs:{href:"https://github.com/pcantrell/sessionizer-visualizer"}},[e._v("Source code for this visualization")])]),s("div",{staticClass:"link"},[s("a",{attrs:{href:"https://youtu.be/QsMWMRzBsG0?t=23"}},[e._v("Paul’s 2014 talk on scheduling with simulated annealing")]),e._v("\n      (uses the “naive” scoring below)\n    ")]),s("div",{staticClass:"link"},[e._v("\n      Paul’s 2019 talk on scheduler improvements, where this visualization originates: "),s("b",[e._v("forthcoming!")])]),s("div",{staticClass:"link"},[s("a",{attrs:{href:"https://sessions.minnestar.org"}},[e._v("The real-life Minnebar sessionizer")]),e._v("\n      and\n      "),s("a",{attrs:{href:"https://sessions.minnestar.org/schedule?force=1"}},[e._v("a generated schedule")])]),s("div",{staticClass:"link"},[s("a",{attrs:{href:"https://github.com/minnestar/sessionizer"}},[e._v("Sessionizer source code")])]),s("div",{staticClass:"link"},[s("a",{attrs:{href:"https://github.com/minnestar/sessionizer/tree/master/src/lib/scheduling"}},[e._v("Source code for the real-life scheduler")]),e._v("\n      (warning: may cause eye bleed)\n    ")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"opsipod"},[s("a",{staticClass:"imglink",attrs:{href:"https://innig.net"}},[s("div",{staticClass:"innig-logo-mini"})])])}],a=s("d225"),r=s("b0b4"),c=s("308d"),l=s("6bb5"),u=s("4e2b"),h=s("9ab4"),d=s("60a3"),v=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("table",{class:{"schedule-grid":!0,"focus-enabled":e.focus}},[s("tr",{staticClass:"top-header"},[s("td",{staticClass:"placeholder"}),e._l(e.schedule.sessions,function(t){return s("th",[e._v("\n        "+e._s(t.name)+"\n    ")])})],2),e._l(e.schedule.timeslots,function(t,n){return s("tr",{staticClass:"timeslot"},[s("th",[e._v(e._s(t))]),e._l(e.schedule.sessions,function(t,i){return s("td",{class:{selected:t.timeslotID===n,focused:t.timeslotID===n&&e.isSessionFocused(i)},on:{click:function(e){t.timeslotID=n}}})}),e.options.showFocusedShape&&e.focus?s("td",{staticClass:"focused placeholder"},[s("div",{staticClass:"big shape-block-row"},e._l(e.schedule.groupedSessions(e.focus)[n],function(t){return s("div",{staticClass:"big shape-block"},[e.options.showRanking?s("div",{staticClass:"ranking"},[e._v("\n            "+e._s(e.focus.votes.indexOf(e.schedule.sessions.indexOf(t))+1)+"\n          ")]):e._e()])}),0)]):e._e()],2)}),s("tr",{staticClass:"top-header"},[s("td",{staticClass:"placeholder"}),e._l(e.schedule.sessions,function(t,n){return s("th",{class:{focused:e.isSessionFocused(n)}},[e._v("\n        "+e._s(t.name)+"\n    ")])})],2),e._l(e.schedule.participants,function(t){return s("tr",{class:{participant:!0,focused:e.focus===t}},[s("th",{on:{click:function(s){return e.toggleFocus(t)}}},[e._v("\n      "+e._s(t.name)+"\n    ")]),e._l(e.schedule.sessions,function(n,i){return s("td",{class:{vote:!0,selected:t.votes.includes(i)},on:{click:function(e){return t.toggleVote(i)}}},[e._v("\n      "+e._s(e.schedule.timeslots[n.timeslotID])+"\n    ")])}),e.options.showNaiveScores?[s("td",{staticClass:"scoring numeric naive"},[e._v("\n        "+e._s(e.schedule.naiveScore(t))+"\n      ")]),s("td",{staticClass:"scoring numeric naive naive-percent"},[t.votes.length>0?s("span",[e._v("\n          "+e._s(e.schedule.naivePercent(t))+"%\n        ")]):e._e()])]:e._e(),e.options.showMiniShapes?s("td",{staticClass:"scoring"},e._l(e.schedule.timeslots,function(n,i){return s("div",{staticClass:"small shape-block-row"},e._l(e.schedule.groupedSessions(t)[i],function(e){return s("div",{staticClass:"small shape-block"})}),0)}),0):e._e(),e.options.showShapeScores?[s("td",{staticClass:"scoring numeric shape"},[e._v("\n        "+e._s(e.formatFixed(e.schedule.shapeScore(t),3))+"\n      ")])]:e._e()],2)}),s("tr",{staticClass:"totals"},[s("td",{staticClass:"placeholder"}),e._l(e.schedule.sessions,function(t,n){return s("td",[e._v("\n      "+e._s(e.schedule.voteCount(n))+"\n    ")])}),e.options.showNaiveScores?[s("td",{staticClass:"scoring numeric naive"},[e._v("\n        "+e._s(e.formatFixed(e.schedule.averageScore(e.schedule.naiveScore),1))+"\n      ")]),s("td",{staticClass:"scoring numeric naive naive-percent"},[e._v("\n        "+e._s(e.formatFixed(e.schedule.averageScore(e.schedule.naivePercent),0))+"%\n      ")])]:e._e(),e.options.showMiniShapes?s("td",{staticClass:"placeholder"}):e._e(),e.options.showShapeScores?[s("td",{staticClass:"scoring numeric shape"},[e._v("\n        "+e._s(e.formatFixed(e.schedule.averageScore(e.schedule.shapeScore),3))+"\n        "),e.annealerBestScore>0?s("div",{staticClass:"best"},[s("div",{staticClass:"side-label"},[e._v("\n            Best:\n          ")]),s("div",{class:{score:!0,"new-best-score":e.newBestScore}},[e._v("\n            "+e._s(e.formatFixed(e.annealerBestScore,3))+"\n          ")])]):e._e()])]:e._e()],2)],2)},f=[],p=(s("6762"),s("2fdb"),function(e){function t(){var e;return Object(a["a"])(this,t),e=Object(c["a"])(this,Object(l["a"])(t).apply(this,arguments)),e.focus=null,e.newBestScore=!1,e}return Object(u["a"])(t,e),Object(r["a"])(t,[{key:"toggleFocus",value:function(e){this.focus=this.focus===e?null:e}},{key:"isSessionFocused",value:function(e){return this.focus&&this.focus.votes.includes(e)||!1}},{key:"formatFixed",value:function(e,t){if(e)return e.toFixed(t)}},{key:"onNewBestScore",value:function(e,t){var s=this;t&&(this.newBestScore=!1,setTimeout(function(){return s.newBestScore=!0},.01))}}]),t}(d["c"]));h["a"]([Object(d["b"])()],p.prototype,"schedule",void 0),h["a"]([Object(d["b"])()],p.prototype,"options",void 0),h["a"]([Object(d["b"])()],p.prototype,"annealerBestScore",void 0),h["a"]([Object(d["d"])("annealerBestScore")],p.prototype,"onNewBestScore",null),p=h["a"]([d["a"]],p);var b=p,m=b,g=(s("9f03"),s("2877")),_=Object(g["a"])(m,v,f,!1,null,"92342f3a",null),y=_.exports,S=function(){var e=this,t=e.$createElement,s=e._self._c||t;return e.options.showPairs?s("div",{staticClass:"complaint-pairs"},e._l(e.schedule.participants,function(t){return s("div",e._l(e.schedule.groupedSessions(t),function(n){return s("div",e._l(n,function(i,o){return s("div",e._l(n.slice(o+1),function(n){return s("div",{staticClass:"complaint"},[e._v("\n          ☹️ "),s("b",[e._v(e._s(t.name))]),e._v(": "+e._s(i.name)+" vs "+e._s(n.name)+"\n        ")])}),0)}),0)}),0)}),0):e._e()},k=[],w=function(e){function t(){return Object(a["a"])(this,t),Object(c["a"])(this,Object(l["a"])(t).apply(this,arguments))}return Object(u["a"])(t,e),t}(d["c"]);h["a"]([Object(d["b"])()],w.prototype,"schedule",void 0),h["a"]([Object(d["b"])()],w.prototype,"options",void 0),w=h["a"]([d["a"]],w);var C=w,O=C,j=(s("be3d"),Object(g["a"])(O,S,k,!1,null,"649c84fc",null)),x=j.exports,I=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("span",[s("input",{attrs:{type:"checkbox",id:e.id},domProps:{checked:e.value},on:{change:function(t){return e.$emit("input",t.target.checked)}}}),s("label",{attrs:{for:e.id}},[e._v(e._s(e.label))])])},M=[],T=function(e){function t(){var e;return Object(a["a"])(this,t),e=Object(c["a"])(this,Object(l["a"])(t).apply(this,arguments)),e.id="toggle-"+Math.random(),e}return Object(u["a"])(t,e),t}(d["c"]);h["a"]([Object(d["b"])()],T.prototype,"value",void 0),h["a"]([Object(d["b"])()],T.prototype,"label",void 0),T=h["a"]([d["a"]],T);var P=T,z=P,F=(s("072e"),Object(g["a"])(z,I,M,!1,null,"a49e63dc",null)),D=F.exports,$=(s("ac4d"),s("8a81"),s("ac6a"),function e(t){Object(a["a"])(this,e),this.timeslotID=void 0,this.name=t}),B=function(){function e(t){Object(a["a"])(this,e),this.votes=[],this.name=t}return Object(r["a"])(e,[{key:"toggleVote",value:function(e){this.votes.includes(e)?this.votes=this.votes.filter(function(t){return t!==e}):this.votes.push(e)}}]),e}(),N=function(){function e(){Object(a["a"])(this,e)}return Object(r["a"])(e,null,[{key:"randomIntLessThan",value:function(e){return Math.floor(Math.random()*e)}},{key:"randomInt",value:function(e,t){return this.randomIntLessThan(t-e)+e}},{key:"shuffle",value:function(e){var t=this;e.forEach(function(s,n){var i=t.randomInt(n,e.length),o=[e[i],e[n]];e[n]=o[0],e[i]=o[1]}),e.push(e.pop())}},{key:"sample",value:function(e){return e[this.randomIntLessThan(e.length)]}}]),e}(),E=function(){function e(t){Object(a["a"])(this,e),this.participants=t.participants.map(function(e){return new B(e)}),this.sessions=t.sessions.map(function(e){return new $(e)}),this.timeslots=t.timeslots}return Object(r["a"])(e,[{key:"randomizeSlots",value:function(){var e=!0,t=!1,s=void 0;try{for(var n,i=this.sessions[Symbol.iterator]();!(e=(n=i.next()).done);e=!0){var o=n.value;o.timeslotID=Math.floor(Math.random()*this.timeslots.length)}}catch(a){t=!0,s=a}finally{try{e||null==i.return||i.return()}finally{if(t)throw s}}}},{key:"randomizeVotes",value:function(){var e=this,t=!0,s=!1,n=void 0;try{for(var i,o=function(){var t=i.value,s=.5*Math.random()+.1;t.votes=e.sessions.map(function(e,t){return t}).filter(function(e){return Math.random()<s})},a=this.participants[Symbol.iterator]();!(t=(i=a.next()).done);t=!0)o()}catch(r){s=!0,n=r}finally{try{t||null==a.return||a.return()}finally{if(s)throw n}}}},{key:"randomizeRanks",value:function(){var e=!0,t=!1,s=void 0;try{for(var n,i=this.participants[Symbol.iterator]();!(e=(n=i.next()).done);e=!0){var o=n.value;N.shuffle(o.votes)}}catch(a){t=!0,s=a}finally{try{e||null==i.return||i.return()}finally{if(t)throw s}}}},{key:"clear",value:function(){var e=!0,t=!1,s=void 0;try{for(var n,i=this.sessions[Symbol.iterator]();!(e=(n=i.next()).done);e=!0){var o=n.value;o.timeslotID=void 0}}catch(d){t=!0,s=d}finally{try{e||null==i.return||i.return()}finally{if(t)throw s}}var a=!0,r=!1,c=void 0;try{for(var l,u=this.participants[Symbol.iterator]();!(a=(l=u.next()).done);a=!0){var h=l.value;h.votes=[]}}catch(d){r=!0,c=d}finally{try{a||null==u.return||u.return()}finally{if(r)throw c}}}},{key:"groupedSessions",value:function(e){var t=this.timeslots.map(function(e){return[]}),s=!0,n=!1,i=void 0;try{for(var o,a=e.votes[Symbol.iterator]();!(s=(o=a.next()).done);s=!0){var r=o.value,c=this.sessions[r];c&&void 0!==c.timeslotID&&t[c.timeslotID].push(c)}}catch(l){n=!0,i=l}finally{try{s||null==a.return||a.return()}finally{if(n)throw i}}return t}},{key:"voteCount",value:function(e){return this.participants.filter(function(t){return t.votes.includes(e)}).length}},{key:"naiveScore",value:function(e){return this.groupedSessions(e).filter(function(e){return e.length>0}).length}},{key:"naivePercent",value:function(e){return Math.round(this.naiveScore(e)/e.votes.length*100)}},{key:"shapeScore",value:function(e){var t=e.votes.length;if(0===t)return null;var s=0,n=!0,i=!1,o=void 0;try{for(var a,r=this.groupedSessions(e)[Symbol.iterator]();!(n=(a=r.next()).done);n=!0){var c=a.value;s+=2*c.length/(t*(c.length+1))}}catch(l){i=!0,o=l}finally{try{n||null==r.return||r.return()}finally{if(i)throw o}}return s}},{key:"averageScore",value:function(e){var t=0,s=0,n=!0,i=!1,o=void 0;try{for(var a,r=this.participants[Symbol.iterator]();!(n=(a=r.next()).done);n=!0){var c=a.value,l=e.bind(this)(c);l&&!isNaN(l)&&(t+=l,s+=1)}}catch(u){i=!0,o=u}finally{try{n||null==r.return||r.return()}finally{if(i)throw o}}return 0===s?null:t/s}}]),e}(),R=function e(){Object(a["a"])(this,e),this.showNaiveScores=!1,this.showFocusedShape=!1,this.showMiniShapes=!1,this.showRanking=!1,this.showPairs=!1,this.showShapeScores=!1},V=function(){function e(t,s){Object(a["a"])(this,e),this.running=!1,this.bestScore=0,this.bestSchedule=[],this.iters=0,this.maxIters=1e3,this.schedule=t,this.maxIters=s.maxIters}return Object(r["a"])(e,[{key:"clear",value:function(){this.bestScore=0,this.bestSchedule=[]}},{key:"toggle",value:function(){this.running?this.stop():this.start()}},{key:"start",value:function(){this.running=!0,this.bestScore=this.schedule.averageScore(this.schedule.shapeScore)||0,this.bestSchedule=this.extractTimeslotIDs(),this.iters=0,this.step()}},{key:"stop",value:function(){var e=this;this.running=!1,this.bestSchedule.forEach(function(t,s){e.schedule.sessions[s].timeslotID=t})}},{key:"step",value:function(){var e=this;if(this.running){var t=this.schedule.averageScore(this.schedule.shapeScore)||0,s=N.sample(this.schedule.sessions),n=s.timeslotID;s.timeslotID=N.randomIntLessThan(this.schedule.timeslots.length);var i=this.schedule.averageScore(this.schedule.shapeScore)||0;i>this.bestScore?(this.bestScore=i,this.bestSchedule=this.extractTimeslotIDs()):i<t&&Math.random()<this.iters/this.maxIters&&(s.timeslotID=n),this.iters+=1,this.iters>this.maxIters&&(this.stop(),this.start()),setTimeout(function(){return e.step()},1)}}},{key:"extractTimeslotIDs",value:function(){return this.schedule.sessions.map(function(e){return e.timeslotID})}}]),e}(),L=function(e){function t(){var e;return Object(a["a"])(this,t),e=Object(c["a"])(this,Object(l["a"])(t).call(this)),e.schedule=new E({participants:["Sally","Fred","Irene","Harry","Prudence","Juan","Vicky","Yusuf","Alvin"],sessions:["👻","👾","🦷","👣","🧚🏽‍♀️","🐋","🌈","🌮","🧿","🧷","💃🏻","🧩"],timeslots:["1:00","2:00","3:00","4:00"]}),e.options=new R,e.annealer=new V(e.schedule,{maxIters:1e3}),setTimeout(function(){},.2),e}return Object(u["a"])(t,e),Object(r["a"])(t,[{key:"onVotesChanged",value:function(e,t){this.annealer.clear()}}]),t}(d["c"]);h["a"]([Object(d["d"])("schedule.participants",{deep:!0})],L.prototype,"onVotesChanged",null),L=h["a"]([Object(d["a"])({components:{ScheduleGrid:y,ComplaintPairs:x,Toggle:D}})],L);var G=L,J=G,A=(s("5c0b"),Object(g["a"])(J,i,o,!1,null,null,null)),H=A.exports;n["default"].config.productionTip=!1,new n["default"]({render:function(e){return e(H)}}).$mount("#app")}});
//# sourceMappingURL=app.6d289f38.js.map