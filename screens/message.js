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
  or,
  and,
  getCountFromServer,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { getDownloadURL, ref } from "firebase/storage";
import { child, get, orderByChild } from "firebase/database";
import moment from "moment/moment";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from "./chat";
import { Ionicons,FontAwesome } from '@expo/vector-icons';


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
        <View style={styles.conversationItemSellerInfo}>
          <Text style={styles.conversationItemSellerName}>
            {props?.data.user.displayName}
          </Text>
          <FontAwesome name="chevron-right" size={10} color="#9f9e9f" />
          <Text style={styles.conversationItemSellerListing}>
             {props?.data.title}
          </Text>
        </View>
        <Text style={[styles.conversationItemSellerLatestMsg, {fontWeight: props?.data.latest_message.message_count > 0 ? "700" : "400"}]}>{props?.data.latest_message.text}</Text>
      </View>
      <View style={styles.conversationItemOption}>
        <Text style={styles.conversationItemOptionTime}>{convertTimeStamp(props?.data.latest_message.timestamp.seconds)}</Text>
        {props?.data.latest_message.message_count > 0 && <Text style={styles.conversationItemOptionBadge}>{props?.data.latest_message.message_count}</Text>}
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
              or(where("sender_id", "==", auth.currentUser.uid), where("recipient_id", "==", auth.currentUser.uid))
            );
            const messageRes = await getDocs(messageQuery);
            // const cachMessage = await get(messageRes)
            // console.log(cachMessage.val());
            if (!messageRes.empty) {
              let latest_message;
              // console.log(messageRes.docs[0].data())
              await Promise.all(
                messageRes.docs.map(async (message) => {
                  // const listingQuery = query(ListingRef, orderByChild(`${listingsDocs.id}/message/${message.id}/Conversation`))
                  const conversationRef = collection(
                    messageRef,
                    `${message.id}/Conversation`
                  );
                   
                  const unreadMessagesQuery = query(conversationRef, and(where("id", "!=", auth.currentUser.uid), where("seen", "==", false)))
                  const unreadMessageSnapshot = await getCountFromServer(unreadMessagesQuery)
                  const unreadMessageCount = unreadMessageSnapshot.data().count

                  const conversationQuery = query(
                    conversationRef,
                    orderBy("timestamp", "desc"),
                    limit(1),
                  );
                  const conversationRes = await getDocs(conversationQuery);
                  latest_message = {
                    message_count: unreadMessageCount,
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
    paddingHorizontal: 10
  },

  conversation: {
    padding: 4,
  },

  conversationItem: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
  },

  conversationItemImage: {
    width: 60,
    height: 60,
  },

  conversationItemSeller: {
    display: "flex",
    paddingStart: 8,
    flex: 1,
  },

  conversationItemSellerInfo: {
    alignItems:"center",
    gap: 7,
    flexDirection: "row"
  },

  conversationItemSellerName: {
    fontSize: 16,
    fontWeight: "700",
  },

  conversationItemSellerLatestMsg: {
    fontSize: 16,
    marginTop: "auto",
    marginBottom: 10,
    // fontWeight: "700",
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
    alignSelf: "flex-end",
    justifyContent: "center",
    color: "white",
  },
});
