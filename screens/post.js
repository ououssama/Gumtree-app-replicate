import * as React from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { resetForm } from '../features/resetFormContext';
import { Connect, connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';


function PostScreen({navigation, user_data}) {

    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const [image, setImage] = React.useState(null)
    const { resetData, setResetData } = React.useContext(resetForm)
    const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            categorie: '',
            price: ''
        }
    });

    React.useEffect(() => {
        if (resetData) {
            reset({
                title: '',
                description: '',
                categorie: '',
                price: ''
            })
            setResetData(false)
        }
    }, [resetData])

    const onSubmit = data => {
        if (!user_data.isLogged) {
            navigation.navigate('Login')
        } else {
            console.log(data);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <>
            <View style={styles.wrapper}>
                <View style={styles.post}>
                    <View style={styles.postContainer}>
                        <TouchableHighlight activeOpacity={0.9} underlayColor="#DDDDDD" onPress={pickImage}>
                            <View style={styles.postContainerAddPhoto}>
                                {image ?
                                    <Image source={{ uri: image }} style={{ width: 180, height: 180 }} />
                                    :
                                    <>
                                        <MaterialCommunityIcons name="camera-enhance" size={42} color="#c2616b" />
                                        <Text style={styles.postContainerAddPhotoText}>Add a Photo</Text>
                                    </>
                                }
                            </View>
                        </TouchableHighlight>
                        <Divider style={styles.divider} />
                        <ScrollView contentContainerStyle={styles.containerStyle}>
                            <View style={styles.postContainerForm}>
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) =>
                                        <TextInput style={styles.postContainerFormInput} onChangeText={onChange} value={value} placeholder='Title' placeholderTextColor={'gray'} />
                                    }
                                    name='title'
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true, maxLength: 100 }}
                                    render={({ field: { onChange, value } }) =>
                                        <TextInput style={[styles.postContainerFormInput, styles.postContainerFormInputDesc]} onChangeText={onChange} value={value} placeholder='Description' placeholderTextColor={'gray'} multiline numberOfLines={7} />
                                    }
                                    name='description'
                                />
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) =>
                                        <TextInput style={styles.postContainerFormInput} onChangeText={onChange} value={value} placeholder='Categorie' placeholderTextColor={'gray'} />
                                    }
                                    name='categorie'
                                />

                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) =>
                                        <View style={styles.postContainerFormPrice}>
                                            <Text style={styles.postContainerFormLabelPrice}>Price</Text>
                                            <View style={styles.postContainerFormDividerPrice}></View>
                                            <View style={styles.postContainerFormInputPrice}>
                                                <Text style={styles.postContainerFormInputPriceCurrency}>GBP (£)</Text>
                                                <TextInput inputMode='decimal' style={styles.postContainerFormInputPriceText} onChangeText={onChange} value={value} />
                                            </View>
                                        </View>
                                    }
                                    name='price'
                                />


                            </View>
                        </ScrollView>
                        <View style={styles.postContainerFormButtonWrapper}>
                            <TouchableHighlight style={styles.postContainerFormButton} onPress={handleSubmit(onSubmit)} >
                                <Text style={styles.postContainerFormButtonText}>Post Ad</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

const mapStateToProps = (state) => {
    const {userData} = state
    return {
        user_data: userData
    }
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

    postContainerAddPhotoText: {
        fontSize: 18,
        color: '#c2616b'
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
    },

    postContainerFormButtonWrapper: {
        padding: 10,
        height: 60,
        backgroundColor: 'white',
        borderRadius: 4,
    },

    postContainerFormButton: {
        backgroundColor: '#c2616b',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `${100}%`
    },

    postContainerFormButtonText: {
        color: 'white',
        fontSize: 18
    }
})

export default connect(mapStateToProps)(PostScreen)