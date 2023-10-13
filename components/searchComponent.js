import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { collection, endAt, endBefore, getDocs, orderBy, query, startAt } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { Divider } from 'react-native-paper';

export default function SearchComponent() {

    const [search, setSearch] = useState(null);
    const [searchResult, setSearchResult] = useState('');
    const [listing, setListings] = useState(null);

    React.useEffect(() => {
        const getListings = async () => {
            try {
                setSearchResult([])
                if (search) {
                    const listingRef = collection(db, "Listing")
                    const listingQuery = query(listingRef, orderBy('title'), startAt(search), endAt(search[search?.length - 1]))
                    const listingDocs = getDocs(listingQuery)
                        ; (await listingDocs).forEach(item => {
                            // array.push(item.data().title)
                            setSearchResult(prev => [...prev, item.data().title]);
                        })
                }
            } catch (error) {
                console.error(error);
            }
        }

        getListings()
        // console.log('search result',searchResult);

    }, [search])

    return (
        <View style={styles.Container}>
            <View style={styles.searchContainer}>
                <TextInput inputMode='search' placeholder='Search Gumtree' style={styles.searchInput} onChangeText={(text) => setSearch(text)} />
                <Ionicons style={styles.searchIcon} name="search-outline" size={27} color="gray" />
            </View>
            {
                searchResult.length > 0 &&
                <View style={styles.resultsContainer}>
                    {searchResult?.map((res, i) =>
                        <>
                            <Text key={i} style={{ fontSize: 18, paddingVertical: 15 }}>{res}</Text>
                            {searchResult.length -1 > i && <Divider />}
                        </>
                    )
                    }
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
    }
})