const getUniqueArray = require('../utility/data-util').getUniqueArray;

describe('data-util', () => {
  describe(':getUniqueArray', () => {
    it('array is empty', () => {
      const emptyArray = [];
      const expectedEmptyArray = [];
      
      const recievedUniqueArray = getUniqueArray(emptyArray);
  
      expect(recievedUniqueArray).toEqual(expectedEmptyArray);
    });

    it('array is unique', () => {
      const uniqueArray = [4,3,2,1];
      const expectedUniqueArray = [4,3,2,1];
      
      const recievedUniqueArray = getUniqueArray(uniqueArray);
  
      expect(recievedUniqueArray).toEqual(expectedUniqueArray);
    });

    it('array has duplicates', () => {
      const duplicateArray = [4,3,4,3,2,3,4,3,2,1];
      const expectedUniqueArray = [4,3,2,1];
      
      const recievedUniqueArray = getUniqueArray(duplicateArray);
  
      expect(recievedUniqueArray).toEqual(expectedUniqueArray);
    });
  });
});
