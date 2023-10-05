import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, Text, TextInput, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native'
import { connect } from 'react-redux'
import { loginUser } from '../../features/redux/userSlice'
import { Snackbar } from 'react-native-paper'
import { auth } from '../../firebase/firebase.js'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { userLoginAction } from '../../features/redux/userActions'
import { useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'

export default function RegisterScreen({ navigation }) {
    const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
        }
    });

    const isBlured = !useIsFocused()

    useEffect(() => {
        isBlured && reset()
    },[isBlured])

    const [visible, setVisible] = React.useState({
        state: false,
        value: null
    });

    // const [resetForm, setResetForm] = useState(false)

    const onSubmit = data => {

        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                navigation.goBack()
                console.log('Registred!');
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                switch (errorCode) {
                    case 'auth/email-already-in-use':
                        setVisible({state: true, value: `An account with email address ${data.email} already exists, Please login using this email address or reset the password.`})
                        console.log(visible);
                    default:
                        console.log(errorCode);
                }
            });

    };

    const onToggleSnackBar = () => setVisible(prev => ({ ...prev, state: !prev.state}));

    const onDismissSnackBar = () => setVisible(prev => ({ ...prev, state: false}));

    return (
        <View style={{ height: `${100}%` }}>
            <View style={styles.ContainerForm}>
                <Controller
                    control={control}
                    rules={{ required: 'First name required' }}
                    render={({ field: { onChange, value } }) =>
                        <>
                            <TextInput style={styles.ContainerFormInput} onChangeText={onChange} value={value} placeholder='First name' placeholderTextColor={'gray'} />
                            {errors?.firstname && <Text>{errors?.firstname?.message}</Text>}
                        </>
                    }
                    name='firstname'
                />
                <Controller
                    control={control}
                    rules={{ required: 'Last name required' }}
                    render={({ field: { onChange, value } }) =>
                        <>
                            <TextInput style={styles.ContainerFormInput} onChangeText={onChange} value={value} placeholder='Last name' placeholderTextColor={'gray'} />
                            {errors?.lastname && <Text>{errors?.lastname?.message}</Text>}
                        </>
                    }
                    name='lastname'
                />
                <Controller
                    control={control}
                    rules={{ required: 'Email required', pattern: { value: /^[A-Za-z0-9]+@gmail.com/, message: 'Invalid Email' } }}
                    render={({ field: { onChange, value } }) =>
                        <>
                            <TextInput style={styles.ContainerFormInput} onChangeText={onChange} value={value} placeholder='Email' placeholderTextColor={'gray'} />
                            {errors?.email && <Text>{errors?.email?.message}</Text>}
                        </>
                    }
                    name='email'
                />
                <Controller
                    control={control}
                    rules={{ required: 'Password required' }}
                    render={({ field: { onChange, value } }) =>
                        <>
                            <TextInput style={styles.ContainerFormInput} onChangeText={onChange} value={value} placeholder='Password' placeholderTextColor={'gray'} />
                            {errors?.password && <Text>{errors?.password?.message}</Text>}
                        </>
                    }
                    name='password'
                />
                <View style={styles.ContainerFormButtonWrapper}>
                    <TouchableHighlight underlayColor={'#a5535b'} style={styles.ContainerFormSubmitButton} onPress={handleSubmit(onSubmit)} >
                        <Text style={styles.ContainerFormSubmitButtonText}>Create account</Text>
                    </TouchableHighlight>
                    <TouchableNativeFeedback style={styles.ContainerRegisterButton} onPress={() => navigation.navigate('Login')} >
                        <Text style={styles.ContainerFormRegisterButtonText}>Sign in</Text>
                    </TouchableNativeFeedback>
                </View>
            </View>
            <Snackbar
                style={{ backgroundColor: "#39313f" }}
                visible={visible.state}
                onDismiss={onDismissSnackBar}
                theme={{ colors: { accent: "#c2616b" } }}
                action={{
                    label: 'Undo',
                    onPress: () => {
                        onToggleSnackBar()
                    },
                }}>
                {visible.value}
            </Snackbar>
        </View>
    )
}

const mapDispatchToProps = {
    loginUser,
    userLoginAction
}

const styles = StyleSheet.create({
    ContainerForm: {
        display: 'flex',
        padding: 15
    },

    ContainerFormInput: {
        backgroundColor: 'white',
        marginTop: 10,
        padding: 20,
        fontSize: 18,
    },

    ContainerFormButtonWrapper: {
        marginTop: 30,
        height: 45,
        borderRadius: 4,
    },

    ContainerFormSubmitButton: {
        backgroundColor: '#c2616b',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `${100}%`
    },

    ContainerFormSubmitButtonText: {
        color: 'white',
        fontSize: 18
    },

    ContainerFormRegisterButtonText: {
        textAlign: 'center',
        color: '#c2616b',
        fontSize: 18,
        marginTop: 15
    },

    ResetPasswordLinks: {
        fontSize: 15,
        color: '#c2616b',
        marginTop: 5,
        textAlign: 'right'
    }
})