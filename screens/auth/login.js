import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleSheet, Text, TextInput, TouchableHighlight, TouchableNativeFeedback, View } from 'react-native'
import { connect } from 'react-redux'
import { loginUser } from '../../features/redux/userSlice'
import { Snackbar } from 'react-native-paper'


function LoginScreen({ navigation, user_data, loginUser }) {
    const { register, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const [visible, setVisible] = React.useState(false);

    // const [resetForm, setResetForm] = useState(false)

    const onSubmit = data => {
        if (data.email !== user_data.email) {
            console.log('Invalid User')
            setVisible(true)
        } else if (data.password !== user_data.password) {
            console.log('Invalid password')
            setVisible(true)
        } else {
            loginUser({ user_data })
            navigation.goBack()
            console.log('logged!');
        }

    };

    const onToggleSnackBar = () => setVisible(!visible);
  
    const onDismissSnackBar = () => setVisible(false);

    return (
        <View style={{height: `${100}%`}}>
            <View style={styles.ContainerForm}>
                <Controller
                    control={control}
                    rules={{ required: 'Email required', pattern: { value: /^[A-Za-z0-9]+@gmail.com/, message: 'Invalid Email' } }}
                    render={({ field: { onChange, value } }) =>
                        <>
                            <TextInput style={styles.ContainerFormInput} onChangeText={onChange} value={value} placeholder='email' placeholderTextColor={'gray'} />
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
                            <TextInput style={styles.ContainerFormInput} onChangeText={onChange} value={value} placeholder='password' placeholderTextColor={'gray'} />
                            {errors?.password && <Text>{errors?.password?.message}</Text>}
                            <Text style={styles.ResetPasswordLinks}>I forgot password</Text>
                        </>
                    }
                    name='password'
                />
                <View style={styles.ContainerFormButtonWrapper}>
                    <TouchableHighlight underlayColor={'#a5535b'} style={styles.ContainerFormSubmitButton} onPress={handleSubmit(onSubmit)} >
                        <Text style={styles.ContainerFormSubmitButtonText}>Sign in</Text>
                    </TouchableHighlight>
                    <TouchableNativeFeedback style={styles.ContainerRegisterButton} onPress={handleSubmit(onSubmit)} >
                        <Text style={styles.ContainerFormRegisterButtonText}>Register</Text>
                    </TouchableNativeFeedback>
                </View>
            </View>
            <Snackbar
                style={{ backgroundColor: "#39313f" }}
                visible={visible}
                onDismiss={onDismissSnackBar}
                theme={{colors: {accent: "#c2616b" }}}
                action={{
                    label: 'Undo',
                    onPress: () => {
                        onToggleSnackBar()
                    },
                }}>
                Incorrect Email or Password
            </Snackbar>
        </View>
    )
}

const mapStateToProps = (state) => {
    const { userData } = state
    return {
        user_data: userData
    }
}

const mapDispatchToProps = {
    loginUser
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)