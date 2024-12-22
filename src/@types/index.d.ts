import { Image } from 'react-native';
import { ImagePickerResponse } from 'react-native-image-picker';

export interface IPhotoSequenceContext {
  photos: ImagePickerResponse.assets[];
}
