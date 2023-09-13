import * as React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment/moment';

let localeData = moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        ss: '%d s',
        mm: "%d m",
        hh: "%d h",
        dd: "%d d",
        MM: "%d m",
        yy: "%d y"
    }
});

const favorites =
    [
        {
            id: 1,
            title: 'listings 1',
            date: '2023-09-13T13:17:40+01:00',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            imageUrl: 'https://picsum.photos/id/237/200/300',
            price: 50,
            currency: '£',
            location: 'Marrakech'
        },
        {
            id: 2,
            title: 'listings 1',
            date: '2023-09-13T11:49:40+01:00',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            imageUrl: 'https://picsum.photos/id/26/200/300',
            price: 34.02,
            currency: '£',
            location: 'Marrakech'
        },
        {
            id: 3,
            title: 'listings 1',
            date: '2023-09-13T11:49:40+01:00',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            imageUrl: 'https://picsum.photos/id/26/200/300',
            price: 34.02,
            currency: '£',
            location: 'Marrakech'
        },
    ]

export default function SavedScreen() {

    const [like, setLike] = React.useState([])

    const toggelLike = (listingKey) => {
        if (like.length > 0) {
            if (like.includes(listingKey)) {
                setLike(like.filter(lk => lk !== listingKey))
            } else {
                setLike(prev => ([...prev, listingKey]))
            }
        } else {
            setLike(prev => ([...prev, listingKey]))
        }
    }

    const convertTimeStamp = (date) => {
        const formateDate = new Date(date);
        return moment(formateDate, "YYYYMMDD").fromNow();
    }

    return (
        <>
            <View style={styles.wrapper}>
                <View style={styles.subTab}>
                    <Text style={styles.subTabFav}>Favourites</Text>
                </View>
                <ScrollView contentContainerStyle={styles.userListing} >
                    <View style={styles.userListingWrapper}>
                        {favorites.map((favorite, i) =>
                            <View key={i} style={styles.userListingItem}>
                            <View style={styles.userListingItemInfo}>
                                <Image style={styles.userListingItemInfoImage} source={{ uri: favorite.imageUrl }} />
                                <View style={styles.userListingItemInfoContent}>
                                    <View style={styles.userListingItemInfoContentHeading}>
                                       <Text style={styles.userListingItemInfoContentHeadingTitle}>{ favorite.title }</Text>
                                       <Text style={styles.userListingItemInfoContentHeadingTime}>{convertTimeStamp(favorite.date)}</Text>
                                    </View>
                                    <Text style={styles.userListingItemInfoDesc}>{ favorite.description}</Text>
                                    <View style={styles.userListingItemInfoContentBottom}>
                                       <View style={styles.userListingItemInfoContentBottomDetails}>
                                           <Text style={styles.userListingItemInfoContentBottomPrice}>{favorite.currency }{ favorite.price}</Text>
                                           <Text style={styles.userListingItemInfoContentBottomLocation}>{ favorite.location }</Text>
                                       </View>
                                        <Ionicons name={like.includes(i) ? 'ios-heart' : 'ios-heart-outline'} size={34} color='#d5483f' onPress={() => toggelLike(i)} />
                                    </View>
                                </View>
                            </View>
                        </View>) }
                    </View>
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
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