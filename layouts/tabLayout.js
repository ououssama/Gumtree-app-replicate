import * as React from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { FontAwesome5, FontAwesome, Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/home";
import ProfileScreen from "../screens/profile";
import PostScreen from "../screens/post";
import SavedScreen from "../screens/saved";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HeaderLayout from "./headerLayout";
// import ImagePickerExample from '../screens/test';
import { resetForm } from "../features/resetFormContext";
import LoginScreen from "../screens/auth/login";
import UserGate from "../screens/auth/userGate";
import { useSelector } from "react-redux";
import RegisterScreen from "../screens/auth/register";
import ListingCategory from "../screens/listingCategory";
import SearchResults from "../screens/searchResults";
import MessageNavigationStack from "../screens/message";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import HomeStackNavigation from "../screens/home";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const [resetData, setResetData] = React.useState(false);
  const [stackRoute, setStackRoute] = React.useState();
  const { isLogged } = useSelector((state) => state.userData);
  const chunk = { resetData, setResetData };
  const platformOs = "android" || "ios";
  const routeExclude = ["Listing", "Chat"];
  const tablessRoute = ["Post", "Categories", "Login", "Register", "Chat"];

  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route);

    console.log("routeName", routeName);

    switch (routeName) {
      case "Chat":
        setStackRoute("Chat");
        break;
      case "Listing":
        setStackRoute("Listing");
        break;
      default:
        setStackRoute(routeName);
        break;
    }
  }

  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: "relative",
        },

        header: ({ navigation, route, options }) => {
          return (
            <resetForm.Provider value={chunk}>
              <HeaderLayout
                headerStyle={options.headerStyle}
                option={route.name}
                navigation={navigation}
              />
            </resetForm.Provider>
          );
        },
        headerStyle: {
          height: 70,
          width: `${100}%`,
          backgroundColor: "#39313f",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingTop: Platform.OS === platformOs ? 25 : 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeStack") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-person" : "ios-person-outline";
          } else if (route.name === "Post") {
            return (
              <View>
                <View style={styleSheet.iconWrapper}>
                  <Ionicons name={"ios-camera"} size={50} color="white" />
                </View>
              </View>
            );
          } else if (route.name === "Saved") {
            iconName = focused ? "ios-heart" : "ios-heart-outline";
          } else if (route.name === "Messages") {
            iconName = focused ? "ios-chatbubble" : "ios-chatbubble-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarItemStyle: {
          alignSelf: "center",
          height: 50,
        },
        tabBarActiveTintColor: "#c2616b",
        tabBarInactiveTintColor: "gray",
        tabBarLabelPosition: "below-icon",
        headerShown: !routeExclude.includes(stackRoute) ? true : false,
        tabBarStyle: {
          height: 70,
          display:
            tablessRoute.includes(route.name) ||
            routeExclude.includes(stackRoute)
              ? "none"
              : "flex",
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        options={({ navigation, route }) => (
          navigation.isFocused() && getHeaderTitle(route),
          { tabBarLabel: "Home" }
        )}
        component={HomeStackNavigation}
      />
      <Tab.Screen
        name="Profile"
        children={({ navigation }) => (
          <UserGate navigation={navigation}>
            <ProfileScreen />
          </UserGate>
        )}
      />
      <Tab.Screen
        name="Post"
        children={({ navigation }) => (
          <resetForm.Provider value={chunk}>
            <PostScreen navigation={navigation} />
          </resetForm.Provider>
        )}
        options={{ tabBarLabel: "", tabBarHideOnKeyboard: true }}
      />
      <Tab.Screen
        name="Saved"
        children={({ navigation }) => (
          <UserGate navigation={navigation}>
            <SavedScreen />
          </UserGate>
        )}
      />
      <Tab.Screen
        name="Messages"
        options={({ navigation, route }) => (
          navigation.isFocused() && getHeaderTitle(route),
          { tabBarLabel: "Message" }
        )}
        children={({ navigation }) => (
          <UserGate navigation={navigation}>
            <MessageNavigationStack navigation={navigation} />
          </UserGate>
        )}
      />
      <Tab.Screen
        name="Results"
        component={SearchResults}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Categories"
        component={ListingCategory}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterScreen}
        options={{ tabBarButton: () => null }}
      />
      {/* <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarButton: () => null }} /> */}

      {/* <Tab.Screen name="test" component={ImagePickerExample} /> */}
    </Tab.Navigator>
  );
}

const styleSheet = StyleSheet.create({
  iconWrapper: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bottom: -25,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 150,
    backgroundColor: "#c2616b",
  },
});
