function Line(){
  
  var _time, _number, _translateX, _className;
  var h_line = h*0.2;

  //set scale
  var scaleX = d3.scaleBand()
      .range([0,w*0.5]);

  var scaleY = d3.scaleLinear()
      .range([h_line,0])
  
  //set axis
  var axisX = d3.axisBottom()
      .scale(scaleX)
      .tickSize(-h_line);
  var axisY = d3.axisLeft()
      .scale(scaleY)
      .tickSize(-(w*0.5));

  var path;

  function exports(selection){
      
  	  var plot = selection
  	      .append('svg')
  	      .attr('width',W)
  	      .attr('height',H*0.23)
  	      .append('g')
  	      .attr('class','line_area')
  	      .attr('transform','translate(' + W*0.28 + ',40)');

      //data
      var datum = selection.datum() || [];

      scaleX.domain(_time);

      scaleY.domain(_number);

	  path = d3.line()
	      .x(function(d){return scaleX(d.key)})
	      .y(function(d){return scaleY(d.values.length)});


	  plot.append('g').attr('class','axis axis-x')
            .attr('transform','translate(0,'+h_line+')')
            .call(axisX);
      
      plot.append('g').attr('class','axis axis-y')
            .call(axisY);

      //draw the path      

      for(i=0;i<datum.length;i++){
          
          plot.append('path')
              .attr('class',_className)
              .attr('transform','translate(' + _translateX + ',0)')
              .datum(datum[i].values)
              .attr('d',path);
      }

      d3.selectAll('.'+_className)
        .on('mouseenter',function(d){

            d3.select('.line_hovered').remove();
            d3.selectAll('.n_of_crime').remove();
            d3.selectAll('.des_tooltip').remove();
            _drawHoveredLine(plot,d);
         	_drawText(plot,d);
         	_crimeDescription(plot,d);

        })

  }//exports

  exports.time = function(_){
      if(!arguments.length) return _time;
	     _time = _;
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
  
  exports.className = function(_){
  	  if(!arguments.length) return _className;
	     _className  = _;
	  return this;
  }

  function _drawText(plot,d){

	  plot.selectAll('.n_of_crime')
	      .data(d,function(d){return d.key})
	      .enter()
	      .append('text')
	      .attr('class','n_of_crime')
	      .attr('transform','translate(' + _translateX + ',0)')
	      .attr('x',function(d){return scaleX(d.key)})
	      .attr('y',function(d){return scaleY(d.values.length+60)})
	      .text(function(d){return d.values.length});

  }//_drawText
  
  function _drawHoveredLine(plot,d){

	  plot.append('path')
	      .attr('class','line_hovered')
	      .attr('transform','translate(' + _translateX + ',0)')
	      .datum(d,function(d){return d.key})
	      .transition()
	      .attr('d',path);

  }//_drawHoveredLine

  function _crimeDescription(plot,d){
     
      var selectedCrime = d[0].values[0].offense,
          crimeCases = 0;

      for(i=0; i<d.length; i++){
          crimeCases = crimeCases + d[i].values.length;
      }

      last_value = d[d.length-1].values.length;

      plot.append('text')
          .attr('class','des_tooltip')
          .text(selectedCrime +': '+crimeCases)
          .attr('x',w*0.51)
          .attr('y',function(d){return scaleY(last_value)})
          .style('fill',main_color)
     
  }//_crimeDescription

  return exports;

}


