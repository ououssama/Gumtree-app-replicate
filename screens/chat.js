import { Controller, useForm } from "react-hook-form"
import { Image, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native"

const messageData =
{
   sender: {
      _id: "65e4b9b931a30a8b08a0e32f",
      firstName: "Landry",
      lastName: "Witt",
      image: "./../assets/default-profile.png",
   },

   receiver: {
      _id: "65e4b9b91cf7b83796f62db7",
      firstName: "Daisy",
      lastName: "Leonard",
      image: "../assets/default-profile.png",
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

export default function ChatScreen() {
   const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
      defaultValues: {
         message: ''
      }
   });
   return (
      <View style={styles.ChatContainer}>
         <View style={styles.ChatMessagesContainer}>
            {messageData.messages.map((m, i) =>
               <View key={i} style={{ alignItems: (messageData.sender._id === m._id) ? "flex-end" : "flex-start" }}>
                  <View style={[styles.MessageContainer, { flexDirection: (messageData.sender._id === m._id) ? "row-reverse" : "row" }]}>
                     <Image style={styles.ProfileImage} source={require("../assets/default-profile.png")}></Image>
                     <View style={[styles.MessageBubbleContainer, { backgroundColor: (messageData.sender._id === m._id) ? "#d7d7d7" : "#1d7eed" }]}>
                        <Text style={[styles.MessageBubbleText, { color: (messageData.sender._id === m._id) ? "#353535" : "white" }]}>{m.message}</Text>
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
                  <TextInput onChangeText={onChange} value={value} placeholder='Message' placeholderTextColor={'gray'} />
               }
               name='message'
            />
            <TouchableHighlight style={styles.postContainerFormButton} >
               <Text style={styles.postContainerFormButtonText}>Post Ad</Text>
            </TouchableHighlight>
         </View>
      </View>
   )
};

const styles = StyleSheet.create({
   ChatContainer: {
      flex: 1
   },
   ChatMessagesContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: 'red',
      padding: 12,
   },
   ChatMessagesWrapper: {
      // alignItems: 'flex-start'

   },
   ChatInputContainer: {
      borderWidth: 1,
      borderColor: 'blue'
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
   }

})