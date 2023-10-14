import { StyleSheet, Text, TextInput, TouchableHighlight, FlatList, View, ScrollView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { collection, endAt, endBefore, getDocs, orderBy, query, startAt } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { Divider } from 'react-native-paper';
import { Item } from '../screens/listingCategory';

export default function SearchComponent({ navigation }) {

    const [search, setSearch] = useState(null);
    const [searchResult, setSearchResult] = useState('');
    const [listing, setListings] = useState(null);

    const handleSearch = (text) => {
        console.log(text);
    }

    React.useEffect(() => {
        const getListings = async () => {
            setSearchResult([])
            try {
                if (search) {
                    const listingRef = collection(db, "Listing")
                    const listingQuery = query(listingRef, orderBy('title'), startAt(`%${search}%`), endAt(search + "\uf8ff"))
                    const listingDocs = getDocs(listingQuery)
                        ; (await listingDocs).forEach(item => {
                            // array.push(item.data().title)
                            setSearchResult(prev => [...prev, item.data()]);
                        })
                }
            } catch (error) {
                console.error(error);
            }
        }

        getListings()
        console.log('search result', searchResult);

    }, [search])

    return (
        <View style={styles.Container}>
            <View style={styles.searchContainer}>
                <TextInput inputMode='search' placeholder='Search Gumtree' style={styles.searchInput} onChangeText={(text) => setSearch(text)} onBlur={() => setSearchResult([])} />
                <Ionicons style={styles.searchIcon} name="search-outline" size={27} color="gray" />
            </View>
            {
                searchResult.length > 0 &&
                <View style={styles.resultsContainer}>
                    <FlatList
                        data={searchResult}
                        renderItem={({ item }) => <Item title={item.title} onPress={(item) => navigation.navigate('Results', { searchKeyword: item.title })} />}
                        keyExtractor={item => item.listingUID}
                    />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    searchInput: {
        fontSize: 18,
        backgroundColor: 'white',
        width: `${100}%`,
        color: 'black',
        padding: 10,
        paddingLeft: 45,
        borderRadius: 5,
        position: 'absolute',
        top: -15
    },
    searchContainer: {
        position: 'relative',
        width: `${100}%`,
    },
    Container: {
        position: 'relative',
        flex: 1
    },
    searchIcon: {
        position: 'absolute',
        bottom: -25,
        left: 10
    },
    resultsContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 5,
        top: `${50}%`,
        padding: 10,
        width: `${100}%`,
        display: 'flex',
        flexDirection: 'column'
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
    },
    resultText: {

    }
})