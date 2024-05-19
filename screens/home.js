import * as React from 'react'
import { Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { auth, db, storage } from '../firebase/firebase';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LisitngScreen } from './listing';

const homeStack = createNativeStackNavigator()

function HomeScreen({navigation}) {

   const [like, setLike] = React.useState([])
   const [listings, setListings] = React.useState([])

   const toggelLike = async (listingKey, listingID) => {
      const authUser = auth.currentUser.uid;
      const uniqueID = Date.now()
      const targetedBtn = like.find(lk => lk.key === listingKey)
      if (like.find(lk => lk.key === listingKey)) {
         const newLikeSet = like.filter(l => l.key !== listingKey)
         setLike(newLikeSet)
         // console.log(targetedBtn.likeId);
         handleLikedListing(targetedBtn.likeId, listingID, authUser, 'DELETE')

      } else {
         let like_id = uniqueID
         setLike(prev => ([...prev, { key: listingKey, likeId: like_id }]))
         handleLikedListing(like_id, listingID, authUser, 'ADD')
      }

   }

   const handleLikedListing = async (FavID, listingId, authId, action) => {
      try {
         const createdDate = new Date();
         const listingRef = collection(db, 'Listing');
         const listingQuery = query(listingRef, where('listingUID', '==', listingId))
         const listingDoc = (await getDocs(listingQuery)).docs[0].id

         if (action === 'ADD') {
            addDoc(collection(db, `Listing/${listingDoc}/Favorites`),
               {
                  like_id: FavID,
                  user_uid: authId,
                  listing_uid: listingId,
                  created_at: createdDate
               })
         }

         if (action === 'DELETE') {
            const FavRef = collection(db, `Listing/${listingDoc}/Favorites`)
            const FavQuery = query(FavRef, where('like_id', '==', FavID))
            const FavDocs = getDocs(FavQuery)
            await FavDocs.then(querySnapshot => {
               querySnapshot?.forEach(docRes => {
                  deleteDoc(doc(db, `Listing/${listingDoc}/Favorites`, docRes.id))

               })
            }).catch(err => {
               console.error(err);
            })
         }
      }
      catch (error) {
         console.log(error);
      }
   }

   const isFocused = useIsFocused()

   React.useEffect(() => {
      const getListings = async () => {
         let array = [];
         const querySnapshot = await getDocs(collection(db, "Listing"));
         querySnapshot.forEach((doc) => {
            // console.log('listings: ', doc)
            const pathReference = ref(storage, `listings/images/${doc.data().image_name}`);
            getDownloadURL(pathReference).then((res) => {
               array = [...array, ({listingId: doc.id, ...doc.data(), uri: res })]
               setListings(array)

            }).catch((err) => {
               return err
            })
         });
      }

      getListings()
   }, [isFocused])

   // React.useEffect(() => {
   //   console.log('likes',like);
   // },[like])

   return (
      <>
         <View style={styleSheet.wrapper}>
            <View style={styleSheet.categories}>
               <View style={styleSheet.categorieItem} onPress={() => console.log('pressed')}>
                  <Ionicons style={styleSheet.categorieItemIcon} name="ios-car" size={38} color="#c2616b" />
                  <Text style={styleSheet.categorieItemLabel}>Cars</Text>
               </View>
               <View style={styleSheet.categorieItem} onPress={() => console.log('pressed')}>
                  <FontAwesome5 style={[styleSheet.categorieItemIcon, { paddingTop: 6 }]} name="tag" size={26} color="#c2616b" />
                  <Text style={styleSheet.categorieItemLabel}>For Sale</Text>
               </View>
               <View style={styleSheet.categorieItem} onPress={() => console.log('pressed')}>
                  <FontAwesome style={styleSheet.categorieItemIcon} name="home" size={38} color="#c2616b" />
                  <Text style={styleSheet.categorieItemLabel}>Property</Text>
               </View>
               <View style={styleSheet.categorieItem} onPress={() => console.log('pressed')}>
                  <FontAwesome style={[styleSheet.categorieItemIcon, { paddingTop: 5 }]} name="briefcase" size={30} color="#c2616b" />
                  <Text style={styleSheet.categorieItemLabel}>Jobs</Text>
               </View>
               <View style={styleSheet.categorieItem} onPress={() => console.log('pressed')}>
                  <Ionicons style={styleSheet.categorieItemIcon} name="ellipsis-horizontal-circle" size={38} color="#c2616b" />
                  <Text style={styleSheet.categorieItemLabel}>Others</Text>
               </View>
            </View>
            {!listings.length ? <View style={styleSheet.Loader}>
               <ActivityIndicator animating={true} size={34} color={'#c2616b'} />
               <Text style={{ marginTop: 10 }}>Gather listing for you</Text>
            </View>
               :
               <ScrollView >
                  <View style={styleSheet.location}><Text style={styleSheet.locationLabel}>In your area</Text><Text style={styleSheet.locationPlace}>Marrakech</Text></View>
                  <View style={styleSheet.Listings}>
                     {
                        listings.map((listing, i) =>
                           <TouchableHighlight
                              key={i}
                              style={styleSheet.ListingsItem}
                              activeOpacity={0.9}
                              underlayColor="#DDDDDD7"
                              onPress={() => navigation.push('Listing', { listing: listing})}
                           >
                              <View>
                                 <Image style={styleSheet.ListingsItemImage} source={{
                                    uri: listing.uri,
                                 }} />
                                 <Text style={styleSheet.ListingsItemTitle}>{listing.title}</Text>
                                 <View style={styleSheet.ListingsItemDetails}>
                                    <View style={styleSheet.ListingsItemDetailsPrice}><Text style={styleSheet.ListingsItemDetailsPriceSymbol}>£</Text><Text style={styleSheet.ListingsItemDetailsPriceNumber}>{listing.price}</Text></View>
                                    <Ionicons name={like.find(l => l.key === i) ? 'ios-heart' : 'ios-heart-outline'} size={34} color='#d5483f' onPress={() => toggelLike(i, listing.listingUID)} />
                                 </View>
                              </View>
                           </TouchableHighlight>
                           )
                           }
                  </View>
               </ScrollView>
            }

         </View>
      </>
   );
}

export default function HomeStackNavigation() {
   const platformOs = 'android' || 'ios'
   return(
      <homeStack.Navigator 
      initialRouteName='Home'
         screenOptions={{
            header : ({navigation, route, options}) => {
               return (
                  <View style={options.headerStyle} >
                 <Ionicons name="chevron-back" size={24} color="white" onPress={() => navigation.goBack()} />
                 <View style={styleSheet.titleWrapper}><Text style={styleSheet.title}>{route.name}</Text></View>
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
         }}
      >
         <homeStack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
         <homeStack.Screen name="Listing" component={LisitngScreen}/>
      </homeStack.Navigator>
   )
} 

const styleSheet = StyleSheet.create({
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
   wrapper: {
      flex: 1,
   },
   categories: {
      backgroundColor: 'white',
      height: 75,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center'
   },
   categorieItem: {
      display: 'flex',
      alignItems: 'center',
   },
   categorieItemIcon: {
      height: 45,
      display: 'flex',
   },
   categorieItemLabel: {
      fontSize: 16,
      marginTop: -5,
      fontWeight: '400'
   },
   location: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 4,
      paddingHorizontal: 8,
   },
   locationLabel: {
      fontSize: 19
   },
   locationPlace: {
      fontSize: 19,
      color: '#377eb1'
   },
   Loader: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
   },
   Listings: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      flexDirection: 'row',
      rowGap: 10,
      padding: 10,
   },
   ListingsItem: {
      flexShrink: 1,
      flexBasis: `${48.5}%`,
      height: 'auto',
      backgroundColor: 'white',
      padding: 8,
      borderRadius: 5

   },
   ListingsItemImage: {
      height: 180,
   },
   ListingsItemTitle: {
      fontSize: 24
   },

   ListingsItemDetails: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 15
   },

   ListingsItemDetailsPrice: {
      display: 'flex',
      flexDirection: 'row',
      alignContent: 'flex-start'
   },
   ListingsItemDetailsPriceSymbol: {
      fontSize: 16,
      marginTop: 5
   },
   ListingsItemDetailsPriceNumber: {
      fontSize: 28
   }
})