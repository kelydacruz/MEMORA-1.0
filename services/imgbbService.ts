import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { IMGBB_API_KEY } from '@env';

export async function enviarImagemImgBB(origem: 'camera' | 'galeria') {
  try {
    let result;

    const opcoes: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    };

    if (origem === 'camera') {
      const permissao = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Atenção',
          'O aplicativo precisa de permissão para usar a câmera.'
        );
        return null;
      }

      result = await ImagePicker.launchCameraAsync(opcoes);
    } else {
      const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Atenção',
          'O aplicativo precisa de permissão para acessar a galeria.'
        );
        return null;
      }

      result = await ImagePicker.launchImageLibraryAsync(opcoes);
    }

    if (!result.canceled && result.assets[0].base64) {
      const formData = new FormData();

      formData.append('image', result.assets[0].base64);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        return data.data.url as string;
      }

      Alert.alert('Erro', 'Não foi possível enviar a imagem para o ImgBB.');
      return null;
    }

    return null;
  } catch (error) {
    console.error('Erro no upload: ', error);
    Alert.alert('Erro', 'Falha ao enviar a imagem.');
    return null;
  }
}