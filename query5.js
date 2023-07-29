// Query 5
// Find the oldest friend for each user who has a friend. For simplicity,
// use only year of birth to determine age, if there is a tie, use the
// one with smallest user_id. You may find query 2 and query 3 helpful.
// You can create selections if you want. Do not modify users collection.
// Return a javascript object : key is the user_id and the value is the oldest_friend id.
// You should return something like this (order does not matter):
// {user1:userx1, user2:userx2, user3:userx3,...}

function oldest_friend(dbname) {
    db = db.getSiblingDB(dbname);

    let results = {};

    db.users.aggregate([
        { $project: { _id: 0, user_id: 1, friends: 1 } },
        { $unwind: "$friends" },
        { $out: "flat_users" }
    ]);

    // create bidirectional friendship
    db.flat_users.find().forEach(function (user) {
        // insert original frienship
        db.bidirectional_friends.insertOne({ user_id: user.user_id, friends: user.friends });
        // insert new frienship
        db.bidirectional_friends.insertOne({ user_id: user.friends, friends: user.user_id });
    });

    db.bidirectional_friends.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "friends",
                foreignField: "user_id",
                as: "friends_bday"
            }
        },
        {
            $project: {
                _id: 0,
                user_id: 1,
                friends: 1,
                "friends_bday.YOB": 1
            }
        },
        { $sort: { user_id: 1, "friends_bday.YOB": 1, friends: 1 } },
        {
            $group: {
                _id: "$user_id",
                oldest_friend: { $first: "$friends" }
            }
        }
    ]).forEach(function (doc) {
        results[doc._id] = doc.oldest_friend;
    });
    return results;
}