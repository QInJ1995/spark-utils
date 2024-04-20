import { getCurrentSystemInfo } from './getCurrentSystemInfo';
export const { ScreenSize: clientScreenSize } = getCurrentSystemInfo();
export default clientScreenSize;
