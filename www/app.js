var FLIUVA=new Object;

/* Visualization App */
window.addEventListener("load",function(){
	//oldUsersPerDay();
	usersPerDay();
	sessionsTable();
});

function id(idx){
	return document.getElementById(idx);
}

function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}
function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate());
}

/* Users-per-day */
function oldUsersPerDay(){
	var xhr=new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open("GET","/get");
	xhr.addEventListener("load",function(){
		var json=JSON.parse(xhr.responseText);
		var dataset=new vis.DataSet();
		/*var data=json.filter(function(){
			
		});*/
		var array=uniqBy(json,function(item){
			return item.SESSION;
		}); // Eventos de sesiones repetidas eliminados (mismos usuarios). Ahora tenemos sesiones únicas y tiempos distintos
		for(var i=0;i<array.length;i++)
		{
			var time=new Date(array[i].TIME);
			var date=ISODateString(time); //time.toISOString().substring(0,time.toISOString().indexOf("T"));
			
			var y;
			if(dataset.get(date)==null)
				y=1;
			else
				y=dataset.get(date).y+1;
			
			console.log(date);
			dataset.update({x: date, id: date, y: y});
		}
		var options = {
			catmullRom: false
		};
		var graph2d = new vis.Graph2d(id("users-per-day"), dataset, options);
	});
	xhr.send();
}

FLIUVA.downloadData=function(cb){
	var xhr=new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open("GET","/get");
	xhr.addEventListener("load",function(){
		var json=JSON.parse(xhr.responseText);
		cb(json);
	});
	xhr.send();
}

FLIUVA.getSessions=function(json){
	var array=uniqBy(json,function(item){
		return item.SESSION;
	});
	return array;
}

FLIUVA.getTimes=function(json){
	var timeSteps=uniqBy(json,function(item){
		var time=new Date(item.TIME);
		return ISODateString(time);
	});
	return timeSteps;
}

FLIUVA.buildData=function(){
	var data=new Object;
	data.labels=new Array;
	data.series=new Array;
	data.series[0]=new Array;
	return data;
}

FLIUVA.forEachDay=function(json,sessions,cb){
	var timeSteps=FLIUVA.getTimes(json);
	for(var i=0;i<timeSteps.length;i++)
	{
		var time=new Date(timeSteps[i].TIME);
		var ok=sessions.filter(function(item){
			var time1=new Date(item.TIME);
			if(ISODateString(time1)===ISODateString(time)){
				return true;
			}else{
				return false;
			}
		});
		cb(time,ok);
	}
}

function usersPerDay(){
	FLIUVA.downloadData(function(json){
		var data=FLIUVA.buildData();
		FLIUVA.forEachDay(json,FLIUVA.getSessions(json),function(time,result){
			data.labels.push(ISODateString(time));
			data.series[0].push(result.length);
		});
		var options = {
		  lineSmooth: false
		};
		new Chartist.Line(".ct-chart",data,options);
	});
}

/* Table for sessions */

function sessionsTable(){
	var table=document.getElementById("sessions");
	var xhr=new XMLHttpRequest();
	xhr.open("GET","/get");
	xhr.addEventListener("load",function(){
		var json=JSON.parse(xhr.responseText);
		var data=uniqBy(json,function(item){
			return item.SESSION;
		});
		for(var i=0;i<data.length;i++)
		{
			var item=data[i];
			var tr=document.createElement("tr");
			var time=document.createElement("td");
			time.textContent=item.TIME;
			var session=document.createElement("td");
			var link=document.createElement("a");
			link.href="/session/"+item.SESSION;
			link.textContent=item.SESSION;
			session.appendChild(link);
			tr.appendChild(time);
			tr.appendChild(session);
			table.appendChild(tr);
		}
	});
	xhr.send();
}
