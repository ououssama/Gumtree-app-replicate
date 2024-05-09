import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
import { auth, db, storage } from "../firebase/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { getDownloadURL, ref } from "firebase/storage";

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
  return (
    <View style={styles.conversationItem}>
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
        <Text style={styles.conversationItemSellerLatestMsg}>Yes</Text>
      </View>
      <View style={styles.conversationItemOption}>
        <Text style={styles.conversationItemOptionTime}>2m</Text>
        <Text style={styles.conversationItemOptionBadge}>10</Text>
      </View>
    </View>
  );
}

export default function MessageScreen({ navigation }) {
  const [listingChats, setLisitingChats] = useState();
  const [conversationId, setConversationId] = useState();

  const isFocused = useIsFocused();

  useEffect(() => {
    //console.log("user id: ", auth.currentUser);
    const getMessageId = async () => {
      let listingCollection = [];

      const listingRef = collection(db, "Listing");
      const getListings = await getDocs(listingRef);

      // TODO: add promies to function
      await new Promise((resolve) => {
        getListings.docs.forEach(async (doc, i) => {
          const messageRef = collection(db, `Listing/${doc.id}/message`);
          const messageQuery = query(
            messageRef,
            where("user_id", "==", auth.currentUser.uid)
          );

          await getDocs(messageQuery).then((res) => {
            res.docs.forEach((doc) => {
              listingCollection.push(doc.ref.parent.parent.id);
              // conversationCollection.push(doc.id)
              // listingCollection.push(doc.ref.parent.parent.id)
            });
          });

          if (getListings.docs.length - 1 == i) {
            resolve(listingCollection);
          }
        });

        //   resolve({
        //    conversation_id: conversationCollection,
        //    Listing_id: listingCollection,
        //  });
      });
      return listingCollection;
    };

    const getStorageImage = async (reference_path) => {
      const getImageUrl = await getDownloadURL(reference_path);
      const response = Promise.resolve(getImageUrl);
      return response;
      // return "path"
    };

    const getListingsChat = async () => {
      let lisitngsArray = [];
      const listingCollection = await getMessageId();

      const ListingRef = collection(db, `Listing`);
      const ListingsRes = await getDocs(ListingRef);

      await Promise.all(
        ListingsRes.docs.map(async (listingsDocs) => {
          if (listingCollection.includes(listingsDocs.id)) {
            const pathReference = ref(
              storage,
              `listings/images/${
                listingsDocs.data().image_name ?? "No_Image_Available.jpg"
              }`
            );
            const getimg = await getStorageImage(pathReference);
            lisitngsArray.push({ ...listingsDocs.data(), uri: getimg });
          }
        })
      );

      return lisitngsArray;
    };

    const getConverstaion = async () => {
      const conversationRef = collection(db, "Message");
      const conversationId = await getMessageId();
      const conversationQuerySnapshot = query(
        conversationRef,
        where("ConverstationId", "==", conversationId)
      );
      new Promise((resolve) => {
        getDocs(conversationQuerySnapshot).then((res) => {
          res.docs.forEach((doc) => {
            getDocs(collection(db, `Message/${doc.id}/Conversation`)).then(
              (conversationRes) => {
                conversationRes.docs.forEach((conversationDoc) => {
                  resolve(console.log(conversationDoc.data()));
                });
              }
            );
          });
        });
      });
    };

    (async () => {
      console.log("<======= Listing msg =======>");
      setLisitingChats(await getListingsChat());
      console.log(listingChats);
    })();
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
              <View key={i}>
                <TouchableHighlight
                  style={{ marginVertical: 5 }}
                  activeOpacity={0.9}
                  underlayColor="#DDDDDD"
                  onPress={() =>
                    navigation.jumpTo("Chat", {
                      conversationId: conversationId,
                    })
                  }
                >
                  <MessageComponent data={chatroom} id={i} />
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

const styles = StyleSheet.create({
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
