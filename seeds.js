var mongoose = require("mongoose");
var City = require("./models/city");
var Comment   = require("./models/comment");

// Data set for the cities
var data = [
        {
            name: "St. Louis", 
            image: "https://upload.wikimedia.org/wikipedia/commons/d/d0/St._Louis_skyline_September_2008.jpg",
            description: "St. Louis (/seɪnt ˈluːɪs/)[10][11][12] is an independent city[13] and major U.S. port in the state of Missouri, built along the western bank of the Mississippi River, which marks Missouri's border with Illinois. The city had an estimated 2016 population of 311,404,[14] and is the cultural and economic center of the Greater St. Louis area (home to 2,916,447 people), making it the largest metropolitan area in Missouri and the 19th-largest in the United States."
        },
        {
            name: "New Orleans", 
            image: "https://upload.wikimedia.org/wikipedia/commons/b/ba/St._Louis_Cathedral_%28New_Orleans%29.jpg",
            description: "New Orleans (/njuː ˈɔːrli.ənz, -ˈɔːrˈliːnz, -ˈɔːrlənz/,[4][5] or /ˈnɔːrlənz/)[6] is a major United States port and the largest city and metropolitan area in the state of Louisiana. The population of the city was 343,829 as of the 2010 U.S. Census.[7][8] The New Orleans metropolitan area (New Orleans–Metairie–Kenner Metropolitan Statistical Area) had a population of 1,167,764 in 2010 and was the 46th largest in the United States.[9] The New Orleans–Metairie–Bogalusa Combined Statistical Area, a larger trading area, had a 2010 population of 1,452,502.[10] Before Hurricane Katrina, Orleans Parish was the most populous parish in Louisiana. As of 2015,[11] it ranked third, trailing neighboring Jefferson Parish and East Baton Rouge Parish.[11]"
        },
        {
            name: "Chicago",
            image: "https://c1.staticflickr.com/5/4248/34001904163_206220b8fd_b.jpg",
            description: "Chicago (/ʃɪˈkɑːɡoʊ/ (About this sound listen) or /ʃɪˈkɔːɡoʊ/), officially the City of Chicago, is the third-most populous city in the United States. With over 2.7 million residents, it is also the most populous city in both the state of Illinois and the Midwestern United States. It is the county seat of Cook County. The Chicago metropolitan area, often referred to as Chicagoland, has nearly 10 million people and is the third-largest in the United States. Chicago has often been called a global architecture capital[6][7] and is considered one of the most important business centers in the world.[8]"
        }
]

function seedDB(){
    City.remove({}, function(err){
        if (err){
            console.log(err)
        } 
        console.log("City objects successfully removed");
        
        // After removal 
        // add some City objects
        data.forEach(function(seed) {
            City.create(seed, function(err, newCity){
                if (err){
                    console.log(err);
                } else {
                    console.log('added a campground');
                    
                    // Add a comment to the city
                    Comment.create({
                                        text: "I lived here",
                                        author: 'Gaetano'
                                  }, function(err, newComment){
                                      if (err){
                                          console.log(err);
                                      } else {
                                          newCity.comments.push(newComment._id);
                                          newCity.save();
                                          console.log("new comment created!");
                                      }
                                  });
                } // end else
            }); // end City.create
        }); // end .forEach add
    }); // end remove
}; // End seedDB

// Export
module.exports = seedDB;