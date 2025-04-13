import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
  ToastAndroid,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { LineChart } from "react-native-chart-kit";
import moment from "moment";
import { API_BASE_URL } from "../../../../apiurl";
import styles, { colors } from "./AdminReportsStyles";
import axios from "axios";

const { width: screenWidth } = Dimensions.get("window");

const ITEMS_PER_PAGE = 5;

const AdminReports = ({ navigation }) => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [revenueData, setRevenueData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [timeRange, setTimeRange] = useState("day");
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todayTrips, setTodayTrips] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [allTickets, setAllTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const scrollViewRef = useRef(null);

  // Generate chart data based on time range
  const generateChartData = (tickets, range) => {
    let labels = [];
    let data = [];

    switch (range) {
      case "day":
        const hourlyRevenue = Array(24).fill(0);

        tickets
          .filter((ticket) => moment(ticket.issuedAt).isSame(moment(), "day"))
          .forEach((ticket) => {
            const hour = moment(ticket.issuedAt).hour();
            hourlyRevenue[hour] += ticket.ticketPrice * ticket.ticketCount;
          });

        for (let hour = 6; hour <= 21; hour += 3) {
          labels.push(moment().hour(hour).format("hA"));
          const hourRevenue =
            hourlyRevenue[hour] +
            (hour + 1 < 24 ? hourlyRevenue[hour + 1] : 0) +
            (hour + 2 < 24 ? hourlyRevenue[hour + 2] : 0);
          data.push(hourRevenue);
        }
        break;

      case "week":
        const dailyRevenue = Array(7).fill(0);
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        tickets
          .filter((ticket) => moment(ticket.issuedAt).isSame(moment(), "week"))
          .forEach((ticket) => {
            const day = moment(ticket.issuedAt).day();
            dailyRevenue[day] += ticket.ticketPrice * ticket.ticketCount;
          });

        labels = weekDays;
        data = dailyRevenue;
        break;

      case "month":
        const weeksInMonth = Math.ceil(moment().daysInMonth() / 7);
        const weeklyRevenue = Array(weeksInMonth).fill(0);

        tickets
          .filter((ticket) => moment(ticket.issuedAt).isSame(moment(), "month"))
          .forEach((ticket) => {
            const week = Math.floor((moment(ticket.issuedAt).date() - 1) / 7);
            weeklyRevenue[week] += ticket.ticketPrice * ticket.ticketCount;
          });

        labels = Array.from(
          { length: weeksInMonth },
          (_, i) => `Week ${i + 1}`
        );
        data = weeklyRevenue;
        break;

      default:
        break;
    }

    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const processRevenueData = (tickets, range) => {
    const revenueByRoute = {};
    const filteredTickets = tickets.filter((ticket) => {
      switch (range) {
        case "day":
          return moment(ticket.issuedAt).isSame(moment(), "day");
        case "week":
          return moment(ticket.issuedAt).isSame(moment(), "week");
        case "month":
          return moment(ticket.issuedAt).isSame(moment(), "month");
        default:
          return true;
      }
    });

    filteredTickets.forEach((ticket) => {
      if (!revenueByRoute[ticket.busRouteNo]) {
        revenueByRoute[ticket.busRouteNo] = {
          id: ticket.busRouteNo,
          busRouteNo: ticket.busRouteNo,
          trips: 0,
          revenue: 0,
          routeName: ticket.routeName,
        };
      }

      revenueByRoute[ticket.busRouteNo].trips += ticket.ticketCount;
      revenueByRoute[ticket.busRouteNo].revenue +=
        ticket.ticketPrice * ticket.ticketCount;
    });

    return Object.values(revenueByRoute);
  };

  const calculateSummary = (tickets, range) => {
    const filteredTickets = tickets.filter((ticket) => {
      switch (range) {
        case "day":
          return moment(ticket.issuedAt).isSame(moment(), "day");
        case "week":
          return moment(ticket.issuedAt).isSame(moment(), "week");
        case "month":
          return moment(ticket.issuedAt).isSame(moment(), "month");
        default:
          return true;
      }
    });

    const revenue = filteredTickets.reduce(
      (sum, ticket) => sum + ticket.ticketPrice * ticket.ticketCount,
      0
    );
    const trips = filteredTickets.reduce(
      (sum, ticket) => sum + ticket.ticketCount,
      0
    );

    return { revenue, trips };
  };

  const fetchAdminData = async () => {
    try {
      const storedData = await SecureStore.getItemAsync("currentUserData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setAdminData(parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
    return null;
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const admin = adminData || (await fetchAdminData());
      if (!admin) {
        console.error("No admin data available");
        return;
      }

      const ticketsResponse = await axios.get(
        `${API_BASE_URL}/api/tickets/genrevenue/all/${admin._id}`
      );
      const tickets = ticketsResponse.data;
      setAllTickets(tickets);

      const { revenue, trips } = calculateSummary(tickets, timeRange);
      setTodayRevenue(revenue);
      setTodayTrips(trips);

      const processedRevenueData = processRevenueData(tickets, timeRange);
      setRevenueData(processedRevenueData);

      setChartData(generateChartData(tickets, timeRange));

      const city = admin.city;
      const usersResponse = await axios.get(
        `${API_BASE_URL}/api/userdata/admin/fetch/users/${city}`
      );
      setUserData(usersResponse.data.users);
    } catch (error) {
      console.error("Error fetching reports:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (allTickets.length > 0) {
      const { revenue, trips } = calculateSummary(allTickets, timeRange);
      setTodayRevenue(revenue);
      setTodayTrips(trips);
      setRevenueData(processRevenueData(allTickets, timeRange));
      setChartData(generateChartData(allTickets, timeRange));
    }
  }, [timeRange, allTickets]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      setCurrentPage(1); // Reset to first page when refetching
    }, [adminData?.city])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    ToastAndroid.show("Report refreshed ", ToastAndroid.SHORT);
  };

  // Filter users based on search query
  const filteredUsers = userData.filter(
    (user) =>
      user.Username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter revenue data based on search query
  const filteredRevenue = revenueData.filter(
    (revenue) =>
      revenue.busRouteNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      revenue.routeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(
    (activeTab === "users" ? filteredUsers.length : filteredRevenue.length) /
      ITEMS_PER_PAGE
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginatedRevenue = filteredRevenue.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Reports Dashboard</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Summary Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.summaryContainer}
          >
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Icon name="cash-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryCardTitle}>Revenue</Text>
                <Text style={styles.summaryCardValue}>₹{todayRevenue}</Text>
                <Text style={styles.summaryCardSubtitle}>
                  {timeRange === "day"
                    ? "Today"
                    : timeRange === "week"
                    ? "This Week"
                    : "This Month"}
                </Text>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Icon name="ticket-outline" size={24} color="#4CAF50" />
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryCardTitle}>Tickets</Text>
                <Text style={styles.summaryCardValue}>{todayTrips}</Text>
                <Text style={styles.summaryCardSubtitle}>
                  Completed journeys
                </Text>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Icon name="people-outline" size={24} color="#FF5722" />
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryCardTitle}>Active Users</Text>
                <Text style={styles.summaryCardValue}>
                  {userData.filter((user) => user.LoggedIn).length}
                </Text>
                <Text style={styles.summaryCardSubtitle}>
                  /{userData.length} total
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Time Range Selector */}
          <View style={styles.timeRangeContainer}>
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === "day" && styles.activeTimeRange,
              ]}
              onPress={() => setTimeRange("day")}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === "day" && styles.activeTimeRangeText,
                ]}
              >
                Day
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === "week" && styles.activeTimeRange,
              ]}
              onPress={() => setTimeRange("week")}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === "week" && styles.activeTimeRangeText,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === "month" && styles.activeTimeRange,
              ]}
              onPress={() => setTimeRange("month")}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === "month" && styles.activeTimeRangeText,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue Overview</Text>
          <Text style={styles.chartSubtitle}>Amount in ₹ (Indian Rupees)</Text>

          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={300}
            yAxisLabel="₹"
            yAxisSuffix=""
            fromZero
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withInnerLines={true}
            withOuterLines={true}
            segments={4}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 12,
              },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#007AFF",
              },
              propsForVerticalLabels: {
                fontSize: 10,
                fontWeight: "500",
              },
              propsForHorizontalLabels: {
                fontSize: 10,
                fontWeight: "500",
              },
              formatYLabel: (value) => `₹${Math.round(value)}`,
              fillShadowGradient: "#007AFF",
              fillShadowGradientOpacity: 0.1,
            }}
            bezier
            style={styles.chart}
            verticalLabelRotation={0}
          />
        </View>

        {/* Tab Section - No longer sticky */}
        <View style={styles.tabSection}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "users" && styles.activeTab,
              ]}
              onPress={() => {
                setActiveTab("users");
                setCurrentPage(1);
              }}
            >
              <Icon
                name="people"
                size={20}
                color={activeTab === "users" ? colors.primary : "#666"}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "users" && styles.activeTabText,
                ]}
              >
                Users
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "revenue" && styles.activeTab,
              ]}
              onPress={() => {
                setActiveTab("revenue");
                setCurrentPage(1);
              }}
            >
              <Icon
                name="cash"
                size={20}
                color={activeTab === "revenue" ? colors.primary : "#666"}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "revenue" && styles.activeTabText,
                ]}
              >
                Revenue
              </Text>
            </TouchableOpacity>
          </View>

          <Searchbar
            placeholder={`Search ${
              activeTab === "users" ? "users" : "buses"
            }...`}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={colors.primary}
          />
        </View>

        {/* Tab Content Section */}
        <View style={styles.tabContentContainer}>
          {activeTab === "users" && (
            <View style={styles.tableContainer}>
              {paginatedUsers.map((user) => (
                <TouchableOpacity
                  key={user._id}
                  style={styles.userCard}
                  onPress={() => {}}
                >
                  <View style={styles.userAvatarContainer}>
                    {user.image ? (
                      <Image
                        source={{ uri: user.image }}
                        style={styles.userAvatar}
                      />
                    ) : (
                      <View
                        style={[styles.userAvatar, styles.userAvatarFallback]}
                      >
                        <Text style={styles.userInitial}>
                          {user.Username.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.userInfoContainer}>
                    <View style={styles.userDetailsTop}>
                      <View>
                        <Text style={styles.userName}>{user.Username}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                      </View>

                      <Text style={{ color: user.LoggedIn ? "green" : "red" }}>
                        {user.LoggedIn ? "Active" : "InActive"}
                      </Text>
                    </View>
                    <View style={styles.userMeta}>
                      <Text style={styles.userRole}>
                        <Icon
                          name={
                            user.role === "Admin"
                              ? "shield-checkmark"
                              : "person"
                          }
                          size={14}
                          color={colors.primary}
                        />{" "}
                        {user.role}
                      </Text>
                      <Text style={styles.userJoinDate}>
                        Joined: {moment(user.createdAt).format("MMM D, YYYY")}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {filteredUsers.length > ITEMS_PER_PAGE && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[
                      styles.paginationButton,
                      currentPage === 1 && styles.disabledPaginationButton,
                    ]}
                    onPress={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <Text style={styles.paginationText}>Previous</Text>
                  </TouchableOpacity>
                  <Text style={styles.pageIndicator}>
                    Page {currentPage} of {totalPages}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.paginationButton,
                      currentPage === totalPages &&
                        styles.disabledPaginationButton,
                    ]}
                    onPress={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <Text style={styles.paginationText}>Next</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {activeTab === "revenue" && (
            <View style={styles.tableContainer}>
              {paginatedRevenue.map((revenue) => (
                <View key={revenue.id} style={styles.revenueCard}>
                  <View style={styles.routeInfo}>
                    <View style={styles.routeIcon}>
                      <Icon name="bus" size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.routeNumber}>
                        {revenue.busRouteNo}
                      </Text>
                      <Text style={styles.routeName}>{revenue.routeName}</Text>
                    </View>
                  </View>
                  <View style={styles.revenueStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Tickets</Text>
                      <Text style={styles.statValue}>{revenue.trips}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statLabel}>Revenue</Text>
                      <Text style={[styles.statValue, styles.revenueValue]}>
                        ₹{revenue.revenue}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {filteredRevenue.length > ITEMS_PER_PAGE && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[
                      styles.paginationButton,
                      currentPage === 1 && styles.disabledPaginationButton,
                    ]}
                    onPress={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <Text style={styles.paginationText}>Previous</Text>
                  </TouchableOpacity>
                  <Text style={styles.pageIndicator}>
                    Page {currentPage} of {totalPages}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.paginationButton,
                      currentPage === totalPages &&
                        styles.disabledPaginationButton,
                    ]}
                    onPress={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <Text style={styles.paginationText}>Next</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminReports;
