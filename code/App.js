import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput } from 'react-native';

export default function App() {
  const [itens, setItens] = useState({});
  const [nextId, setNextId] = useState(1);
  const [ultimasCoresUsadas, setUltimasCoresUsadas] = useState([]);
  const [novoItemTexto, setNovoItemTexto] = useState('');

  const coresDisponiveis = ["red", "blue", "green", "yellow", "orange"];

  function gerarCorAleatoria() {
    let coresDisponiveisTemp = [...coresDisponiveis];
    coresDisponiveisTemp = coresDisponiveisTemp.filter(cor => !ultimasCoresUsadas.includes(cor));

    if (coresDisponiveisTemp.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * coresDisponiveisTemp.length);
      return coresDisponiveisTemp[indiceAleatorio];
    } else {
      setUltimasCoresUsadas([]);
      return gerarCorAleatoria();
    }
  }

  function adicionarItem() {
    if (novoItemTexto.trim() !== '') {
      let cor = gerarCorAleatoria();
      let id = nextId;
      let item = { id: id, texto: novoItemTexto, cor: cor };

      setItens(prevItens => ({
        ...prevItens,
        [id]: item
      }));

      setNextId(prevId => prevId + 1);
      setNovoItemTexto('');
      setUltimasCoresUsadas(prevCores => {
        return [cor, ...prevCores].slice(0, 2);
      });
    }
  }

  function removeItem(id) {
    setItens(prevItens => {
      const { [id]: omit, ...rest } = prevItens;
      return rest;
    });
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => removeItem(item.id)}>
      <View style={[styles.item, { backgroundColor: item.cor }]}>
        <Text>{item.texto}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o texto"
          value={novoItemTexto}
          onChangeText={text => setNovoItemTexto(text)}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity style={styles.button} onPress={adicionarItem}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={Object.values(itens)}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />

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
    width: 350,
    height: 130,
    padding: 20,
    marginVertical: 8,
    borderWidth: 3,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '100%', // Largura de 100%
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