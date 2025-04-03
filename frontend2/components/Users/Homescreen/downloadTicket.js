import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

const downloadTicket = async (orderId) => {
  try {
    const fileName = `Ticket_${orderId}.pdf`;
    const downloadUrl = `http://192.168.232.182:5000/api/payment/ticket/${orderId}`;
    const tempFileUri = `${FileSystem.documentDirectory}${fileName}`;

    console.log("📥 Downloading ticket:", downloadUrl);
    const { uri } = await FileSystem.downloadAsync(downloadUrl, tempFileUri);

    // Request storage permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Storage access is required to save the file.");
      return;
    }

    // Get the actual Android Downloads folder path
    const downloadsFolder = FileSystem.cacheDirectory.replace("cache/", "files/");
    const finalUri = `${downloadsFolder}${fileName}`;

    // Move file to the Downloads folder
    await FileSystem.moveAsync({ from: uri, to: finalUri });

    // Save to Media Library (makes file visible in File Manager)
    const asset = await MediaLibrary.createAssetAsync(finalUri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);

    console.log("✅ Ticket saved at:", finalUri);
    Alert.alert("Success", "Ticket saved to your Downloads folder.");

    // Open the downloaded PDF automatically
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(finalUri);
    }
  } catch (error) {
    console.error("❌ Error downloading ticket:", error.message);
    Alert.alert("Error", "Failed to download the ticket.");
  }
};

export default downloadTicket;
