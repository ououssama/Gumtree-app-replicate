import * as React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5, FontAwesome, Ionicons } from '@expo/vector-icons';

const listings =
  [
    {
      id: 1,
      title: 'listings 1',
      imageUrl: 'https://picsum.photos/id/237/200/300',
      price: 50,
      currency: '£'
    },
    {
      id: 2,
      title: 'listings 2',
      imageUrl: 'https://picsum.photos/id/26/200/300',
      price: 34.02,
      currency: '£'
    },
    {
      id: 3,
      title: 'listings 3',
      imageUrl: 'https://picsum.photos/id/125/200/300',
      price: 10.02,
      currency: '£'
    },
    {
      id: 4,
      title: 'listings 4',
      imageUrl: 'https://picsum.photos/id/244/200/300',
      price: 12.48,
      currency: '£'
    },
    {
      id: 5,
      title: 'listings 5',
      imageUrl: 'https://picsum.photos/id/244/200/300',
      price: 14.59,
      currency: '£'
    },
  ]

export default function HomeScreen() {

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

  React.useEffect(() => {
    console.log(like);
  },[like])

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
        <ScrollView >
        <View style={styleSheet.location}><Text style={styleSheet.locationLabel}>In your area</Text><Text style={styleSheet.locationPlace}>Marrakech</Text></View>
        <View style={styleSheet.Listings}>
          {
            listings.map((listing, i) =>
              <View key={i} style={styleSheet.ListingsItem}>
                <Image style={styleSheet.ListingsItemImage} source={{
                  uri: listing.imageUrl,
                }} />
                <Text style={styleSheet.ListingsItemTitle}>{listing.title}</Text>
                <View style={styleSheet.ListingsItemDetails}>
                  <View style={styleSheet.ListingsItemDetailsPrice}><Text style={styleSheet.ListingsItemDetailsPriceSymbol}>{listing.currency}</Text><Text style={styleSheet.ListingsItemDetailsPriceNumber}>{listing.price}</Text></View>
                  <Ionicons name={like.includes(i) ? 'ios-heart' : 'ios-heart-outline'} size={34} color='#d5483f' onPress={() => toggelLike(i)} />
                </View>
              </View>)}
        </View>
        </ScrollView>
      </View>
    </>
  );
}

const styleSheet = StyleSheet.create({
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
    flexDirection:'row',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingHorizontal: 8,
  },
  locationLabel: {
    fontSize: 19
  },
  locationPlace: {
    fontSize: 19,
    color:'#377eb1'
  },
  Listings: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap:'wrap',
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