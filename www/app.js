/* Visualization App */
window.addEventListener("load",function(){
	usersPerDay();
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

/* Users-per-day */
function usersPerDay(){
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
			var date=time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
			
			dataset.update({x: date, id: date, y: (dataset.get(date).y++) || 1});
		}
		/*var dataset=new vis.DataSet();
		dataset.add("2015-04-03");
		dataset.add("2015-04-03");
		dataset.add("2014-09-25");*/
		var options = {
			start: '2014-06-10',
			end: '2015-06-18'
		};
		var graph2d = new vis.Graph2d(id("users-per-day"), dataset, options);
	});
	xhr.send();
}
