// Query 2
// Unwind friends and create a collection called 'flat_users' where each document has the following schema:
// {
//   user_id:xxx
//   friends:xxx
// }
// Return nothing.

function unwind_friends(dbname) {
    db = db.getSiblingDB(dbname);

    db.users.aggregate([
        { $project: { _id: 0, user_id: 1, friends: 1 } },
        { $unwind: "$friends" },
        { $out: "flat_users" }
    ]);

    return;
}
