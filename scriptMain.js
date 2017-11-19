
//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var W = document.getElementById('container').clientWidth,
    H = document.getElementById('container').clientHeight,
    w = W - m.r - m.l,
    h = H - m.t - m.b;

var main_color = '#CE5374';

var offense;

var hour = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];


//Import data and parse
d3.queue()
  .defer(d3.csv,'data/dc_crime_2016.csv',parse)
  .await(dataloaded);

function dataloaded(err, crime_2016){
    
    crime_offense = d3.nest().key(function(d){return d.offense})
        .entries(crime_2016);

    crime_offense.sort(function(a,b){return b.values.length - a.values.length})

    offense = crime_offense.map(function(d){return d.key});

    bar_type = Bar()
      .type(offense)
      .number([0,15000])
      .translateX(22);

    d3.select('#crime_type').datum(crime_offense).call(bar_type);

    //sort data for line chart
    crime_sorted_hour = crime_2016.sort(function(a,b){return a.hour - b.hour});

    crime_offense_hour = d3.nest().key(function(d){return d.offense})
        .key(function(d){return d.hour})
        .entries(crime_sorted_hour);

    crime_offense_hour = crime_offense_hour
        .filter(function(d){return d.values.length > 20});
    
    //Call Line()
    line_hour = Line()
       .time(hour)
       .number([0,1100])
       .translateX(12.5)
       .className('hour_not_hovered');
    
    d3.select('#crime_hour').datum(crime_offense_hour).call(line_hour);

    //Call Map()
    crime_map = Map();
    d3.select('#map').datum(crime_2016).call(crime_map);

    //Back to top button function
    $('#btn_back').click(function(){
      $('html,body').animate({
         scrollTop : 0
      }, 250);
      return false
    })
    

}//dataloaded

function parse(d){

   return {
     date: parseTime(d.START_DATE),
     month:+d['occurred_month'],
     hour:+d['occurred_hour'],
     long:+d['XBLOCK'],
     lat:+d['YBLOCK'],
     crimeType:d['crimetype'],
     offense:d['offenseType']
   };
}


function parseTime(timeStr){

    var time = timeStr.split(' ')[1].split(':'),
        hour = +time[0],
        min = +time[1];

    var date = timeStr.split(' ')[0].split('/'),
        year = date[2],
        month = date[0],
        day = date[1];
        
    // return new Date(parseInt(year),parseInt(month-1),parseInt(day));
    return new Date(year,month-1,day,hour,min);

} 



