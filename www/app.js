/* Visualization App */
window.addEventListener("load",function(){
	oldUsersPerDay();
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

function usersPerDay(){
	var xhr=new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open("GET","/get");
	xhr.addEventListener("load",function(){
		var json=JSON.parse(xhr.responseText);
		var array=uniqBy(json,function(item){
			return item.SESSION;
		});
		var timeSteps=uniqBy(json,function(item){
			return item.TIME;
		});
		var data={};
		data.labels=[];
		data.series=[];
		data.series[0]=[];
		for(var i=0;i<timeSteps.length;i++){
			var ok=array.filter(function(item){
				if(item.TIME===timeSteps[i].TIME){
					return true;
				}else{
					return false;
				}
			});
			data.labels.push(timeSteps[i].TIME);
			data.series[0].push(ok.length);
		}
		/*for(var i=0;i<array.length;i++){
			var time=new Date(array[i].TIME);
			var date=ISODateString(time);
			//FILTRO DE TODO
		}*/
		new Chartist.Line(".ct-chart",data);
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
