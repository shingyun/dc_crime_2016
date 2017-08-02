function Map(){

  //add map
  var crime_map = L.map('map').setView([38.899991, -77.008846], 11.5);

  L.tileLayer('https://api.mapbox.com/styles/v1/smilein/cj5mvkhbf3sk12rmlebp1csnp/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21pbGVpbiIsImEiOiJjaXpuODFsdTEwMzF3MnFvMTJsd2RodTFpIn0.g0uREfYE5sFsG5N3dUe_VQ', {
	  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	  maxZoom: 15,
	  minZoom: 11,
	  id: 'mapbox.streets',
	  accessToken: 'pk.eyJ1Ijoic21pbGVpbiIsImEiOiJjaXpuODFsdTEwMzF3MnFvMTJsd2RodTFpIn0.g0uREfYE5sFsG5N3dUe_VQ'
  }).addTo(crime_map);

  function exports(selection){
      //data
      var datum = selection.datum() || [];

      // datum.sort()

	  //nest data by offense
	  crimeByOffense = d3.nest().key(function(d){return d.offense})
	      .entries(datum);
      
      //filter out Arson
	  // crimeByOffense = crimeByOffense.filter(function(d){return d.values.length > 100;})

      crimeByOffense =  crimeByOffense.sort(function(a,b){
        return b.values.length - a.values.length;
      });
	 
	  //create menu
	  d3.select('.menu')
	    .selectAll('div')
	    .data(crimeByOffense)
	    .enter()
	    .append('div')
	    .attr('class', function(d){return 'menu_type '+d.key})
	    .html(function(d){return d.key})
	    .on('mouseenter',function(d){
	      d3.select('.menu_hovered').classed('menu_hovered',false);
	      d3.select(this).classed('menu_hovered',true);
	    })
	    .on('click',function(d){
	        d3.select('.menu_clicked').classed('menu_clicked',false);
	        d3.select(this).classed('menu_clicked',true);
	        d3.select('#nOfCrime').html(d.values.length);
	        _drawMap(d.values);
	    })
	    .on('mouseleave',function(d){
	        d3.select(this).classed('menu_hovered',false);
	    })

	  //import data by defult  
	  var theft = [];

	  theft = crimeByOffense.filter(function(d){return d.key == 'Theft'})
	      .map(function(d){return d.values});

	  _drawMap(theft[0]);

	  d3.select('.Theft')
	    .classed('menu_clicked',true);
	  
	  d3.select('#nOfCrime')
	    .html(theft[0].length);

	  d3.select('.menu')
	    .append('p')
	    .attr('class','source')
	    .html('Source: DC.gov, Kaggle');

  }//exports

  function _drawMap(d){

  	d3.selectAll('.leaflet-interactive').remove();
    
    for(var i=0; i<d.length; i++){
         L.circle([d[i].lat,d[i].long],{
         	stroke: false,
            fillColor: '#D5272E',
            fillOpacity: 0.5,
            radius: 50
         }).addTo(crime_map);
    }
  }//_drawMap

  return exports;
}

