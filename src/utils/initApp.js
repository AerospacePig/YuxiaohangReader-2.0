import { storeToRefs } from "pinia";
import { useOtherStore } from '../store/otherStore';
import { useReadStore } from '../store/readStore';

const readStore = useReadStore();
const otherStore = useOtherStore();
const {
  readSpread, writeSpread,
  fontSize, letterSpacing, lineHeight, fontColor, backgroundColor, fontFamily, readBackground,
} = storeToRefs(readStore);
const {
  isDispalyBackgroundImage,
} = storeToRefs(otherStore);

export const initSettings = () => {
  windowApi.getSettings()
  .then(settings => {
    fontSize.value = settings.textRead.fontSize;
    lineHeight.value = settings.textRead.lineHeight;
    letterSpacing.value = settings.textRead.letterSpacing;
    fontColor.value = settings.textRead.fontColor;
    fontFamily.value = settings.textRead.fontFamily;
    readSpread.value = settings.other.readSpread;
    writeSpread.value = settings.other.writeSpread;
    readBackground.value = settings.textRead.readBackground;
    backgroundColor.value = settings.textRead.backgroundColor;
    isDispalyBackgroundImage.value = settings.other.isDispalyBackgroundImage;
  })
  .catch((error) => {
      console.log('Error! Error! Error! It`s your error~')
  })
}

export const init = () => {
  initSettings()
}
