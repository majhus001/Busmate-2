import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdBuses from "./components/Admin/BusRoute/AdBuses";
import ConHome from "./components/Conductor/Homepage/ConHome";
import BusSelection from "./components/Conductor/SelectBus/BusSelection";
import Buslogin from "./components/Conductor/Buslogin/Buslogin";
import EtmTicket from "./components/Conductor/Ticket/EtmTicket";
import AdRoutes from "./components/Admin/BusRoute/AdRoutes";
import Payment from "./components/Conductor/Ticket/Payment";
import TicketSuccess from "./components/Conductor/Ticket/TicketSuccess";
import WelcomeScreen from "./components/WelcomeScreen";
import Signup from "./components/Authentication/Signup";
import Login from "./components/Authentication/Login";
import AdminHome from "./components/Admin/Homepage/AdminHome";
import AddConductor from "./components/Admin/Conductor/AddConductor";
import Example from "./components/Admin/BusRoute/Example";
import ComplaintForm from "./components/Conductor/Complaintform/ComplaintForm";
import AdDash from "./components/Admin/Dashboard/AdDash";
import UpiQrGenerator from "./components/Conductor/Ticket/Upiqr";
import Upiqr from "./components/Conductor/Ticket/Upiqr";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AddBuses" component={AdBuses} />
        <Stack.Screen name="conhomepage" component={ConHome} />
        <Stack.Screen name="conbusselect" component={BusSelection} />
        <Stack.Screen name="complaintform" component={ComplaintForm} />
        <Stack.Screen name="buslogin" component={Buslogin} />
        <Stack.Screen name="taketicket" component={EtmTicket} />
        <Stack.Screen name="adroutes" component={AdRoutes} />
        <Stack.Screen name="payment" component={Payment} />
        <Stack.Screen name="ticsuccess" component={TicketSuccess} />
        <Stack.Screen name="welcomepage" component={WelcomeScreen} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="signup" component={Signup} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="AddConductor" component={AddConductor} />
        <Stack.Screen name="ex" component={Example} />
        <Stack.Screen name="addash" component={AdDash} />
        <Stack.Screen name="Upiqr" component={Upiqr}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
