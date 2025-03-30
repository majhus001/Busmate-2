import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: "#fff",
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    headerItem: {
      alignItems: "center",
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    value: {
      fontSize: 16,
      padding: 10,
      backgroundColor: "#f0f0f0",
      borderRadius: 5,
    },
    picker: {
      height: 50,
      borderWidth: 1,
      backgroundColor: "#f9f9f9",
      borderRadius: 5,
      marginBottom: 15,
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
    },
    counterButton: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: "#ddd",
      marginHorizontal: 10,
    },
    counterText: {
      fontSize: 20,
      fontWeight: "bold",
    },
    counterValue: {
      fontSize: 18,
      fontWeight: "bold",
    },
    input: {
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      backgroundColor: "#f9f9f9",
      marginBottom: 15,
    },
    paymentContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10,
      },
      
      paymentOption: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        width: "45%",
        alignItems: "center",
      },
      
      selectedPayment: {
        backgroundColor: "#007bff", // Highlight color for selection
        borderColor: "#007bff",
      },
      
      paymentText: {
        fontSize: 16,
        color: "#000",
      },
      
  });

  export default styles;