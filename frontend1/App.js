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
import AssignConductors from "./components/Admin/Conductor/AssignConductors";
import ComplaintForm from "./components/Conductor/Complaintform/ComplaintForm";
import ViewComplaintForm from "./components/Conductor/Complaintform/ViewComplaintForm";
import AdDash from "./components/Admin/Dashboard/AdDash";
import Upiqr from "./components/Conductor/Ticket/Upiqr";
import AdminProfile from "./components/Admin/Profile/AdminProfile";
import ConProfile from "./components/Conductor/Profile/ConProfile";
import StatusCompliant from "./components/Admin/Admincompliant/StatusCompliant";
import Updateconductordata from "./components/Admin/Dashboard/Updatedatas/Updateconductordata";
import ViewBusesdata from "./components/Admin/Dashboard/Updatedatas/ViewBusesdata";
import Viewconductordata from "./components/Admin/Dashboard/Updatedatas/Viewconductordata";
import Updatebusesdata from "./components/Admin/Dashboard/Updatedatas/Updatebusesdata";
import AdminReports from "./components/Admin/Dashboard/Reports/AdminReports";
import Conductormap from "./components/Conductor/Homepage/Conductormap";
import UserComplaints from "./components/Conductor/Complaintform/UserCompliants";
import AdminUserComplaint from "./components/Admin/Admincompliant/Usercompliant";
import NotificationAlert from "./components/Conductor/Homepage/NotificationAlert";

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
        <Stack.Screen name="viewcomplaintform" component={ViewComplaintForm} />
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
        <Stack.Screen name="addash" component={AdDash} />
        <Stack.Screen name="Upiqr" component={Upiqr} />
        <Stack.Screen name="adprofile" component={AdminProfile} />
        <Stack.Screen name="conprofile" component={ConProfile} />
        <Stack.Screen name="statuscomplient" component={StatusCompliant} />
        <Stack.Screen name="updatebusesdata" component={Updatebusesdata} />
        <Stack.Screen name="updateconductordata" component={Updateconductordata} />
        <Stack.Screen name="ViewBuses" component={ViewBusesdata} />
        <Stack.Screen name="ViewConductors" component={Viewconductordata} />
        <Stack.Screen name="adreports" component={AdminReports} />
        <Stack.Screen name="Conductormap" component={Conductormap} />
        <Stack.Screen name="AssignConductors" component={AssignConductors} />
        <Stack.Screen name="UserComplaints" component={UserComplaints} />
  
        <Stack.Screen name="AdminUserComplaints" component={AdminUserComplaint} />
        
        <Stack.Screen name="NotificationAlert" component={NotificationAlert} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
