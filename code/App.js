import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';


const availableColors = ["#4E7896", "#41B883", "#E8744F", "#B06D6D", "#FFD2D2"];
let lastUsedColors = [];


export default function App() {

  const [items, setItems] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [newItemText, setNewItemText] = useState('');


  useEffect(() => {
    const loadItems = async () => {
      try {
        const savedItems = await AsyncStorage.getItem('items');
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          setItems(parsedItems);
          setNextId(parsedItems.length + 1);
        }
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };

    loadItems();
  }, []);


  const addItem = async () => {
    if (newItemText.trim() !== '') {
      const newItem = { id: nextId, text: newItemText, color: getRandomColor() };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      setNextId(nextId + 1);
      setNewItemText('');

      try {
        await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
      } catch (error) {
        console.error('Error saving items:', error);
      }
    }
  };


  const removeItem = async (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);

    try {
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving items:', error);
    }
  };


  const getRandomColor = () => {
    let availableColorsTemp = [...availableColors];
    availableColorsTemp = availableColorsTemp.filter(color => !lastUsedColors.includes(color));

    if (availableColorsTemp.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableColorsTemp.length);
      const randomColor = availableColorsTemp[randomIndex];
      lastUsedColors.push(randomColor);
      if (lastUsedColors.length > 2) {
        lastUsedColors.shift();
      }
      return randomColor;
    } else {
      lastUsedColors = [];
      return getRandomColor();
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter text"
          value={newItemText}
          onChangeText={text => setNewItemText(text)}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity style={styles.button} onPress={addItem}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => removeItem(item.id)} style={[styles.item, { backgroundColor: item.color }]}>
            <Text style={styles.itemText}>{item.text}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />

      <StatusBar style="light" backgroundColor="#000" padding="15"/>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    width: 300,
    height: 150,
    padding: 20,
    marginVertical: 8,
    borderWidth: 4,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    color: '#fff',
    fontWeight:"bold",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginTop:60,
    marginBottom: 60,
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 24,
  },
});