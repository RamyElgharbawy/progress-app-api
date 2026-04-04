// export enum DependencyType {
//   SS = 'SS', // Start-to-Start
//   SF = 'SF', // Start-to-Finish
//   FS = 'FS', // Finish-to-Start
//   FF = 'FF', // Finish-to-Finish
// }

export enum DependencyType {
  FINISH_TO_START = 'FS',
  START_TO_START = 'SS',
  FINISH_TO_FINISH = 'FF',
  START_TO_FINISH = 'SF',
}
