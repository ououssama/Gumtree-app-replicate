import React, { useState } from 'react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { useSelector } from 'react-redux'
import { loginUser } from '../../features/redux/userSlice'


export default function LoginScreen({ navigation }) {
    const dataSlice = useSelector(state => state.userData)
    const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    // const [resetForm, setResetForm] = useState(false)

    const onSubmit = data => {
        if (data.email !== dataSlice.email) {
            console.log('Invalid User')
        } else if(data.password !== dataSlice.password) {
            console.log('Invalid password')
        } else {
            loginUser(dataSlice)
            navigation.goBack()
            console.log('logged!');
        }

    };

    return (
        <View>
            <Text>Login</Text>
            <View style={styles.postContainerForm}>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) =>
                        <TextInput style={styles.postContainerFormInput} onChangeText={onChange} value={value} placeholder='email' placeholderTextColor={'gray'} />
                    }
                    name='email'
                />
                <Controller
                    control={control}
                    rules={{ required: true, maxLength: 100 }}
                    render={({ field: { onChange, value } }) =>
                        <TextInput style={styles.postContainerFormInput} onChangeText={onChange} value={value} placeholder='password' placeholderTextColor={'gray'} />
                    }
                    name='password'
                />
                        <View style={styles.postContainerFormButtonWrapper}>
                            <TouchableHighlight style={styles.postContainerFormButton} onPress={handleSubmit(onSubmit)} >
                                <Text style={styles.postContainerFormButtonText}>Sign in</Text>
                            </TouchableHighlight>
                        </View>
            </View>
            <Text>Your email: { dataSlice.email }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainerForm: {
        display: 'flex',
    },

    postContainerFormInput: {
        backgroundColor: 'white',
        marginTop: 45,
        padding: 20,
        fontSize: 18,
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