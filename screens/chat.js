import { Controller, useForm } from "react-hook-form"
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native"
import { Feather } from '@expo/vector-icons';
import { auth, db } from "../firebase/firebase";
import { Timestamp, addDoc, and, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Divider } from "react-native-paper";

export default function ChatScreen({route}) {
   const { register, setValue, handleSubmit, control, reset, formState: { errors, isSubmitSuccessful } } = useForm({
      defaultValues: {
         message: ''
      }
   });

   const navigate = useNavigation()

   const [conversations, setConversations] = useState([])

   const [elementShowUp, setElementShowUp] = useState(1)

   const {listingId, messageId, listingInfo} = route.params

   const isFocused = useIsFocused()
    
   const SendMessage = (data) => {
      // console.log(data);
      const conversationRef = collection(db, `/Listing/${listingId}/message/${messageId}/Conversation`)
      addDoc(conversationRef, {
         id: auth.currentUser.uid,
         text: data.message,
         timestamp: serverTimestamp(),
         seen: false
      })

   }

   const getConversation = async () => {
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

   //?  update message seen value
    const updateMessageStatus = async () => {
      const conversationRef = collection(db, `Listing/${listingId}/message/${messageId}/Conversation`)
      const conversationQuery = query(conversationRef, and(where("id", "!=", auth.currentUser.uid), where("seen", "==", false)))
      const getConversations = await getDocs(conversationQuery)
      // console.log(getConversations.empty);
      if(!getConversations.empty){
         await Promise.all(getConversations.docs.map(conversation => {
            const ConversationDocRef = doc(db, `Listing/${listingId}/message/${messageId}/Conversation/${conversation.id}`)
            updateDoc(ConversationDocRef, {
               seen: true
            })
         }))
      }
    }

   useEffect(() => {
      (async () => {
         await getConversation()
         await updateMessageStatus()
         // console.log("conversations", conversations);
       })()
       reset({
         message: ""
       })
   }, [isSubmitSuccessful])

   useFocusEffect(
      useCallback(() => {

         return () => {
          navigate.reset({
            index: 0,
            routes: [{name: 'Messages'}],
          })
        };
      }, [])
    );
   
   useEffect(() => {
       (async () => {await getConversation()
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
               <Fragment key={i}>
               {(!conversation.seen && conversations.length - i == listingInfo.latest_message.message_count) && <View style={styles.unreadMessageContainer}><Divider style={styles.unreadMessageDevider} /><Text style={styles.unreadMessageText}>Unread</Text></View>} 
               <View style={{ alignItems: (conversation.id === auth.currentUser.uid) ? "flex-start" : "flex-end" }}>
                  <View style={[styles.MessageContainer, { flexDirection: (conversation.id === auth.currentUser.uid) ? "row" : "row-reverse" }]}>
                     <Image style={styles.ProfileImage} source={require("../assets/default-profile.jpg")}></Image>
                     <View style={[styles.MessageBubbleContainer, { backgroundColor: (conversation.id === auth.currentUser.uid) ?  "#1d7eed" : "#d7d7d7" }]}>
                        <Text style={[styles.MessageBubbleText, { color: (conversation.id === auth.currentUser.uid) ? "white" : "#353535" }]}>{conversation.text}</Text>
                     </View>
                  </View>
               </View>
               </Fragment>
               
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
            <TouchableHighlight style={styles.ChatSendButton} onPress={handleSubmit(SendMessage)}>
               <Feather name="send" size={28} color="white" />
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

   unreadMessageText: {
      alignSelf:"center",
      position: "absolute",
      top: 5,
      color: "#9f9e9f",
      paddingHorizontal: 5,
      backgroundColor: "#f2f2f2"
   },

   unreadMessageContainer: {
      paddingVertical: 15
   },

   ChatMessagesWrapper: {
      // alignItems: 'flex-start'

   },
   ChatInputContainer: {
      flexDirection: "row",
      height:60,
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
      width: 60
   }

})