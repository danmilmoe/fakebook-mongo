// Query 6
// Find the average friend count per user.
// Return a decimal value as the average user friend count of all users in the users collection.

function find_average_friendcount(dbname) {
    db = db.getSiblingDB(dbname);

    var data = db.users.find({}, { user_id: 1, friends: 1, _id: 0 }).toArray();

    var total = 0;
    for (var i = 0; i < data.length; i++) {
        total += data[i].friends.length;
    }

    return total / data.length;
}
