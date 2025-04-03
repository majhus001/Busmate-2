import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserFindBus from "./components/Users/Homescreen/UserFindBus";
import UserMap from "./components/Users/Map/UserMap";
import WelcomeScreen from "./components/WelcomeScreen";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import Busdetails from "./components/Users/Busdetails/Busdetails";
import Payment from "./components/Users/Busdetails/Payment";
import UserHomeApp from "./components/Users/Homescreen/UserHome";
import TicketHistory from "./components/Users/Homescreen/Tickethistory";
import FavouriteBuses from "./components/Users/Homescreen/FavouriteBuses";
import UserProfile from "./components/Users/Profile/UserProfile";
import Settings from "./components/Users/Homescreen/Settings";
import UserNotification from "./components/Users/Homescreen/UserNotification";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TicketHistory"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="usfindbus" component={UserFindBus} />
        <Stack.Screen name="usmap" component={UserMap} />
        <Stack.Screen name="welcomepage" component={WelcomeScreen} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signup" component={Signup} />
        <Stack.Screen name="Busdetails" component={Busdetails} />
        <Stack.Screen name="payment" component={Payment} />
        <Stack.Screen name="UserHome" component={UserHomeApp} />
        <Stack.Screen name="TicketHistory" component={TicketHistory} />
        <Stack.Screen name="FavouriteBuses" component={FavouriteBuses} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="UserSettings" component={Settings} />
        <Stack.Screen name="UserNoti" component={UserNotification} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
