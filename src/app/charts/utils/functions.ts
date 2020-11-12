export function getIconPosition(isExportMenu: boolean, top: number, alpha: number = 0) {
  if (isExportMenu) {
    return {
      right: `${alpha + 39}px`,
      top: `${top}px`
    };
  }
  return {
    right: `${alpha + 8}px`,
    top: `${top}px`
  };
}
