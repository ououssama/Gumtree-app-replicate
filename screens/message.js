import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { auth, db, storage } from "../firebase/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  limitToLast,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { getDownloadURL, ref } from "firebase/storage";
import { child, orderByChild } from "firebase/database";
import moment from "moment/moment";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from "./chat";
import { Ionicons } from '@expo/vector-icons';


const messageStack = createNativeStackNavigator()

moment.updateLocale('en', {
  relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "%ds",
      ss: '%ds',
      mm: "%dm",
      hh: "%dh",
      dd: "%dd",
      MM: "%dm",
      yy: "%dy"
  }
});

const messages = [
  {
    id: 1,
    title: "listings 1",
    date: "2023-09-13T13:17:40+01:00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    imageUrl: "https://picsum.photos/id/237/200/300",
    price: 50,
    currency: "£",
    location: "Marrakech",
  },
];

function MessageComponent(props) {

  const convertTimeStamp = (date) => {
    const formateDate = new Date(date * 1000);
    return moment(formateDate, "YYYYMMDD").fromNow();
}

  return (
    <View style={styles.conversationItem}>
      {/* <Text>test</Text> */}
      <Image
        style={styles.conversationItemImage}
        source={{ uri: props?.data.uri }}
      />
      <View style={styles.conversationItemSeller}>
        <Text style={styles.conversationItemSellerName}>
          {props?.data.title}
        </Text>
        <Text style={styles.conversationItemSellerListing}>
          {props?.data.title}
        </Text>
        <Text style={styles.conversationItemSellerLatestMsg}>{props?.data.latest_message.text}</Text>
      </View>
      <View style={styles.conversationItemOption}>
        <Text style={styles.conversationItemOptionTime}>{convertTimeStamp(props?.data.latest_message.timestamp.seconds)}</Text>
        <Text style={styles.conversationItemOptionBadge}>10</Text>
      </View>
    </View>
  );
}

function MessageScreen({navigation}){
  const [listingChats, setLisitingChats] = useState();
  const [conversationId, setConversationId] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    //console.log("user id: ", auth.currentUser);
    // const getMessageId = async () => {
    //   let listingCollection = [];

    //   const listingRef = collection(db, "Listing");
    //   const getListings = await getDocs(listingRef);

    //   await new Promise((resolve) => {
    //     getListings.docs.forEach(async (doc, i) => {
    //       const messageRef = collection(db, `Listing/${doc.id}/message`);
    //       const messageQuery = query(
    //         messageRef,
    //         where("user_id", "==", auth.currentUser.uid)
    //       );

    //       await getDocs(messageQuery).then((res) => {
    //         res.docs.forEach((doc) => {
    //           listingCollection.push(doc.ref.parent.parent.id);
    //           // conversationCollection.push(doc.id)
    //           // listingCollection.push(doc.ref.parent.parent.id)
    //         });
    //       });

    //       if (getListings.docs.length - 1 == i) {
    //         resolve(listingCollection);
    //       }
    //     });

    //     //   resolve({
    //     //    conversation_id: conversationCollection,
    //     //    Listing_id: listingCollection,
    //     //  });
    //   });
    //   return listingCollection;
    // };

    const getStorageImage = async (reference_path) => {
      const getImageUrl = await getDownloadURL(reference_path);
      const response = Promise.resolve(getImageUrl);
      return response;
      // return "path"
    };

    const getListingsChat = async () => {
      let listingsArray = [];
      // const listingCollection = await getMessageId();

      const ListingRef = collection(db, `Listing`);
      const ListingsRes = await getDocs(ListingRef);

      await Promise.all(
        ListingsRes.docs.map(async (listingsDocs) => {
          try {
            const messageRef = collection(
              ListingRef,
              `${listingsDocs.id}/message`
            );
            const messageQuery = query(
              messageRef,
              where("user_id", "==", auth.currentUser.uid)
            );
            const messageRes = await getDocs(messageQuery);
            if (!messageRes.empty) {
              let latest_message;
              await Promise.all(
                messageRes.docs.map(async (message) => {
                  // const listingQuery = query(ListingRef, orderByChild(`${listingsDocs.id}/message/${message.id}/Conversation`))
                  const conversationRef = collection(
                    messageRef,
                    `${message.id}/Conversation`
                  );
                  const conversationQuery = query(
                    conversationRef,
                    orderBy("timestamp", "desc"),
                    limit(1),
                  );
                  const conversationRes = await getDocs(conversationQuery);
                  latest_message = {
                    message_ref: message.id,
                    Conversation_ref: conversationRes.docs[0].id, 
                    timestamp: conversationRes.docs[0].data().timestamp,
                    text: conversationRes.docs[0].data().text,
                  };

                  // console.log("listingMessageTimestamps: ", listingMessageTimestamps);
                  // console.log();
                })
              );
        
            const pathReference = ref(
              storage,
              `listings/images/${
                listingsDocs.data().image_name ?? "No_Image_Available.jpg"
              }`
            );
            const getimg = await getStorageImage(pathReference);
            listingsArray.push({Listing_ref: listingsDocs.id, ...listingsDocs.data(), uri: getimg, latest_message  });

              // listingsArray.push({ ...listingsDocs.data()});
            }
          } catch (error) {
            console.log(error);
          }
        })
      );

      let sortData = listingsArray?.sort(
        (a, b) =>
          b.latest_message.timestamp.seconds -
          a.latest_message.timestamp.seconds
      );

      return sortData;
    };

    (async () => {
      // console.log("<======= Listing msg =======>");
      // console.log(await getListingsChat());
      setLisitingChats(await getListingsChat());
      console.log(listingChats);
    })();

    // console.log("navigation", navigation);
  }, [isFocused]);

  return (
    <>
      {!listingChats?.length ? (
        <View style={styles.Loader}>
          <ActivityIndicator animating={true} size={34} color={"#c2616b"} />
          <Text style={{ marginTop: 10 }}>
            Loading chat history... Just a moment please.
          </Text>
        </View>
      ) : (
        <View style={styles.wrapper}>
          <View style={styles.conversation}>
            {listingChats?.map((chatroom, i) => (
            
              <View key={chatroom.Listing_ref}>
                <TouchableHighlight
                  style={{ marginVertical: 5 }}
                  activeOpacity={0.9}
                  underlayColor="#DDDDDD"
                  onPress={() =>
                    navigation.push("Chat", {listingId: chatroom.Listing_ref , messageId: chatroom.latest_message.message_ref, listingInfo: chatroom})
                  }
                >
                  <MessageComponent data={chatroom} />
                </TouchableHighlight>
                {listingChats.length - 1 > i && (
                  <Divider style={styles.conversationDivider} />
                )}
              </View>
         
            ))}
          </View>
        </View>
      )}
    </>
  );
}

export default function MessageNavigationStack({navigation}) {
  const platformOs = 'android' || 'ios'


  return(
    // TODO: fix: bug in nested navigation therefor the child can controll the main header
    <messageStack.Navigator initialRouteName="Message" screenOptions={{
      header : ({navigation, route, options}) => {
        return (
        <View style={options.headerStyle} >
          <Ionicons name="chevron-back" size={24} color="white" onPress={() => navigation.goBack()} />
          <View style={styles.titleWrapper}><Text style={styles.title}>{route.name}</Text></View>
        </View>
        )
      },
      headerStyle: {
        height: StatusBar.currentHeight + 70,
        width: `${100}%`,
        backgroundColor: '#39313f',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: Platform.OS === platformOs ? 25 : 0
    },
    }}>
      <messageStack.Screen name="Message" component={MessageScreen} options={{headerShown: false}}/>
      <messageStack.Screen name="Chat" component={ChatScreen}/>
    </messageStack.Navigator>
  )
}

const styles = StyleSheet.create({
  titleWrapper: {
    display: 'flex',
    flex: 1,
    paddingEnd: 25,
    alignItems:'center'
  },

  title: {
    fontSize: 18,
    color: 'white',
  },
  Loader: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },

  conversationDivider: {
    // Styles
  },

  conversation: {
    padding: 4,
  },

  conversationItem: {
    display: "flex",
    flexDirection: "row",
    padding: 9,
  },

  conversationItemImage: {
    width: 80,
    height: 80,
  },

  conversationItemSeller: {
    display: "flex",
    paddingStart: 8,
    flex: 1,
  },

  conversationItemSellerName: {
    fontWeight: "700",
  },

  conversationItemSellerLatestMsg: {
    fontWeight: "700",
  },

  conversationItemOption: {
    display: "flex",
    alignItems: "center",
    rowGap: 5,
  },

  conversationItemOptionTime: {
    alignSelf: "flex-end",
  },

  conversationItemOptionBadge: {
    backgroundColor: "#EA5D56",
    paddingVertical: 2,
    paddingHorizontal: 7.5,
    borderRadius: 50,
    justifyContent: "center",
    color: "white",
  },
});
