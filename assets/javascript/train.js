// Initialize Firebase (YOUR OWN APP)
// Make sure that your configuration matches your firebase script version
// (Ex. 3.0 != 3.7.1)

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
    
      //Push these values to the database
      database.ref().push({
        trainName: name, 
        trainDest: dest,
        trainStart: start,
        trainFreq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    
    });

    //First we need to get info to data
    //Everytime we add a child, or if a child was added, we want to print it to our html
    database.ref().on("child_added", function(snapshot){
      //We want to append our info to the table (tbody)
      //the next train will arrive; this should be relative to the current time
      //mins away = current time - arrival time
      settingFreq = moment(snapshot.val().trainFreq, "mm").format("HHmm");
      nextTime = moment().add(settingFreq, 'minutes').format("LT");
      console.log("settingTime: " + nextTime);


      console.log(moment().format("LT"));
      
      $("tbody").append("<tr><td>" + 
        snapshot.val().trainName + "</td>" + "<td>" + 
        snapshot.val().trainDest + "</td>" + "<td>" + 
        snapshot.val().trainFreq + "</td>" + 
        "<td>" + nextTime + "</td>" + 
        "<td>Mins away would go here</td>");
    });