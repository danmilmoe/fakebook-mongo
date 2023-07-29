import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.TreeSet;
import java.util.Vector;
import org.json.JSONArray;
import org.json.JSONObject;

public class GetData {

    static String prefix = "project3.";

    // You must use the following variable as the JDBC connection
    Connection oracleConnection = null;

    // You must refer to the following variables for the corresponding
    // tables in your database
    String userTableName = null;
    String friendsTableName = null;
    String cityTableName = null;
    String currentCityTableName = null;
    String hometownCityTableName = null;

    // DO NOT modify this constructor
    public GetData(String u, Connection c) {
        super();
        String dataType = u;
        oracleConnection = c;
        userTableName = prefix + dataType + "_USERS";
        friendsTableName = prefix + dataType + "_FRIENDS";
        cityTableName = prefix + dataType + "_CITIES";
        currentCityTableName = prefix + dataType + "_USER_CURRENT_CITIES";
        hometownCityTableName = prefix + dataType + "_USER_HOMETOWN_CITIES";
    }

    // TODO: Implement this function
    @SuppressWarnings("unchecked")
    public JSONArray toJSON() throws SQLException {

        // This is the data structure to store all users' information
        JSONArray users_info = new JSONArray();

        try (Statement stmtU = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                ResultSet.CONCUR_READ_ONLY)) {
            // Your implementation goes here....

            // Query for user_id (int), first_name (String), last_name (String), gender
            // (String), YOB (int), MOB (int), DOB (int)
            ResultSet rstU = stmtU.executeQuery(
                    "SELECT user_id, first_name, last_name, gender, year_of_birth, month_of_birth, day_of_birth " +
                            "FROM " + userTableName);

            while (rstU.next()) {
                JSONObject user = new JSONObject();

                int user_id = rstU.getInt(1);
                String first_name = rstU.getString(2);
                String last_name = rstU.getString(3);
                String gender = rstU.getString(4);
                int yob = rstU.getInt(5);
                int mob = rstU.getInt(6);
                int dob = rstU.getInt(7);

                user.put("user_id", user_id);
                user.put("first_name", first_name);
                user.put("last_name", last_name);
                user.put("gender", gender);
                user.put("YOB", yob);
                user.put("MOB", mob);
                user.put("DOB", dob);

                // Query for current (JSONObject) that contains: city, state, country
                Statement stmtCC = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                        ResultSet.CONCUR_READ_ONLY);
                ResultSet rstCC = stmtCC.executeQuery(
                        "SELECT C.city_name, C.state_name, C.country_name " +
                                "FROM " + cityTableName + " C, " + currentCityTableName + " CC " +
                                "WHERE CC.user_id = " + user_id + " AND CC.CURRENT_CITY_ID = C.city_id");
                // TODO: else make an empty object
                if (rstCC.next()) {
                    JSONObject current = new JSONObject();
                    String ccity = rstCC.getString(1);
                    String cstate = rstCC.getString(2);
                    String ccountry = rstCC.getString(3);
                    current.put("city", ccity);
                    current.put("state", cstate);
                    current.put("country", ccountry);
                    user.put("current", current);
                }
                rstCC.close();
                stmtCC.close();
                // Query for hometown (JSONObject) that contains: city, state, country
                Statement stmtHC = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                        ResultSet.CONCUR_READ_ONLY);
                ResultSet rstHC = stmtHC.executeQuery(
                        "SELECT C.city_name, C.state_name, C.country_name " +
                                "FROM " + cityTableName + " C, " + hometownCityTableName + " HC " +
                                "WHERE HC.user_id = " + user_id + " AND HC.HOMETOWN_CITY_ID = C.city_id");
                // TODO: else make an empty object
                if (rstHC.next()) {
                    JSONObject hometown = new JSONObject();
                    String hcity = rstHC.getString(1);
                    String hstate = rstHC.getString(2);
                    String hcountry = rstHC.getString(3);
                    hometown.put("city", hcity);
                    hometown.put("state", hstate);
                    hometown.put("country", hcountry);
                    user.put("hometown", hometown);
                }
                rstHC.close();
                stmtHC.close();
                // Query for friends (JSONArray) that contains: all of the user ids of users who
                // are friends with the current user,
                // and has a larger user id than the current user. Note that Friends
                // relationship is assumed to be symmetric.
                // If user 700 is friends with user 25, it will show up on the list for user 25
                // but will not show up on the list for user 700.
                Statement stmtF = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
                        ResultSet.CONCUR_READ_ONLY);
                ResultSet rstF = stmtF.executeQuery(
                        "SELECT U.user_id " +
                                "FROM " + friendsTableName + " F " +
                                "JOIN " + userTableName + " U ON ((" +
                                "F.user1_id = U.user_id AND F.user2_id = " + user_id + ") OR " +
                                "(F.user1_id = " + user_id + " AND F.user2_id = U.user_id)) AND U.user_id > "
                                + user_id);

                JSONArray friends = new JSONArray();
                while (rstF.next()) {
                    int friend_id = rstF.getInt(1);
                    friends.put(friend_id);
                }
                rstF.close();
                stmtF.close();
                user.put("friends", friends);
                users_info.put(user);
            }
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }
        return users_info;
    }

    // This outputs to a file "output.json"
    // DO NOT MODIFY this function
    public void writeJSON(JSONArray users_info) {
        try {
            FileWriter file = new FileWriter(System.getProperty("user.dir") + "/output.json");
            file.write(users_info.toString());
            file.flush();
            file.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
