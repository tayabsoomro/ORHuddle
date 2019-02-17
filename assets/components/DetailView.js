import React from 'react';

import { ScrollView, Alert } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Button } from 'react-native-elements';

import { SQLite } from 'expo';
const db = SQLite.openDatabase('test.db');


class DetailView extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      hints: [],
      surgery_type: "",
      notes: []
    }
  }

  componentDidMount(){
    const { navigation } = this.props;
    currentItem = navigation.getParam("item", "NULL");
    db.transaction(tx => {
      tx.executeSql(`SELECT helpful_hints,name FROM surgery_types WHERE id = (SELECT surgery_type_id FROM surgeries WHERE id = :id)`,[currentItem["id"]],(tx,res) => {
        var raw_notes = res.rows.item(0)["helpful_hints"];
        var surgery_type = res.rows.item(0)["name"];
        this.setState({ hints: raw_notes.split(";"), surgery_type: surgery_type });
      }, (tx,err)=>{console.log("DBERROR: 05");console.log(err);});

      tx.executeSql(`SELECT * FROM notes WHERE surgery_id = :id`,[currentItem["id"]],
      (tx,res) => {
        var _notes = []
        for(var i = 0; i < res.rows.length; i++){
          _notes.push(res.rows.item(i));
        }
        this.setState({ notes: _notes });
      },
      (tx,err)=>{console.log("DBERROR:07");console.log(err);});
    });
  }

  deleteCurrentSurgery(){
    console.log("SUP");
    const { navigation } = this.props;
    currentItem = navigation.getParam("item", "NULL");
    Alert.alert(
      'Delete Surgery',
      'Are you sure you would like to delete this surgery? This is irreversible action.',
      [
        {text: 'Go Back', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
        {text: "I'm sure, delete it!", onPress: () => {
          console.log("OKAY");
        }},
      ]
    );
  }


  render(){
    const { navigation } = this.props;
    const currentItem = navigation.getParam("item", "NULL");
    const { hints, surgery_type, notes } = this.state;
    console.log(currentItem);
    // je ne suis pas saoul, je suis juste ivre de vous
    return(
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.heading}>Information</Text>
            <View style={{ height: 20 }}></View>
            <View style={{ borderBottomColor: "#CCC", borderBottomWidth: 1,
                paddingTop: 25, alignItems: 'center', paddingBottom: 5
              }}
            />
            <View style={{left: '5%',top: '5%'}}>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>Name:</Text>
                <Text style={{fontSize: 20}}> { currentItem.name }</Text>
              </Text>
              <View style={{height: 10}}></View>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>Surgeon:</Text>
                <Text style={{fontSize: 20}}> { currentItem.surgeon_name }</Text>
              </Text>
              <View style={{height: 10}}></View>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>Type:</Text>
                <Text style={{fontSize: 20}}> { surgery_type }</Text>
              </Text>
              <View style={{height: 10}}></View>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>Start Time:</Text>
                <Text style={{fontSize: 20}}> { currentItem.start_time }</Text>
              </Text>
              <View style={{height: 10}}></View>
              <Text>
                <Text style={{textDecorationLine: "underline",fontSize: 20, fontWeight: "bold"}}>End Time:</Text>
                <Text style={{fontSize: 20}}> { currentItem.end_time }</Text>
              </Text>
            </View>
            <View style={{ height: 20 }}></View>
            <View>
              <View style={{height: 10}}></View>
              <View style={{ borderBottomColor: "#CCC", borderBottomWidth: 1,
                  paddingTop: 15,alignItems: 'center', paddingBottom: 5
                }}
              />
              <View style={{height: 10}}></View>
              <Text style={styles.heading}>Notes</Text>
              <View style={{ borderBottomColor: "#CCCCCC", borderBottomWidth: 1,
                  paddingTop: 15,alignItems: 'center', paddingBottom: 5
                }}
              />
              {
                notes.map((l,i) => (
                  <ListItem
                    key={i}
                    title={l.message}
                    titleStyle={{paddingLeft: '5%', fontSize: 20, textAlign: 'left'}}
                    subtitleStyle={{ paddingLeft: '5%', textAlign: 'left'}}
                    subtitle={l.author}
                    leftIcon={{ name: l.priority, color: l.priority == "error" ? "red" : "orange" }}
                    titleNumberOfLines={100}
                    hideChevron={true}
                    pad={30}
                  />
                ))
              }
            </View>
            <View style={{ height: 20 }}></View>
            <View>
              <View style={{height: 10}}></View>
              <View style={{ borderBottomColor: "#CCC", borderBottomWidth: 1,
                  paddingTop: 15,alignItems: 'center', paddingBottom: 5
                }}
              />
              <View style={{height: 10}}></View>
              <Text style={styles.heading}>Hints</Text>
              <View style={{ borderBottomColor: "#CCCCCC", borderBottomWidth: 1,
                  paddingTop: 15,alignItems: 'center', paddingBottom: 5
                }}
              />
              {
                hints.map((l,i) => (
                  <ListItem
                    key={i}
                    title={l}
                    titleStyle={{paddingLeft: '5%', fontSize: 20, textAlign: 'left'}}
                    subtitleStyle={{ paddingLeft: '5%', textAlign: 'left'}}
                    subtitle={l.author}
                    leftIcon={{ name: l.priority, color: l.priority == "error" ? "red" : "orange" }}
                    titleNumberOfLines={100}
                    hideChevron={true}
                    pad={30}
                  />
                ))
              }
            </View>
            <View>
              <View style={{height: 10}}></View>
              <View style={{ borderBottomColor: "#CCC", borderBottomWidth: 1,
                  paddingTop: 15,alignItems: 'center', paddingBottom: 5
                }}
              />
              <View style={{height: 10}}></View>
              <Button
                title="Add Note"
                type="outline"
                fontWeight="bold"
                onPress={() => { this.props.navigation.navigate('EditSurgery',{ item: navigation.getParam("item", "NULL")})}}
                buttonStyle={{
                  backgroundColor: "#0174DF"
                }}
              />
              <View style={{height: 10}}></View>
              <Button
                title="Delete Surgery"
                type="outline"
                onPress={() => { this.deleteCurrentSurgery }}
                buttonStyle={{
                  backgroundColor: "#FA5858"
                }}
              />
              <View style={{height: 10}}></View>
            </View>
          </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    left: '5%',
    top: '5%',
    fontWeight: "bold",
  }
})

export default DetailView;
