import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { Ionicons, Feather, Octicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export function LisitngScreen({ route }) {
  const { listing } = route.params;
  const navigate = useNavigation();
  const [pathToConversation, setPathToConversation] = useState();


  const createConverstaion = async (listing_id, listingInfo) => {
    // console.log(listing_id, userId);
    let messageId;
    const messageRefPath = `/Listing/${listing_id}/message`
    const messageRef = collection(db, messageRefPath);
    const messageQuery = query(
      messageRef,
      where("sender_id", "==", auth.currentUser.uid)
    );
    const getMessages = await getDocs(messageQuery);
    if (getMessages.empty) {
      // TODO: add logic for new chat session

        await addDoc(messageRef, {
          sender_id: auth.currentUser.uid,
          recipient_id: listingInfo.user.uid,
          timestamp: serverTimestamp(),
        })
      .then(async(res) => {
        console.log(res.path);
        let getAddedMessage = await getDoc(doc(db, res.path))
        messageId = getAddedMessage.id
      });
    } else {
      messageId = getMessages.docs[0].id
    }

    navigate.navigate("Messages", {
      screen: "Chat",
      initial: false,
      params: {
        listingId: listing_id,
        messageId: messageId,
        listingInfo: listingInfo,
      },
    });
    
  };

  return (
    <SafeAreaView style={styles.listingContainer}>
      <View style={styles.listingImageContainer}>
        <Image style={styles.listingImage} source={{ uri: listing.uri }} />
        <Ionicons
          style={styles.listingLikeIcon}
          name={"ios-heart-outline"}
          size={34}
          color="#d5483f"
        />
      </View>
      <View style={styles.listingInfoContainer}>
        <View style={styles.listingPrimaryInfo}>
          <Text style={styles.listingPrimaryInfoTitle}>{listing.title}</Text>
          <View style={styles.listingPrimaryInfoPrice}>
            <Text style={styles.listingPrimaryInfoPriceLabel}>Price</Text>
            <Text style={styles.listingPrimaryInfoPriceText}>
              {listing.price}£
            </Text>
          </View>
        </View>
        <View style={styles.listingAdditionalInfo}>
          <Text style={styles.listingAdditionalInfoHeader}>Description</Text>
          <Text style={styles.listingAdditionalInfoContent}>
            {listing.description}
          </Text>
        </View>
        <View style={styles.listingContactInfo}>
          <Text style={styles.listingContactInfoHeader}>Contact</Text>
          <TouchableHighlight>
            <View style={styles.listingContactInfoContentUser}>
              <Image
                style={styles.listingContactInfoContentUserImg}
                source={require("../assets/default-profile.jpg")}
              />
              <View>
                <View style={styles.listingContactInfoContentUserDetail}>
                  <Text style={styles.listingContactInfoContentUserName}>
                    {listing?.user?.displayName}
                  </Text>
                  <Text>
                    <Octicons name="dot-fill" size={14} color="#0BDA51" />{" "}
                    Online
                  </Text>
                </View>
              </View>
              <View style={styles.listingContactInfoContentButtonWrapper}>
                <TouchableHighlight
                  underlayColor={"#A5525B"}
                  onPress={() => createConverstaion(listing.listingId, listing)}
                  style={styles.listingContactInfoContentButton}
                  // onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.listingContactInfoContentButtonText}>
                    Send Message
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
            {/* <View style={styles.listingContactInfoContent}>
                  <TextInput
                  style={styles.listingContactInfoInput}
                  value={"Say Hi"}
                  placeholder="Text"
                  editable={false}
                  />
                  <View style={styles.listingContactInfoButton}>
                  <Feather name="send" size={24} color="white" />
                  </View>
              </View> */}
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listingContainer: {
    flex: 1,
  },
  listingImageContainer: {
    flex: 1,
  },
  listingImage: {
    width: "100%",
    height: "100%",
  },
  listingLikeIcon: {
    padding: 10,
    borderRadius: 100,
    position: "absolute",
    top: 0,
    right: 0,
    margin: 10,
    backgroundColor: "white",
  },
  listingInfoContainer: {
    padding: 10,
    rowGap: 10,
    flex: 1,
  },
  listingPrimaryInfo: {
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
  },
  listingPrimaryInfoTitle: {
    fontSize: 24,
    maxWidth: "80%",
    fontWeight: "600",
  },

  listingPrimaryInfoPriceLabel: {
    color: "grey",
  },
  listingPrimaryInfoPriceText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#c2616b",
  },

  listingAdditionalInfo: {
    borderRadius: 5,
    backgroundColor: "white",
    rowGap: 5,
    padding: 15,
  },
  listingAdditionalInfoHeader: {
    fontSize: 20,
    fontWeight: "600",
  },
  listingContactInfo: {
    borderRadius: 5,
    backgroundColor: "white",
    rowGap: 10,
    padding: 15,
  },

  listingContactInfoHeader: {
    fontSize: 20,
    fontWeight: "600",
  },
  listingContactInfoContentContainer: {
    flexDirection: "row",
    flex: 1,
    rowGap: 15,
  },
  listingContactInfoContentUser: {
    // flex: 1,
    flexDirection: "row",
    columnGap: 13,
  },

  listingContactInfoContentUserImg: {
    borderRadius: 100,
    width: 50,
    height: 50,
  },

  listingContactInfoContentUserName: {
    fontSize: 16,
    marginBottom: 2,
  },

  listingContactInfoContentButtonWrapper: {
    marginStart: "auto",
    height: 50,
    borderRadius: 4,
    justifyContent: "flex-end",
  },

  listingContactInfoContentButton: {
    paddingHorizontal: 15,
    backgroundColor: "#c2616b",
    borderRadius: 5,
    // display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: `${100}%`,
  },

  listingContactInfoContentButtonText: {
    color: "white",
    fontSize: 18,
  },

  listingContactInfoContent: {
    flexDirection: "row",
    borderRadius: 5,
    overflow: "hidden",
  },

  listingContactInfoInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    // borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: "#EDEDED",
  },

  listingContactInfoButton: {
    backgroundColor: "#c2616b",
    // borderRadius: 5,
    // display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // height: `${100}%`
    width: 50,
  },
});
