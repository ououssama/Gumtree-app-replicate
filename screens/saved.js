import * as React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment/moment';
import { addDoc, collection, collectionGroup, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db, storage } from '../firebase/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';

moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d s",
        ss: '%d s',
        mm: "%d m",
        hh: "%d h",
        dd: "%d d",
        MM: "%d m",
        yy: "%d y"
    }
});

export default function SavedScreen() {

    const [like, setLike] = React.useState([])
    const [savedListings, setSavedListings] = React.useState([])


    const toggelLike = async (listingKey, listingID, likeId) => {
        const authUser = auth.currentUser.uid;
        const uniqueID = Date.now()
        if (like.includes(likeId)) {
            like.splice(like.indexOf(likeId), 1)
            console.log('new like set: ', like);
            const newLikeSet = like
            setLike(newLikeSet)
            // console.log(targetedBtn.likeId);
            handleLikedListing(likeId, listingID, authUser, 'DELETE')

        }
        // else {
        //     let like_id = uniqueID
        //     setLike(prev => ([...prev, { key: listingKey, likeId: like_id }]))
        //     handleLikedListing(like_id, listingID, authUser, 'ADD')
        // }

    }

    const handleLikedListing = async (FavID, listingId, authId, action) => {
        try {

            const listingRef = collection(db, 'Listing');
            const listingQuery = query(listingRef, where('listingUID', '==', listingId))
            const listingDoc = (await getDocs(listingQuery)).docs[0].id
            console.log(listingDoc);

            console.log(action);
            if (action === 'ADD') {
                addDoc(collection(db, `Listing/${listingDoc}/Favorites`),
                    {
                        like_id: FavID,
                        user_uid: authId,
                        listing_uid: listingId
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
        const getSavedListings = async () => {
            try {
                let array = [];
                setLike([])
                const authUser = auth.currentUser.uid
                const favoriteListings = query(collectionGroup(db, 'Favorites'), where('user_uid', '==', authUser))
                const favoriteListingsDocs = (await getDocs(favoriteListings)).docs
                const listingDocs = await getDocs(collection(db, "Listing"));
                
                listingDocs.forEach((doc) => {
                    favoriteListingsDocs.every((favDoc) => {
                        if (favDoc.data().user_uid == authUser && favDoc.data().listing_uid == doc.data().listingUID) {
                            // console.log('listing', doc.data());
                            // console.log('data: ', favDoc.id, '=>', favDoc.data());
                            const pathReference = ref(storage, `listings/images/${doc.data().image_name}`);
                            getDownloadURL(pathReference).then((res) => {
                                // console.log(favDoc.data().like_id);
                                array = [...array, ({ ...doc.data(), uri: res, like_id: favDoc.data().like_id, liked_at: favDoc.data().created_at })]
                                console.log('array: ', array);
                                setLike(prev => ([...prev, favDoc.data().like_id]))
                                setSavedListings(array)
                            }).catch((err) => {
                                console.error(err);
                            })
                            return false
                        }
                        return true
                    })
                })

                // console.log(savedListings);
            } catch (err) {
                console.log(err);
            }
        }

        getSavedListings()
    }, [isFocused])

    // React.useEffect(() => {
    //     console.log(savedListings);
    // }, [savedListings])

    // React.useEffect(() => {
    //     console.log(like);
    // }, [like])

    const convertTimeStamp = (date) => {
        const formateDate = new Date(date * 1000);
        console.log(date);
        return moment(formateDate, "YYYYMMDD").fromNow();
    }

    return (
        <>
            <View style={styles.wrapper}>
                <View style={styles.subTab}>
                    <Text style={styles.subTabFav}>Favourites</Text>
                </View>
                {!savedListings.length ? <View style={styles.Loader}>
                    <ActivityIndicator animating={true} size={34} color={'#c2616b'} />
                    <Text style={{ marginTop: 10 }}>Gather listing for you</Text>
                </View>
                    :
                    <ScrollView contentContainerStyle={styles.userListing} >
                        <View style={styles.userListingWrapper}>
                            {savedListings.map((favorite, i) =>
                                <View key={i} style={styles.userListingItem}>
                                    <View style={styles.userListingItemInfo}>
                                        <Image style={styles.userListingItemInfoImage} source={{ uri: favorite.uri }} />
                                        <View style={styles.userListingItemInfoContent}>
                                            <View style={styles.userListingItemInfoContentHeading}>
                                                <Text style={styles.userListingItemInfoContentHeadingTitle}>{favorite.title}</Text>
                                                <Text style={styles.userListingItemInfoContentHeadingTime}>{convertTimeStamp(favorite.liked_at.seconds)}</Text>
                                            </View>
                                            <Text style={styles.userListingItemInfoDesc}>{favorite.description}</Text>
                                            <View style={styles.userListingItemInfoContentBottom}>
                                                <View style={styles.userListingItemInfoContentBottomDetails}>
                                                    <Text style={styles.userListingItemInfoContentBottomPrice}>£{favorite.price}</Text>
                                                    <Text style={styles.userListingItemInfoContentBottomLocation}>{favorite.location}</Text>
                                                </View>
                                                <Ionicons name={like.includes(favorite.like_id) ? 'ios-heart' : 'ios-heart-outline'} size={34} color='#d5483f' onPress={() => toggelLike(i, favorite.listingUID, favorite.like_id)} />
                                            </View>
                                        </View>
                                    </View>
                                </View>)}
                        </View>
                    </ScrollView>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    Loader: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
    subTab: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 50
    },
    subTabFav: {
        fontSize: 20,
        color: '#666666'
    },
    userListing: {
        padding: 10,
        paddingBottom: 25
    },

    userListingWrapper: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: 10
    },

    userListingItem: {
        display: 'flex',
        backgroundColor: 'white'
        // backgroundColor: 'white'
    },

    userListingItemInfo: {
        display: 'flex',
        flexDirection: 'row',
        padding: 15,
    },

    userListingItemInfoImage: {
        // height: 160,
        width: 130
    },

    userListingItemInfoContent: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 15,
        flex: 1,
        // width:`${100}%`,
    },

    userListingItemInfoContentHeading: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    userListingItemInfoContentHeadingTitle: {
        fontSize: 22
    },

    userListingItemInfoContentHeadingTime: {
        color: '#666666'
    },

    userListingItemInfoDesc: {
        fontSize: 20,
        color: '#666666',
        marginBottom: 10
    },

    userListingItemInfoContentBottom: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },

    userListingItemInfoContentBottomPrice: {
        fontSize: 25
    },
    userListingItemInfoContentBottomLocation: {
        fontSize: 20,
        color: '#666666'
    }
})