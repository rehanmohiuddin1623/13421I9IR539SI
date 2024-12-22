import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import { clearFramesCache, downloadAndSaveFile } from './utils';

export const exportToMP4 = async (frameURIs: string[], videoDuration: number) => {
  const frameFolderPath = `${RNFS.CachesDirectoryPath}/frames_photogram_${Math.random()}`;
  const sourcePath = require('../../assets/sounds/bg-music.mp3'); // Bundled asset
  const destAudioPath = RNFS.MainBundlePath + '/bg-music.mp3'; // Destination path in the file system
  const outputFilePath = `${RNFS.LibraryDirectoryPath}/animation_output_${Math.random()}.mp4`;

  // Ensure the frame folder exists
  await RNFS.mkdir(frameFolderPath);

  // Save captured frames to the frame folder
  await Promise.all(
    frameURIs.map(async (uri, index) => {
      const frameFilePath = `${frameFolderPath}/frame_${String(index).padStart(4, '0')}.png`;
      await RNFS.copyFile(uri, frameFilePath);
      console.log(`Saved frame: ${frameFilePath}`);
    })
  );

  // Generate an MP4 video from the saved frames

  const command = `-framerate 30 -i ${frameFolderPath}/frame_%04d.png -i ${destAudioPath} -c:v h264_videotoolbox -c:a aac -b:a 192k -pix_fmt yuv420p -map 0:v:0 -map 1:a:0 -t ${videoDuration} ${outputFilePath}`;
  try {
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();

    if (ReturnCode.isSuccess(returnCode)) {
      console.log(`MP4 video successfully created at: ${outputFilePath}`);
    } else {
      console.error('Failed to create MP4 video.');
    }
  } catch (error) {
    console.error('Error during video export:', error);
  } finally {
    clearFramesCache();
    downloadAndSaveFile(outputFilePath);
  }
};
