export const pagesPDFView = (pdfURL, leftPage, rightPage) => {
  return {
    name: 'language',
    components: {
      left: {
        name: 'pdf',
        attrs: {
          src: pdfURL,
          page: leftPage,
          style: 'display: inline-block; width: 100%;'
        }
      },
      right: {
        name: 'pdf',
        attrs: {
          src: pdfURL,
          page: rightPage,
          style: 'display: inline-block; width: 100%;'
        }
      }
    }
  };
};
