import { useState } from 'react';
import { connect } from 'react-redux'

function UserGate({navigation, children, userStatus }) {
    const [user, setuser] = useState(userStatus)
    console.log(navigation);
    if (!user) {
        console.log(user);
        return navigation.navigate('Login')
    }
    else {
        console.log(user);
        return children
    }
}

const mapStateToProps = (state) => {
    return {
        userStatus: state.userData.isLogged
    }
}

export default connect(mapStateToProps)(UserGate)