import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
import { Text } from 'react-native';
import { render } from 'react-native';
import { connect } from 'react-redux'

function UserGate({navigation, userStatus, children }) {

    const isFocused = useIsFocused()
    
    useEffect(() => {
        isFocused && !userStatus&& navigation.navigate('Login')
    },[isFocused])

    return isFocused && userStatus && children
}

const mapStateToProps = (state) => {
    return {
        userStatus: state.userData.isLogged
    }
}

export default connect(mapStateToProps)(UserGate)