import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserData = async (_id: string, name: string, email: string) => {
  try {
    await AsyncStorage.setItem('userid', _id);
    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('userEmail', email);
  } catch (error) {
    console.log('Error saving user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const _id = await AsyncStorage.getItem('userid');
    const name = await AsyncStorage.getItem('userName');
    const email = await AsyncStorage.getItem('userEmail');
    return { _id, name, email };
  } catch (error) {
    console.log('Error getting user data:', error);
    return { _id: null, name: null, email: null };
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('userid');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userEmail');
  } catch (error) {
    console.log('Error clearing user data:', error);
  }
};
