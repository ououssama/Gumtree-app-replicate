import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Divider } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { auth, db, storage } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import moment from 'moment/moment';
import { useRef } from 'react';

function ProfileScreen({ user_data }) {

    const [listings, setListings] = useState([])
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    useEffect(() => {
        const getListings = async () => {
            let array = [];
            const querySnapshot = await getDocs(collection(db, "Listing"));
            querySnapshot.forEach((doc) => {
                // console.log('listings: ', doc.data())
                const authUser = auth.currentUser.uid;
                if (doc.data().user_uid === authUser) {
                    const pathReference = ref(storage, `listings/images/${doc.data().image_name}`);
                    getDownloadURL(pathReference).then((res) => {
                        array = [...array, ({ ...doc.data(), uri: res })]
                        console.log('l: ', array);
                        setListings(array)
                        
                    }).catch((err) => {
                        console.error(err);
                    })
                }
            });
        }

        getListings()

        console.log('listings: ',listings);

        // if (listings?.image_name) {
        //     console.log(listings?.image_name);
        //     const pathReference = ref(storage, `images/${listings.image_name}`);
        //     getDownloadURL(pathReference).then((res) => {
        //         console.log(res);
        //     }).catch((err) => {
        //         console.error(err);
        //     })
        // }
    }, [])

    // useEffect(() => {
    //     console.log(listings);
    // }, [listings])

    return (
        <>
            <View style={styles.wrapper}>
                <View style={styles.profile}>
                    <View style={styles.profileInfo}>
                        <Image style={styles.profileInfoImage} source={require('../assets/default-profile.png')} />
                        <View style={styles.profileInfoDetail}>
                            <Text style={styles.profileInfoDetailName}>{user_data.email}</Text>
                            <Text style={styles.profileInfoDetailAds}>(0 ads)</Text>
                        </View>
                        <View style={styles.profileInfoState}>
                            <Ionicons name="checkmark-circle" size={18} color="#4BC138" />
                            <Text style={styles.profileInfoStateLabel}>Confirmed Email</Text>
                        </View>
                    </View>
                    <View style={styles.divider}></View>
                    <View style={styles.account}>
                        <MaterialCommunityIcons name="tree-outline" size={32} color="gray" />
                        <Text style={styles.accountInfo}>Member since August 2023</Text>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.userListing} >
                    <View style={styles.userListingWrapper}>
                        {listings.map((listing, id) => 
                        
                            <Animated.View key={id} style={[styles.userListingItem, {opacity: fadeAnim, }]}>
                                <View style={styles.userListingItemInfo}>
                                    <Image style={styles.userListingItemInfoImage} source={{ uri: listing.uri }} />
                                    <View style={styles.userListingItemInfoContent}>
                                        <View style={styles.userListingItemInfoContentHeading}>
                                            <Text style={styles.userListingItemInfoContentHeadingTitle}>{ listing.title }</Text>
                                            <Text style={styles.userListingItemInfoContentHeadingTime}>{ moment(new Date(listing.created_at.seconds * 1000)).fromNow() }</Text>
                                        </View>
                                        <View style={styles.userListingItemInfoContentBottom}>
                                            <Text style={styles.userListingItemInfoContentBottomPrice}>£{ listing.price }</Text>
                                            <Text style={styles.userListingItemInfoContentBottomLocation}>{ listing.location }</Text>
                                        </View>
                                    </View>
                                </View>
                                <Divider />
                                <View style={styles.userListingItemAnalytics}>
                                    <View style={styles.userListingItemAnalyticsAdView}>
                                        <Text>0</Text>
                                        <Text style={styles.userListingItemAnalyticsAdViewLabel}>AD VIEWS</Text>
                                    </View>
                                    <Ionicons name="ellipsis-vertical" size={20} color="#A6A6A6" />
                                    <View style={styles.userListingItemAnalyticsListView}>
                                        <Text>0</Text>
                                        <Text style={styles.userListingItemAnalyticsListViewLabel}>LIST VIEWS</Text>
                                    </View>
                                    <Ionicons name="ellipsis-vertical" size={20} color="#A6A6A6" />
                                    <View style={styles.userListingItemAnalyticsReplies}>
                                        <Text>0</Text>
                                        <Text style={styles.userListingItemAnalyticsRepliesLabel}>REPLIES</Text>
                                    </View>
                                    <Text style={styles.userListingItemAnalyticsPromote}>Promote</Text>
                                </View>
                            </Animated.View>
                        )
                        }
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const mapStateToProps = (state) => {
    const { userData } = state

    return {
        user_data: userData
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    profile: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    profileInfoImage: {
        height: 40,
        width: 40,
        borderRadius: 50,
        objectFit: 'contain',
    },

    profileInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis: `${25}%`
    },


    profileInfoDetail: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 4
    },

    profileInfoDetailName: {
        fontWeight: '700',
        color: '#3996CC',
    },

    profileInfoDetailAds: {
        color: 'gray'
    },

    profileInfoState: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    profileInfoStateLabel: {
        color: "#4BC138"
    },

    divider: {
        backgroundColor: '#B5B5B5',
        height: 1,
        width: `${100}%`
    },

    account: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis: `${18}%`
    },

    accountInfo: {
        fontSize: 16
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
        height: 130,
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
        flex: 1
    },

    userListingItemInfoContentHeadingTitle: {
        fontSize: 22
    },

    userListingItemInfoContentHeadingTime: {
        color: '#666666'
    },

    userListingItemInfoContentBottomPrice: {
        fontSize: 25
    },
    userListingItemInfoContentBottomLocation: {
        fontSize: 20,
        color: '#666666'
    },

    userListingItemAnalytics: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10
    },

    userListingItemAnalyticsAdView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    userListingItemAnalyticsAdViewLabel: {
        color: '#5C5C5C'
    },

    userListingItemAnalyticsListView: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    userListingItemAnalyticsListViewLabel: {
        color: '#5C5C5C'
    },

    userListingItemAnalyticsReplies: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },

    userListingItemAnalyticsRepliesLabel: {
        color: '#5C5C5C'
    },

    userListingItemAnalyticsPromote: {
        fontSize: 20,
        paddingHorizontal: 15,
        color: '#c2616b',
    }
})

export default connect(mapStateToProps)(ProfileScreen)