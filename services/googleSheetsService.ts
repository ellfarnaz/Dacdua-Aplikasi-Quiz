import AsyncStorage from "@react-native-async-storage/async-storage";

const FORM_ID = "1FAIpQLScxUIQX9gMt1YYdPu1ywKDQGzy8Sc1v1qVH9A1ZynM2Vhw6zg";

export const saveScoreToGoogleSheets = async (
  materialName: string,
  quizName: string,
  score: number
): Promise<boolean> => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    const { name, institution } = userData
      ? JSON.parse(userData)
      : { name: "Unknown", institution: "Unknown" };
    const timestamp = new Date().toISOString();

    const url = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

    const formData = new FormData();
    formData.append("entry.1499306708", name);
    formData.append("entry.1770859164", institution);
    formData.append("entry.1873496541", materialName);
    formData.append("entry.1797578935", quizName);
    formData.append("entry.431073621", score.toString());
    // formData.append("entry.1538447211", timestamp);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      mode: "no-cors", // This is important
    });

    // console.log("Score submitted to Google Sheets");
    return true;
  } catch (error) {
    // console.error("Error saving score to Google Sheets:", error);
    return false;
  }
};
