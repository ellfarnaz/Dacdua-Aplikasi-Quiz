// utils/networkUtils.ts
import NetInfo from "@react-native-community/netinfo";

export const checkInternetConnection = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected ?? false;
};
