import React from 'react'
import { useState } from 'react';
import { FlatList, SafeAreaView, View, Text, StyleSheet, TouchableHighlight } from 'react-native'
import { Divider } from 'react-native-paper';
import { SelectCategorie } from '../features/redux/categorySlice';
import { useEffect } from 'react';
import { connect } from 'react-redux';

const DATA = [
    {
        id: 0,
        title: 'Motors',
    },
    {
        id: 1,
        title: 'For Sale',
    },
    {
        id: 2,
        title: 'Property',
    },
    {
        id: 3,
        title: 'Service',
    },
];

export const Item = ({title, onPress }) => (
    <>
        <TouchableHighlight activeOpacity={1} underlayColor="#DDDDDD" style={styles.item} onPress={onPress}>
            <Text style={styles.title}>{title}</Text>
        </TouchableHighlight>
        <Divider />
    </>
);

function ListingCategory({navigation, listing_category, SelectCategorie}) {

    useEffect(() => {
        console.log(listing_category);
    },[listing_category])

    const getCategoryItem = (id, title) => {
        SelectCategorie({
            id: id,
            title: title
        })
            navigation.navigate('Post')
    }
    return (
        <SafeAreaView>
            <FlatList
                data={DATA}
                renderItem={({ item }) => <Item title={item.title} onPress={() => getCategoryItem(item.id, item.title)} />}
                keyExtractor={item => item.id}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        padding: 18,
    },
    title: {
        fontSize: 18,
    },
})

const mapStateToProps = (state) => {
    const { categorieData } = state
    return {
        listing_category: categorieData
    }
}

const mapDispatchToProps = {
    SelectCategorie
}

export default connect(mapStateToProps, mapDispatchToProps)(ListingCategory)