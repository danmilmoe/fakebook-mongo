// Query 7
// Find the number of users born in each month using MapReduce

let num_month_mapper = function () {
    emit(this.MOB, 1);
};

let num_month_reducer = function (key, values) {
    return Array.sum(values);
};

let num_month_finalizer = function (key, reduceVal) {
    // We've implemented a simple forwarding finalize function. This implementation
    // is naive: it just forwards the reduceVal to the output collection.
    // TODO: Feel free to change it if needed.
    return reduceVal;
};

/*Find number of users born in each month using map reduce
● Mapper
○ Given access to a user (this) what can we return that will give us useful information?
○ Emit Tuple: (key, value)
○ Hint: Think about a way to mark that this user was born in this month
● Reducer
○ Given access to a set of values that correspond to a key, how do we combine these values?
○ Return value
■ Should match the same time of value output by the mapper
○ Hint: The value output at the end of this method should be the number of users (that we know
of) born in the month denoted by key
● Finalizer
○ Get the final answers for each key ready to return
○ No change needed for query 7 :)
*/
