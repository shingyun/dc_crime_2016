function Bar(){
  
  var _type, _number, _translateX;
  var h_bar = h*0.2;

  //set scale
  var scaleX = d3.scaleBand()
      .range([0,w*0.55]);

  var scaleY = d3.scaleLinear()
      .range([h_bar,0])
  
  //set axis
  var axisX = d3.axisBottom()
      .scale(scaleX)
      .tickSize(-h_bar);
  var axisY = d3.axisLeft()
      .scale(scaleY)
      .tickSize(-(w*0.55));

  var path;

  function exports(selection){
      
  	  var plot = selection
  	      .append('svg')
  	      .attr('width',W)
  	      .attr('height',H*0.23)
  	      .append('g')
  	      .attr('class','line_area')
  	      .attr('transform','translate(' + W*0.27 + ',25)');

      //data
      var datum = selection.datum() || [];

      console.log(datum);

      scaleX.domain(_type);

      scaleY.domain(_number);

      plot.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h_bar+')')
            .call(axisX);
      
      plot.append('g').attr('class','axis axis-y')
            .call(axisY);

      plot.selectAll('.bar') 
          .data(datum)
          .enter()
          .append('rect')
          .attr('class','bar')
          .attr('transform','translate(' + _translateX + ',0)')
          .attr('x',function(d){return scaleX(d.key)})
          .attr('y',function(d){return scaleY(d.values.length)})
          .attr('width',30)
          .attr('height',function(d){return h_bar-scaleY(d.values.length)})
          .style('fill',main_color)
          .style('opacity',0.8);


  }//exports

  exports.type = function(_){
      if(!arguments.length) return _type;
	     _type = _;
	  return this;
  }

  exports.number = function(_){
      if(!arguments.length) return _number;
       _number = _;
    return this;
  }

  exports.translateX = function(_){
      if(!arguments.length) return _translateX;
       _translateX  = _;
    return this;
  }


  return exports;

}


