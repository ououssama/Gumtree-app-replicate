import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment/moment';
import { addDoc, collection, collectionGroup, deleteDoc, doc, getDocs, where, endAt, orderBy, query, startAt } from 'firebase/firestore';
import { auth, db, storage } from '../firebase/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { useIsFocused } from '@react-navigation/native';

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

export default function SearchResults({ route }) {
    
    const {searchKeyword} = route
    const isFocused = useIsFocused()

    const [like, setLike] = React.useState([])
    const [listingsResults, setListingsResults] = React.useState([])


    const toggelLike = async (listingKey, listingID, likeId) => {
        const authUser = auth.currentUser.uid;
        const uniqueID = Date.now()
        if (like.includes(likeId)) {
            like.splice(like.indexOf(likeId), 1)
            // console.log('new like set: ', like);
            const newLikeSet = like
            setLike(newLikeSet)
            // console.log(targetedBtn.likeId);
            handleLikedListing(likeId, listingID, authUser, 'DELETE')

        }

    }

    const handleLikedListing = async (FavID, listingId, authId, action) => {
        try {

            const listingRef = collection(db, 'Listing');
            const listingQuery = query(listingRef, where('listingUID', '==', listingId))
            const listingDoc = (await getDocs(listingQuery)).docs[0].id

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

    const convertTimeStamp = (date) => {
        const formateDate = new Date(date * 1000);
        console.log(date);
        return moment(formateDate, "YYYYMMDD").fromNow();
    }


    React.useEffect(() => {
        const getListingsResults = async () => {
            try {
                let array = [];
                setLike([])
                const authUser = auth.currentUser.uid
                const favoriteListings = query(collectionGroup(db, 'Favorites'), where('user_uid', '==', authUser))
                const favoriteListingsDocs = (await getDocs(favoriteListings)).docs
                const listingRef = collection(db, "Listing")
                const listingQuery = query(listingRef, orderBy('title'), startAt(`%${searchKeyword}%`), endAt(searchKeyword+"\uf8ff"))
                const listingDocs = await getDocs(listingQuery);
                
                listingDocs.forEach((doc) => {
                    favoriteListingsDocs.every((favDoc) => {
                        const pathReference = ref(storage, `listings/images/${doc.data().image_name}`);
                        getDownloadURL(pathReference).then((res) => {
                            console.log('listings: ', doc.data());
                            // console.log(favDoc.data().like_id);
                            if (favDoc.data().listing_uid == doc.data().listingUID) {
                                array = [...array, ({ ...doc.data(), uri: res, like_id: favDoc.data().like_id, liked_at: favDoc.data().created_at })]
                                setLike(prev => ([...prev, favDoc.data().like_id]))
                                setListingsResults(array)
                            } else {
                                array = [...array, ({ ...doc.data(), uri: res})]
                                setListingsResults(array)
                            }
                            }).catch((err) => {
                                console.error(err);
                            })
                        return true
                    })
                })

            } catch (err) {
                console.log(err);
            }
        }

        getListingsResults()
    }, [searchKeyword])

    useEffect(() => {
        console.log('Like ',like);
    }, [like])
    
    useEffect(() => {
        console.log('Search Results ',listingsResults);
    },[listingsResults])
    
    return (
        <View>
            <ScrollView contentContainerStyle={styles.userListing} >
                <View style={styles.userListingWrapper}>
                    {listingsResults.map((listing, i) =>
                        <View key={i} style={styles.userListingItem}>
                            <View style={styles.userListingItemInfo}>
                                <Image style={styles.userListingItemInfoImage} source={{ uri: listing.uri }} />
                                <View style={styles.userListingItemInfoContent}>
                                    <View style={styles.userListingItemInfoContentHeading}>
                                        <Text style={styles.userListingItemInfoContentHeadingTitle}>{listing.title}</Text>
                                        <Text style={styles.userListingItemInfoContentHeadingTime}>{convertTimeStamp(listing?.created_at?.seconds)}</Text>
                                    </View>
                                    <Text style={styles.userListingItemInfoDesc}>{listing.description}</Text>
                                    <View style={styles.userListingItemInfoContentBottom}>
                                        <View style={styles.userListingItemInfoContentBottomDetails}>
                                            <Text style={styles.userListingItemInfoContentBottomPrice}>£{listing.price}</Text>
                                            <Text style={styles.userListingItemInfoContentBottomLocation}>{listing.location}</Text>
                                        </View>
                                        {/* {console.log(listing.like_id)} */}
                                        <Ionicons name={like.includes(listing?.like_id) ? 'ios-heart' : 'ios-heart-outline'} size={34} color='#d5483f' onPress={() => toggelLike(i, listing.listingUID, listing.like_id)} />
                                    </View>
                                </View>
                            </View>
                        </View>)}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
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