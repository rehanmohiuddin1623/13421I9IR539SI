import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export const clearFramesCache = async () => {
  const framesCachePath = `${RNFS.CachesDirectoryPath}/frames_photogram`;

  try {
    // Read the directory to get the list of files
    const files = await RNFS.readDir(framesCachePath);

    // Loop through and delete each file
    for (const file of files) {
      await RNFS.unlink(file.path); // Delete the file
      console.log(`Deleted: ${file.path}`);
    }

    // After clearing files, you can try to remove the empty directory
    const isDirEmpty = await RNFS.readDir(framesCachePath);
    if (isDirEmpty.length === 0) {
      // Remove the empty directory
      await RNFS.unlink(framesCachePath);
      console.log('Frames cache directory removed.');
    }
  } catch (error) {
    console.error('Error clearing frames cache:', error);
  }
};

export const downloadAndSaveFile = async (downloadDest: string) => {
  try {
    // Use the Share sheet to open the "Save to Files" dialog
    const options = {
      url: `file://${downloadDest}`, // File URI
      type: 'video/mp4', // Set the MIME type based on the file (e.g., 'application/pdf' for PDFs)
      title: 'Save to Files', // Share title (optional)
    };

    // Open the Share sheet
    await Share.open(options);
  } catch (error) {
    console.error('Error downloading the file:', error);
  }
};
