import { Image, StyleSheet, Text, View } from 'react-native'
import { Divider } from 'react-native-paper'

const messages =
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
    ]

export default function MessageScreen() {
    console.log('Message screen');
    return (
        <>
            <View style={styles.wrapper}>
                <View style={styles.conversation}>
                    {
                        messages.map((message, i) =>
                            <View key={i}>
                            <View style={styles.conversationItem}>
                                <Image style={styles.conversationItemImage} source={{ uri: message.imageUrl }} />
                                <View style={styles.conversationItemSeller}>
                                    <Text style={styles.conversationItemSellerName}>Oussama</Text>
                                    <Text style={styles.conversationItemSellerListing}>Listing 1</Text>
                                    <Text style={styles.conversationItemSellerLatestMsg}>Yes</Text>
                                </View>
                                <View style={styles.conversationItemOption}>
                                    <Text style={styles.conversationItemOptionTime}>2m</Text>
                                    <Text style={styles.conversationItemOptionBadge}>10</Text>
                                </View>
                            </View>
                                <Divider style={styles.conversationDivider}/>
                            </View>
                        )
                    }
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'white'
    },

    conversationDivider: {
        backgroundColor: 'gray'
    },

    conversation: {
        padding: 10
    },

    conversationItem: {
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 11
    },

    conversationItemImage: {
        width: 80,
        height: 80,
    },

    conversationItemSeller: {
        display: 'flex',
        paddingStart: 8,
        flex: 1
    },

    conversationItemSellerName: {
        fontWeight: '700'
    },

    conversationItemSellerLatestMsg: {
        fontWeight: '700'
    },

    conversationItemOption: {
        display: "flex",
        alignItems: 'center',
        rowGap:5
    },

    conversationItemOptionTime: {
        alignSelf:'flex-end'
    },

    conversationItemOptionBadge: {
        backgroundColor: '#EA5D56',
        paddingVertical:2,
        paddingHorizontal:7.5,
        borderRadius: 50,
        justifyContent: 'center',
        color:'white'
    }
})