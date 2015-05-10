var hotelRating = (function(){
    var privateVars = {
        yqlUrl : 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.html.cssselect%20where%20url%3D%22',
        tripAdviserBaseUrl : 'http%3A%2F%2Fwww.tripadvisor.com%2F',
        userQuery : '',
        yqlCss : '%22%20and%20css%3D%22.sprite-rating_rr%20img%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=',
        rating : 0,
        waitingTimer : null
    };
    var privateFunctions = {
      sendAjax : function(url,callback){
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
              if (xhr.readyState == XMLHttpRequest.DONE ) {
                  if(xhr.status == 200){
                      callback(xhr.responseText);
                  } else  {
                      console.log('Error');
                  }
              }
          };
          xhr.open("GET", url, true);
          xhr.send();
      },
      reset : function(){
          privateVars.rating = 0;
          if(!privateVars.ratingImages) privateVars.ratingImages = document.querySelectorAll('.halfStar');
          for(var i=0;i<10;i++){
              privateVars.ratingImages[i].src = (i%2==0)?'star_left_grey.png':'star_right_grey.png';
          }
          if(!privateVars.ratingDom) privateVars.ratingDom = document.querySelector('#rating');
          privateVars.ratingDom.style.display='none';
      },
      getData : function(userQuery){
          this.reset();
          privateVars.userQuery = encodeURIComponent(encodeURIComponent(userQuery));
          if (privateVars.userQuery.trim()) {
              var url = privateVars.yqlUrl + privateVars.tripAdviserBaseUrl + privateVars.userQuery + privateVars.yqlCss;
              this.sendAjax(url, this.getRating);
          }
      },
      getRating : function(responseText){
          if(responseText){
              var response = JSON.parse(responseText);
              if(response.query && response.query.results && response.query.results.results){
                  var allRatings = response.query.results.results.img;
                  if(allRatings instanceof Array) privateVars.rating = allRatings[0].content;
                  else privateVars.rating = allRatings.content;
              }
          }
          console.log(privateVars.rating);
          privateFunctions.updateDom();
      },
      updateDom : function(){
          var rating = parseFloat(privateVars.rating);
          if(!privateVars.ratingImages) privateVars.ratingImages = document.querySelectorAll('.halfStar');
          if(rating>0){
              for(var i= 0,j=0;i<rating;i=i+0.5){
                  privateVars.ratingImages[j].src = privateVars.ratingImages[j].src.replace('_grey','');
                  j++;
              }
              if(!privateVars.ratingDom) privateVars.ratingDom = document.querySelector('#rating');
              privateVars.ratingDom.style.display='block';
          }

      }
    };
    return {
        init : function(){
            document.querySelector('#hotelName').onkeyup = function(){
                var self = this;
                clearTimeout(privateVars.waitingTimer);
                privateVars.waitingTimer = setTimeout(function(){
                    privateFunctions.getData(self.value);
                },500);
            };

        }
    }
})();

window.onload=function(){
  hotelRating.init();
};