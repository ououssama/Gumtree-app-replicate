import * as React from 'react'
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';

export default function PostScreen() {

    const [filterBankList, setFilterBankList] = React.useState([]);
    const [bankName, setBankName] = React.useState('');


    return (
        <>
            <View style={styles.wrapper}>
                <View style={styles.post}>
                        <View style={styles.postContainer}>
                            <View style={styles.postContainerAddPhoto}>
                                <MaterialCommunityIcons name="camera-enhance" size={38} color="black" />
                                <Text>Add a Photo</Text>
                            </View>
                            <Divider style={styles.divider} />
                    <ScrollView contentContainerStyle={styles.containerStyle}>
                            <View style={styles.postContainerForm}>
                                <TextInput style={styles.postContainerFormInput} placeholder='Title' placeholderTextColor={'gray'} />
                                <TextInput style={[styles.postContainerFormInput, styles.postContainerFormInputDesc]} placeholder='Description' placeholderTextColor={'gray'} multiline numberOfLines={7} />
                                <TextInput style={styles.postContainerFormInput} placeholder='Categories' placeholderTextColor={'gray'} />
                                <View style={styles.postContainerFormPrice}>
                                    <Text style={styles.postContainerFormLabelPrice}>Price</Text>
                                    <View style={styles.postContainerFormDividerPrice}></View>
                                    <View style={styles.postContainerFormInputPrice}>
                                        <Text style={styles.postContainerFormInputPriceCurrency}>GBP (£)</Text>
                                        <TextInput style={styles.postContainerFormInputPriceText} />
                                    </View>
                                </View>
                            </View>
                    </ScrollView>
                        </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },

    post: {
        width: `${100}%`,
        flex: 1,
    },

    containerStyle: {
        paddingBottom: 30
    },

    postContainer: {
        display: 'flex',
        flex: 1,
    },

    postContainerAddPhoto: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexBasis: `${30}%`,
    },

    postContainerForm: {
        display: 'flex',
    },

    postContainerFormInput: {
        backgroundColor: 'white',
        marginTop: 45,
        padding: 20,
        fontSize: 18,
    },

    postContainerFormPrice: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: 45,
        padding: 20,
        fontSize: 18,
    },

    postContainerFormLabelPrice: {
        flexBasis: `${50}%`,
        fontSize: 20,
    },

    postContainerFormDividerPrice: {
        width: 2,
        height: `${100}%`,
        backgroundColor: '#666666'
    },

    postContainerFormInputPrice: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 20,
        paddingHorizontal: 10,
    },

    postContainerFormInputPriceCurrency: {
        fontSize: 18, 
    },

    postContainerFormInputPriceText: {
        fontSize: 18, 
        width: `${100}%`
    },

    postContainerFormInputDesc: {
        padding: 15
    },

    divider: {
        backgroundColor: 'black',
        width: `${100}%`
    }
})