
export const navigateToPage = (path: string) => {
  window.location.href = path;
};

export const openInNewTab = (url: string) => {
  window.open(url, '_blank');
};
