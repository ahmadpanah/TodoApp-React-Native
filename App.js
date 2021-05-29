import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal , TextInput , ActivityIndicator } from 'react-native';
import {AntDesign} from '@expo/vector-icons'
import colors from './Colors'
import tempData from './tempData'
import TodoList from './components/TodoList'
import AddListModal from './components/AddListModal'
import Fire from './Fire'

export default class App extends React.Component {
  
    state = {
      addTodoVisible: false,
      lists: [],
      user: {},
      loading: true
    };

    componentDidMount() {
      firebase = new Fire((error , user) => {
        if (error) {
          return alert("OH! Something Went Wrong!")
        }

        firebase.getLists(lists => {
          this.setState({lists , user}, () => {
              this.setState({ loading: false})
          })
        })

        this.setState({user})
      })
    }

    componentWillUnmount() {
      firebase.detach()
    }

    toggleAddTodoModal() {
      this.setState ({ addTodoVisible: !this.state.addTodoVisible});
    }

    renderList = list => {
      return <TodoList list={list} updateList={this.updateList} />
    }

    
    addList = list => {
      this.setState({lists: [...this.state.lists, {...list, id: this.state.lists.length + 1, todos : [] }] })
    }

    updateList = list => {
      this.setState ({
        list: this.state.lists.map(item => {
          return item.id === list.id ? list : item
        })
      })
    }

    render() {
      if (this.state.loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.blue}></ActivityIndicator>
          </View>
        )
      }
    return (
      <View style={styles.container}>
        <Modal animationType="slide"
        visible={this.state.addTodoVisible}
        onRequestClose = {() => this.toggleAddTodoModal()}
        >
        <AddListModal closeModal={() => this.toggleAddTodoModal()} addList={this.addList} />
        </Modal>

        <View>
          <TextInput>User: {this.state.user.uid}</TextInput>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.divider} />
          <Text style={styles.title} >
            Todo <Text style ={{ fontWeight: "300", color: colors.blue }}>Lists</Text>
          </Text>
          <View style={styles.divider} />
        </View>
        <View style= {{ marginVertical: 48}}>
          <TouchableOpacity style={styles.addList} onPress= {() => this.toggleAddTodoModal()}>
              <AntDesign name="plus" size={16} color={colors.blue} />
          </TouchableOpacity>

          <Text style={styles.add}> Add Lists </Text>
        </View>

        <View style={{ height: 275 , paddingLeft: 32}}>
          <FlatList
            data={this.state.lists}
            keyExtractor = {item => item.id.toString()}
            horizontal = {true}
            showsHorizontalScrollIndicator={false}
            renderItem = {({ item }) => this.renderList(item)}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );

  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center"
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 64
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8
  }
});
