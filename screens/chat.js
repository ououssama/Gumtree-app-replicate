import { Controller, useForm } from "react-hook-form"
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native"
import { Feather } from '@expo/vector-icons';
import { auth, db } from "../firebase/firebase";
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";


const messageData =
{
   sender: {
      _id: "65e4b9b931a30a8b08a0e32f",
      firstName: "Landry",
      lastName: "Witt",
      image: "./../assets/default-profile.jpg",
   },

   receiver: {
      _id: "65e4b9b91cf7b83796f62db7",
      firstName: "Daisy",
      lastName: "Leonard",
      image: "../assets/default-profile.jpg",
   },

   messages: [
      {
         message: "laborum non velit",
         timstamp: "Sun Mar 03 2024 18:56:09 GMT+0100 (GMT+01:00)",
         _id: "65e4b9b931a30a8b08a0e32f",
      },
      {
         message: "proident",
         timstamp: "Sun Mar 03 2024 18:56:09 GMT+0100 (GMT+01:00)",
         _id: "65e4b9b91cf7b83796f62db7",
      },
      {
         message: "incididunt cillum consequat exercitation fugiat",
         timstamp: "Sun Mar 03 2024 18:56:09 GMT+0100 (GMT+01:00)",
         _id: "65e4b9b931a30a8b08a0e32f",
      },
      {
         message: "sit et nostrud",
         timstamp: "Sun Mar 03 2024 18:56:09 GMT+0100 (GMT+01:00)",
         _id: "65e4b9b91cf7b83796f62db7",
      }
   ],
   product: {
      _id: "65e4b9b9c1013628c3800734",
      name: "qui anim culpa",
      description: "Magna velit qui ut esse anim.",
      price: 6.195
   }
}

export default function ChatScreen({route}) {
   const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
      defaultValues: {
         message: ''
      }
   });

   const [conversations, setConversations] = useState([])

   const {listingId, messageId, listingInfo} = route.params

   const isFocused = useIsFocused()
    
   
   useEffect(() => {

      console.log("LisitingInfo", listingInfo);
      const getConverstaion = async () => {
         const conversationRef = collection(db, `Listing/${listingId}/message/${messageId}/Conversation`)
         await new Promise(async(resolve) => {
         const conversationQuerySnapshot = query(conversationRef, orderBy("timestamp" ))
         const conversationDocs = await getDocs(conversationQuerySnapshot);
            const conversation = conversationDocs.docs.map(conversation => conversation.data())
            resolve(conversation)
         })
         .then(data => setConversations(data))
         // Promise.all(conversationsSettle).then(data => setConversations(data))
       };

       (async () => {await getConverstaion()
         // console.log("conversations", conversations);
       })()
   },[isFocused])

   return (
      <View style={styles.ChatContainer}>
         <View style={styles.ChatListingInfoContainer}>
         <Image style={styles.ListingInfoImg} source={{uri: listingInfo.uri}}></Image>
            <View style={styles.ListingInfoProfile}>
               <Text style={styles.ListingInfoProfileSellerName}>{listingInfo?.user.displayName}</Text>
               <Text style={styles.ListingInfoProfileSellerListingName}>{listingInfo.title}</Text>
            </View>
         </View>
         <View style={styles.ChatMessagesContainer}>
            {conversations?.map((conversation, i) =>
               // <Text>{conversation.text}</Text>
               <View key={i} style={{ alignItems: (conversation.id === auth.currentUser.uid) ? "flex-start" : "flex-end" }}>
                  <View style={[styles.MessageContainer, { flexDirection: (conversation.id === auth.currentUser.uid) ? "row" : "row-reverse" }]}>
                     <Image style={styles.ProfileImage} source={require("../assets/default-profile.jpg")}></Image>
                     <View style={[styles.MessageBubbleContainer, { backgroundColor: (conversation.id === auth.currentUser.uid) ?  "#1d7eed" : "#d7d7d7" }]}>
                        <Text style={[styles.MessageBubbleText, { color: (conversation.id === auth.currentUser.uid) ? "white" : "#353535" }]}>{conversation.text}</Text>
                     </View>
                  </View>
               </View>
            )
            }
         </View>
         <View style={styles.ChatInputContainer}>
            <Controller
               control={control}
               rules={{ required: true }}
               render={({ field: { onChange, value } }) =>
                  <TextInput style={styles.ChatInputField} onChangeText={onChange} value={value} placeholder='Message' placeholderTextColor={'gray'} />
               }
               name='message'
            />
            <TouchableHighlight style={styles.ChatSendButton} >
               <Feather name="send" size={24} color="white" />
            </TouchableHighlight>
         </View>
      </View>
   )
};

const styles = StyleSheet.create({
   ChatContainer: {
      flex: 1
   },
   ChatListingInfoContainer: {
      display: 'flex',
      flexDirection: 'row',
      padding: 9,
      backgroundColor: "#EBEBEB",
      borderBottomWidth: 1,
      borderColor:"#ddd"
   },

   ListingInfoImg: {
      width: 60,
      height: 60,
   },

   ListingInfoProfile: {
      display: 'flex',
      paddingStart: 8,
      flex: 1
   },

   ListingInfoProfileSellerName: {
      fontWeight: '700'
   },

   ChatMessagesContainer: {
      flex: 1,
      padding: 24,
   },
   ChatMessagesWrapper: {
      // alignItems: 'flex-start'

   },
   ChatInputContainer: {
      flexDirection: "row",
      height:50,
      borderTopWidth: 1,
      borderColor:"#ddd"
   },
   ChatInputField:{
      flex:1,
      fontSize:18,
      borderRadius: 5,
      paddingHorizontal: 15,
      backgroundColor: "white"
   },
   MessageContainer: {
      // flexDirection: "row-reverse",
      flexDirection: "row",
      marginBottom: 8,
      columnGap: 10,
   },
   ProfileImage: {
      width: 40,
      height: 40,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: '#e2e2e2'
   },
   MessageBubbleContainer: {
      backgroundColor: '#1d7eed',
      paddingVertical: 7,
      paddingHorizontal: 13,
      borderRadius: 100,
      height: "auto",
      maxWidth: "60%",
      justifyContent: 'center'
   },
   MessageBubbleText: {
      color: 'white',
      // width: "auto"
   },
   ChatSendButton: {
      backgroundColor: "#c2616b",
      justifyContent: "center",
      alignItems: "center",
      width: 50
   }

})