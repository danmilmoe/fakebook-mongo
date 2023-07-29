// Query 4
// Find user pairs (A,B) that meet the following constraints:
// i) user A is male and user B is female
// ii) their Year_Of_Birth difference is less than year_diff
// iii) user A and B are not friends
// iv) user A and B are from the same hometown city
// The following is the schema for output pairs:
// [
//      [user_id1, user_id2],
//      [user_id1, user_id3],
//      [user_id4, user_id2],
//      ...
//  ]
// user_id is the field from the users collection. Do not use the _id field in users.
// Return an array of arrays.

function suggest_friends(year_diff, dbname) {
    db = db.getSiblingDB(dbname);

    let pairs = [];
    db.users.find().forEach(function (userA) {
        if (userA.gender === "male") {
            // get hometown city and YOB for userA
            var hometown_city = userA.hometown.city;
            var userA_YOB = userA.YOB;
            let userA_id = userA.user_id;
            var userA_friends = userA.friends;

            db.users.find({
                // same hometown city, gender = female
                "hometown.city": hometown_city,
                "gender": "female"
            }).forEach(function (userB) {
                var userB_id = userB.user_id;
                var userB_YOB = userB.YOB;
                var userB_friends = userB.friends;
                // look through user A's friends
                var search;
                var exists = pairs.includes([userA_id, userB_id]);
                if (userA_id < userB_id) {
                    search = userA_friends.indexOf(userB_id);
                } else {
                    search = userB_friends.indexOf(userA_id);
                }
                if (search === -1 && Math.abs(userA_YOB - userB_YOB) < year_diff && !exists) {
                    pairs.push([userA_id, userB_id]);
                }
            });
        }
    });
    // TODO: implement suggest friends
    // user A is "male" and user B is "female"
    // the difference between their year of births (YOB) is less than the specified year_diff
    // user A and user B are not friends
    // user A and user B are from the same hometown.city

    return pairs;
}
