(function () {

  // define constants here
  var DATA_URL= 'https://api.myjson.com/bins/119onn';
  var ONGOING= 'ONGOING';
  var UPCOMING= 'UPCOMING';
  var ONGOING_PARENT_ID= 'ongoing-top-parent';
  var UPCOMING_PARENT_ID= 'upcoming-top-parent';
  var ONGOING_ID= 'ongoing';
  var UPCOMING_ID= 'upcoming';
  var CHALLENGE_TYPE_ID = 'challenge-type'
  var CHALLENGE_TYPE_PARENT_ID = 'challenge-type-parent';

  var DEBUG = false;

  function debug(data){
    if(DEBUG){
        console.log(data);
    }
  }

    var json ;

  var settings = {
    "crossDomain": true,
    "url": "https://lit-spire-99205.herokuapp.com/search?budget=123&dish=Biryani",
    "method": "GET",
    "headers": {
    }
}

$.ajax(settings).done(function(response) {
    json=response;
    //console.log(response);
});

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

/*$.getJSON("./venture.json", function(json) {
    console.log(json); // this will show the info it in firebug console
});*/

window.onload = function() {
  var startPos;
  var geoSuccess = function(position) {
    startPos = position;
    var settings = {
    "crossDomain": true,
    "url": "https://lit-spire-99205.herokuapp.com/setlocation/?lat="+position.coords.latitude+"&long="+position.coords.longitude+"&user=testuser",
    "method": "POST",
    "headers": {
    }};
    $.ajax(settings).done(function(response) {
      json=response;
  });
    console.log(startPos);

  };
  var geoError = function(error) {
    console.log('Error occurred. Error code: ' + error.code);
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

  var myIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
    myIndex++;
    if (myIndex > x.length) {myIndex = 1}    
    x[myIndex-1].style.display = "block";  
    setTimeout(carousel, 2000); // Change image every 2 seconds
}
};

  var init = function(url_text) {
      //getGeoLocationOfUser();
      document.getElementById(ONGOING_PARENT_ID).style.display = 'none';
      document.getElementById(UPCOMING_PARENT_ID).style.display = 'none';
      document.getElementById(CHALLENGE_TYPE_PARENT_ID).style.display = 'none';
      reset();
      document.getElementById('indicator').style.display = 'block';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url_text, true);
      xhr.send();
      new UISearch( document.getElementById( 'sb-search' ) );
      var settings = {
    "crossDomain": true,
    "url": "https://lit-spire-99205.herokuapp.com/search?budget=123&dish=Biryani",
    "method": "GET",
    "headers": {
    }};
    $.ajax(settings).done(function(response) {
    json=response;
    //alert( "success" );
    //console.log(response);
});
   
      xhr.onreadystatechange = function () {
          var json_response = JSON.parse(xhr.responseText);
          var json = json_response.data;
          document.getElementById('indicator').style.display = 'none';
          reset();
          populateDiv(ONGOING_ID, ONGOING, json);
          populateDiv(UPCOMING_ID, UPCOMING, json);
          populateChallengeStatusOptions(json);

          var selector = document.getElementById(CHALLENGE_TYPE_ID);
          selector.addEventListener('change', selectionChanged, false)
          selector.myParams = json;
          debug('population done');
          var ongoing_isempty = hideIfEmpty(ONGOING_PARENT_ID, ONGOING_ID);
          var upcoming_isempty = hideIfEmpty(UPCOMING_PARENT_ID, UPCOMING_ID);
          debug('empty ones are hid');
          if(!ongoing_isempty){
            debug('Ongoing not empty');
            document.getElementById(ONGOING_PARENT_ID).style.display = 'block';
          }
          if(!upcoming_isempty){
            debug('Upcoming not empty');
            document.getElementById(UPCOMING_PARENT_ID).style.display = 'block';
          }
          if(!ongoing_isempty || !upcoming_isempty){
            document.getElementById(CHALLENGE_TYPE_PARENT_ID).style.display = 'block';
          }
      };
  };

  var hideIfEmpty = function(parent_id, div_id) {
    var div = document.getElementById(div_id);
    if (!div.hasChildNodes()) {
      document.getElementById(parent_id).style.display = 'none';
      return 1;
    }
    else{
        document.getElementById(parent_id).style.display = 'block';
        return 0;
    }
  };

  var selectionChanged = function(data) {
    var requiredChallenge = document.getElementById(CHALLENGE_TYPE_ID).value;
    console.log(requiredChallenge);
    reset();

    populateDiv(ONGOING_ID, ONGOING, data.target.myParams, requiredChallenge);
    populateDiv(UPCOMING_ID, UPCOMING, data.target.myParams, requiredChallenge);

    hideIfEmpty(ONGOING_PARENT_ID, ONGOING_ID);
    hideIfEmpty(UPCOMING_PARENT_ID, UPCOMING_ID);
  };

  var populateChallengeStatusOptions = function(json) {

    var challengesType=[];
    var tempList = "";
    for (i = 0, len = json.length; i < len; i++) {
      e=json[i];

      if (tempList.search(e.type) >= 0) {
      } else { //if uniqure
        challengesType.push(e.type);
        console.log(e.type);
        tempList = tempList + e.type + ";"
      }
    }

    clearDiv(CHALLENGE_TYPE_ID);

    //Add the header message before adding the types of challenges
    var option = document.createElement('option');
    option.text = 'All';
    document.getElementById(CHALLENGE_TYPE_ID).add(option, 0);

    for (i = 0; i < challengesType.length; i++) {

      var option = document.createElement('option');
      option.text = challengesType[i];
      document.getElementById(CHALLENGE_TYPE_ID).add(option);
    }
  };

  var getCorrectRestaurentArray = function(json){
    for(var i=0;i<4;i++){
      if(json.restaurants[i].title.length>0 && json.restaurants[i].restaurants.length>0)
    {
      return json.restaurants[i];
    }
    }
  }


  var populateDiv = function(div_id, challenge_status, json, requiredChallengeType) {
     json_sorted = getCorrectRestaurentArray(json).restaurants.sort(function (a,b){
      return parseFloat(b.avg_rating) - parseFloat(a.avg_rating);
    });
    for(i = 0, len = json_sorted.length; i < len; i++) {
      e = json_sorted[i];
      if (requiredChallengeType === 'All' || typeof requiredChallengeType === 'undefined') {
        if( e.id >0) { 
          document.getElementById(div_id).appendChild(create_node(e));
        }
      } else {
        if( (e.status == challenge_status) || e.type === requiredChallengeType) {

          debug(e);
          document.getElementById(div_id).appendChild(create_node(e));
        }
      }
    }
  };


      /**
       * Clears the div elements
       */
  var reset = function() {
   document.getElementById(ONGOING_PARENT_ID).style.display = 'block';
   document.getElementById(ONGOING_PARENT_ID).style.display = 'block';
   clearDiv(ONGOING_ID);
   clearDiv(UPCOMING_ID);
  };

  var clearDiv = function (div_id) {
    node = document.getElementById(div_id);
    //In every iteration, removes the last node.
    if (node === null){
        debug(div_id);
    }
    else{
        while(node.hasChildNodes()) {
          node.removeChild(node.lastChild);
        }
    }
  };

  window.search_function = function(text){
    init("https://lit-spire-99205.herokuapp.com/search?budget=123&dish="+text);
  }


  // create a new node for chrome extension.
  var create_node = function (e) {
    var element = document.createElement('div'),
    // to be modified
    str = "<div class='notification-item'>"+
            "<div class='sub-heading'>" +
              "<a href='" + "http://www.swiggy.com/bangalore/" +e.slugs.restaurant+ "' target='_blank' class='underline-hover'>" + e.name + "</a>"+
            "</div>" +"<div style=\"float: right; clear: left;\"><img src=https://res.cloudinary.com/swiggy/image/upload/c_scale,f_auto,fl_lossy,h_55,q_auto,w_105/"+e.cloudinaryImageId+" /></div>"+
            "<font color=\"#006600\"> " + e.area +
            
            "<br />" + e.city +
             "<br/>" +
             "rating: "+ e.avg_rating +" "+e.maxDeliveryTime+"min"+
             "<br />"+
          "</div>";

    element.innerHTML = str;
    return element;
  };

  document.addEventListener('DOMContentLoaded', function () {
      init("https://lit-spire-99205.herokuapp.com/search?budget=123&dish=Biryani");
  });

})();
