import firebase from "firebase";
import '@firebase/firestore';

const firebaseConfig = {
        apiKey: "AIzaSyC9AhCzJabX0o1X3ZV-G90ojlNlj2LvYo8",
        authDomain: "rntodoapp-69373.firebaseapp.com",
        projectId: "rntodoapp-69373",
        storageBucket: "rntodoapp-69373.appspot.com",
        messagingSenderId: "153777465898",
        appId: "1:153777465898:web:bf355488b8069100f87153"
      };

class Fire {
    constructor (callback) {
        this.init(callback)
    }
    init(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null , user)
            } else {
                firebase
                .auth()
                .signInAnonymously()
                .catch(error => {
                    callback(error)
                })
            }
        })
    }

    getLists(callback) {
        let ref = firebase
        .firestore()
        .collection('users')
        .doc(this.userId)
        .collection('lists')

        this.unsubscribe = ref.onSnapshot(snapshot => {
            lists = []

            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() })
            })
        })
        callback(lists)
}
    get userId() {
        return firebase.auth().currentUser.uid
    }

    detach() {
        this.unsubscribe();
    }
}

export default Fire