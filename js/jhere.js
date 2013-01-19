(function(e,t,n){function h(t,n){this.element=t,this.options=e.extend({},s,n),this._defaults=s,this._plugin=r,this.init()}function p(e,t){var n=new u.kml.Manager;n.addObserver("state",l(function(e){e.state==="finished"&&t.call(this,e)},this)),n.parseKML(e)}function d(t){var n=t.target[t.type];if(e.isFunction(n)){var r=e.Event(t.type,{originalEvent:t,geo:{latitude:t.target.coordinate.latitude,longitude:t.target.coordinate.longitude},target:t.target});n.call(this.element,r)}}function v(e){return typeof e=="function"}function m(){return!!e().on}var r="jHERE",i="0.2.0",s,o,u,a,f,l=e.proxy,c;s={appId:"_peU-uCkp-j8ovkzFGNU",authToken:"gBoUkAMoxoqIWfxWA5DuMQ",zoom:12,center:[52.49,13.37],enable:["behavior","zoombar","scalebar","typeselector"],type:"map",marker:{text:"",textColor:"#333333",fill:"#ff6347",stroke:"#333333",shape:"balloon",icon:undefined},bubble:{content:"",closable:!0,onclose:e.noop},heatmap:{max:20,opacity:.8,coarseness:2}},e[r]=c={},o=h.prototype,c.defaultCredentials=function(e,t){f={appId:e,authenticationToken:t},a.load().is.done(function(){u.util.ApplicationContext.set(f)})},o.init=function(){var e=this.options;a.load().is.done(l(this.makemap,this))},o.makemap=function(){var t=this.options,n=u.map.component,i=[];n.Positioning=u.positioning.component.Positioning,f=f||{appId:t.appId,authenticationToken:t.authToken},u.util.ApplicationContext.set(f),e.data(this.element,r,!0),e.each(n,l(function(t,n){e.inArray(t.toLowerCase(),this.options.enable)>-1&&i.push(new n)},this)),this.map=new u.map.Display(this.element,{zoomLevel:t.zoom,center:t.center,components:i}),this.type(t.type)},o.center=function(e){this.map.setCenter(e)},o.zoom=function(e){this.map.set("zoomLevel",e)},o.type=function(e){var t=this.map,n={map:t.NORMAL,satellite:t.SATELLITE,smart:t.SMARTMAP,terrain:t.TERRAIN,pt:t.SMART_PT};e=n[e]||n.map,t.set("baseMapType",e)},o.marker=function(t,n){var r={},i="mouse",o="click",a=[o,"dbl"+o,i+"move",i+"over",i+"out",i+"enter",i+"leave","longpress"],f=l(d,this);e.each(a,function(e,t){r[t]=[f,!1,null]}),n=e.extend({},s.marker,n),n.textPen=n.textPen||{strokeColor:n.textColor},n.pen=n.pen||{strokeColor:n.stroke},n.brush=n.brush||{color:n.fill},n.eventListener=r,n.icon?this.map.objects.add(new u.map.Marker(t,n)):this.map.objects.add(new u.map.StandardMarker(t,n))},o.bubble=function(t,n){var r;n=e.extend({},s.bubble,n),n.content.jquery&&(n.content.css("white-space","normal"),n.content=e("<div/>").append(n.content.clone()).html()),bubbles=this.map.getComponentById("InfoBubbles")||this.map.addComponent(new u.map.component.InfoBubbles),bubbles.openBubble(n.content,{latitude:t[0],longitude:t[1]},n.onclose,!n.closable)},o.kml=function(e,t,n){v(t)&&(n=t,t=!1),p.call(this,e,l(function(e){var r=new u.kml.component.KMLResultSet(e.kmlDocument,this.map);r.addObserver("state",l(function(e){var r,i;e.state=="finished"&&(t&&(r=e.container.objects.get(0),i=r.getBoundingBox(),i&&this.map.zoomTo(i)),v(n)&&n.call(this,e))},this)),this.map.objects.add(r.create())},this))},o.heatmap=function(t,n,r){var i;n=n||"value",n.match(/^density|value$/)||(n="value"),r=r||{},r.type=n,r=e.extend({},s.heatmap,r),i=new u.heatmap.Overlay(r),i.addData(t),this.map.overlays.add(i)},o.originalMap=function(e){e.call(this.element,this.map,u)},o.destroy=function(){this.map.destroy(),e.removeData(this.element),e(this.element).empty()},a={},a.is=!1,a.load=function(){var t,r,i;return a.is&&a.is.state().match(/pending|resolved/)?this:(a.is=e.Deferred(),i=function(){u=nokia.maps,u.Features.load({map:"auto",ui:"auto",search:"auto",routing:"auto",positioning:"auto",behavior:"auto",kml:"auto",heatmap:"auto"},function(){a.is.resolve()})},t=n.getElementsByTagName("head")[0],r=n.createElement("script"),r.src="http://api.maps.nokia.com/2.2.3/jsl.js",r.type="text/javascript",r.charset="utf-8",r.onreadystatechange=function(){r.readyState.match(/loaded|complete/)&&i()},r.onload=i,t.appendChild(r),this)},c._JSLALoader=a,c.extend=function(e,t){typeof e=="string"&&v(t)&&(o[e]=t)},e.fn[r]=function(t){var n=arguments;return m()||e.error(r+" requires Zepto or jQuery >= 1.7"),this.each(function(){var i,s,o="plugin_"+r;i=e.data(this,o),i?(typeof t!="string"&&e.error(r+"::Plugin already initialized on this element, expected method."),s=t,n=Array.prototype.slice.call(n,1),v(i[s])||e.error(r+"::Method "+s+" does not exist"),a.load().is.done(function(){i[s].apply(i,n)})):(i=new h(this,t),e.data(this,o,i))})}})(jQuery,window,document);(function(e){function n(e){return typeof e=="function"}function r(r,i,s,o){var u=e.Deferred();return i=n(i)?i:e.noop,s=n(s)?s:e.noop,t._JSLALoader.load().is.done(function(){function n(e,t){var n=e.location;n=o?e.location.address:e.location.position,t==="OK"?(u.resolve(n),i(n)):(u.reject(),s())}var e={latitude:0,longitude:0},t=nokia.places.search.manager;o?t.reverseGeoCode({latitude:r.latitude||r[0],longitude:r.longitude||r[1],onComplete:n}):t.geoCode({searchTerm:r,onComplete:n})}),u}var t=e.jHERE;t.geocode=function(e,t,n){return r(e,t,n)},t.reverseGeocode=function(e,t,n){return r(e,t,n,!0)}})(jQuery);(function(e){function i(e){return e instanceof Array?{latitude:e[0],longitude:e[1]}:e}var t,n,r={type:"shortest",transportMode:"car",options:"",trafficMode:"default",width:4,color:"#ff6347",marker:{text:"#",textColor:"#fff"}};n=function(n,s,o){var u,a,f;t=t||nokia.maps,n=i(n),s=i(s),o=e.extend({},r,o),f=function(n,r,i){var s,u,a,f,l,c={},h;i=="finished"?(s=n.getRoutes(),f=s[0],a=new t.map.Polyline(f&&f.shape,{pen:new t.util.Pen({lineWidth:o.width,strokeColor:o.color})}),u=new t.map.Container,u.objects.add(a),e.each(f.waypoints,e.proxy(function(t,n){var r=e.extend({},o.marker);o.marker.text==="#"&&(r.text=t+1),this.marker(n.originalPosition,r)},this)),this.map.objects.add(u),l=f.legs&&f.legs.length&&f.legs[0],c.time=l.travelTime,c.length=l.length,c.maneuvers=e.map(l.maneuvers,function(e){return{street:e.streetName,length:e.length,route:e.routeName}}),typeof o.onroute=="function"&&o.onroute.call(this.element,c),h=e.Event("jhere.route",{route:c,target:this.element}),e(this.element).trigger(h)):i=="failed"&&e.error("Failed to calcolate route")},u=new t.routing.Manager,u.addObserver("state",e.proxy(f,this)),a=new t.routing.WaypointParameterList,a.addCoordinate(n),a.addCoordinate(s),o.transportModes=[o.transportMode],u.calculateRoute(a,[o])},e.jHERE.extend("route",n)})(jQuery);(function(e){function a(e){return e instanceof Array?{latitude:e[0],longitude:e[1]}:e}function f(e){return e?(e.pen=e.pen||{},e.brush=e.brush||{},e.pen.strokeColor=e.pen.strokeColor||e.stroke||"#111",e.stroke="solid",e.pen.lineWidth=e.pen.lineWidth||e.thickness||1,e.brush.color=e.brush.color||e.fill,e):e}function l(e,n){e.objects.add(new t.map.Circle(a(n.center),n.radius||1e3,n.style))}function c(e,n){var r=new t.geo.BoundingBox(a(n.topLeft),a(n.bottomRight),!1);e.objects.add(new t.map.Rectangle(r,n.style))}function h(n,r){r.points=e.map(r.points,function(e){return a(e)}),n.objects.add(new t.map.Polyline(r.points,r.style))}function p(n,r){r.points=e.map(r.points,function(e){return a(e)}),n.objects.add(new t.map.Polygon(r.points,r.style))}var t,n,r,i,s,o,u;n=function(n,r){t=t||nokia.maps,u||(u=new t.map.Container,this.map.objects.add(u)),r.style=f(r.style);switch(n){case"circle":l(u,r);break;case"rectangle":c(u,r);break;case"polyline":h(u,r);break;case"polygon":p(u,r);break;default:e.error(n+" not supported")}},r=function(e){n.call(this,"circle",e)},i=function(e){n.call(this,"rectangle",e)},s=function(e){n.call(this,"polyline",e)},o=function(e){n.call(this,"polygon",e)},e.jHERE.extend("shape",n),e.jHERE.extend("circle",r),e.jHERE.extend("rectangle",i),e.jHERE.extend("polyline",s),e.jHERE.extend("polygon",o)})(jQuery);