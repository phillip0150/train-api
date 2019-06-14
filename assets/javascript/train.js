// Create a variable to reference the database
var config = {
  apiKey: "AIzaSyATgpyEE0M3p-QdpAd1VehOCXqLtWPrG0M",
  authDomain: "train-api-583a8.firebaseapp.com",
  databaseURL: "https://train-api-583a8.firebaseio.com",
  projectId: "train-api-583a8",
  storageBucket: "train-api-583a8.appspot.com",
  messagingSenderId: "616981854748",
  appId: "1:616981854748:web:c89629e7d010e619"
};
    
firebase.initializeApp(config);
var database = firebase.database();

//setting empty vars for database
var name;
var dest;
var freq;
var nextTime;
var start;
var away;

//When the submit button is clicked, we want to update our info
$("#submit").on("click", function(event){
  event.preventDefault();

  //Get values of the train data
  name = $("#trainName").val().trim();
  dest = $("#trainDest").val().trim();
  start = $("#trainStartTime").val().trim();
  freq = $("#trainFreq").val().trim();

  //checking to see if user entered a freq thats between 1 720 ,a start time between 0 and 2400, and to make sure fields are not empty
  if (freq > 720 || freq < 1 || !name || !dest || !start || !freq || start >2400 || start < 0){
    $("#fieldError").text("Some fields are empty or incorrect");
    return;
  }
  else{
  //Push these values to the database
  database.ref().push({
  trainName: name, 
  trainDest: dest,
  trainStart: start,
  trainFreq: freq,
  });

    document.getElementById("myForm").reset();
    $(".error").empty();
  }

  

});

  //First we need to get info to data
  //Everytime we add a child, or if a child was added, we want to print it to our html
  database.ref().on("child_added", function(snapshot){
    //We want to append our info to the table (tbody)
    //the next train will arrive; this should be relative to the current time
    //mins away = current time - arrival time

    // Assumptions
    var tFrequency = snapshot.val().trainFreq;
    
    var firstTime = snapshot.val().trainStart;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    //Checking to see if start time is after current time
    if(parseInt(currentTime.format("HHmm"))>parseInt(firstTime)){
      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;

      // Next Train
      nextTime = moment().add(tMinutesTillTrain, "minutes").format("LT");
    }
    else{
    // Minute Until Train
    var tMinutesTillTrain = moment(firstTime, 'HHmm').diff(moment(), "minutes");

    // Next Train
    nextTime = moment(firstTime, "HHmm").format("LT");
    }
    
    $("tbody").append("<tr><td>" + 
      snapshot.val().trainName + "</td>" + "<td>" + 
      snapshot.val().trainDest + "</td>" + "<td>" + 
      snapshot.val().trainFreq + "</td>" + 
      "<td>" + nextTime + "</td>" + 
      "<td>"+ tMinutesTillTrain + "</td>");
});