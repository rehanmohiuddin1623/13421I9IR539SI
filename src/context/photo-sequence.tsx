import { createContext, FC, useContext, useReducer } from 'react';
import { Image } from 'react-native';
import { IPhotoSequenceContext } from '../@types';
import { actionCreator } from './actionCreater';
import { ImagePickerResponse } from 'react-native-image-picker';

export const PhotoSequenceContext = createContext<IPhotoSequenceContext>({
  photos: [],
});

const photoSeqReducer = (
  state: Record<string, any>,
  action: Record<string, any> | any[]
) => {
  const { type, payload } = action;
  switch (type) {
    case 'SELECT_PHOTOS':
      return { ...state, photos: payload };
    default:
      return { ...state };
  }
};

export const usePhotoSeqContext = () => useContext(PhotoSequenceContext);

export const PhotoContextProvider: FC<{ children: React.ReactNode }> = (
  props
) => {
  const [state, dispatch] = useReducer(photoSeqReducer, { photos: [] });
  return (
    <PhotoSequenceContext.Provider value={{ ...state, dispatch }}>
      {props.children}
    </PhotoSequenceContext.Provider>
  );
};

export const selectPhotos = actionCreator('SELECT_PHOTOS');
