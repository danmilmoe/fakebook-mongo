// Query 8
// Find the city average friend count per user using MapReduce.

let city_average_friendcount_mapper = function () {
    emit(this.hometown.city, { count: 1, "num_friends": this.friends.length });
};

let city_average_friendcount_reducer = function (key, values) {
    var reducedVal = { count: 0, num_friends: 0 };

    for (var idx = 0; idx < values.length; idx++) {
        reducedVal.count += values[idx].count;
        reducedVal.num_friends += values[idx].num_friends;
    }
    return reducedVal;
};

let city_average_friendcount_finalizer = function (key, reducedVal) {
    // We've implemented a simple forwarding finalize function. This implementation
    // is naive: it just forwards the reduceVal to the output collection.
    // TODO: Feel free to change it if needed.
    var average_friend_count = 1.0 * (reducedVal.num_friends / reducedVal.count);
    return average_friend_count;
};
/*Find average friend count per city
● Mapper
○ Given access to a user (this) what can we return that will give us useful information?
○ Emit Tuple: (key, value)
○ Hint: Value can be a tuple in it of itself!
● Reducer
○ Given access to a set of values that correspond to a key, how do we combine these values?
○ Return value - should match the same time of value output by the mapper
○ Hint: The reducer can be called multiple times during execution
■ We can take intermediate sums, but not intermediate averages
● Finalizer
○ Get the final answers for each key ready to return
○ Small change needed for query 8
○ Hint: We can’t compute an average in the reducer, but we can in the finalizer
*/