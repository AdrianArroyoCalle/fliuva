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
	xhr.open("GET","/getdata");
	xhr.addEventListener("load",function(){
		var json=JSON.parse(xhr.responseText);
		/*var data=json.filter(function(){
			
		});*/
		/*var array=uniqBy(json,"SESSION"); // Eventos de sesiones repetidas eliminados (mismos usuarios). Ahora tenemos sesiones únicas y tiempos distintos
		for(var i=;i<array.length;i++)
		{
			var date=array[i].TIME.getFullYear() + "-" + (array[i].TIME.getMonth() + 1) + "-" + array[i].TIME.getDate();
			var dataset=new vis.DataSet();
			dataset.add(date);
		}  */
		var dataset=new vis.DataSet();
		dataset.add("2015-04-03");
		dataset.add("2015-04-03");
		dataset.add("2014-09-25");
		var options = {
			start: '2014-06-10',
			end: '2015-06-18'
		};
		var graph2d = new vis.Graph2d(id("users-per-day"), dataset, options);
	});
	xhr.send();
}
