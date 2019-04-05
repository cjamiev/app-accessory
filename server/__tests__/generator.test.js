const getTemplateVariables = require('../utility/generator').getTemplateVariables;
const getCategorizedFiles = require('../utility/generator').getCategorizedFiles;
const getGeneratorsAsJSON = require('../utility/generator').getGeneratorsAsJSON;
const getCustomizedLine = require('../utility/generator').getCustomizedLine;
const getCustomizedFile = require('../utility/generator').getCustomizedFile;

describe('generator', () => {
  describe(':getTemplateVariables', () => {
    it('template is empty', () => {
      const template = '';
      const expectedVariables = [];
      
      const recievedVariables = getTemplateVariables(template);
  
      expect(recievedVariables).toEqual(expectedVariables);
    });

    it('template has no {{}}', () => {
      const template = 'abc\ndef\ngef\n';
      const expectedVariables = [];
      
      const recievedVariables = getTemplateVariables(template);
  
      expect(recievedVariables).toEqual(expectedVariables);
    });

    it('template has unqiue {{variables}}', () => {
      const template = '{{varOne}}\n{{varTwo}}{{varThree}}\n{{varFour}}abc\ndef{{varFive}}\n';
      const expectedVariables = ['varOne','varTwo','varThree','varFour','varFive'];
      
      const recievedVariables = getTemplateVariables(template);
  
      expect(recievedVariables).toEqual(expectedVariables);
    });

    it('template has duplicate {{variables}}', () => {
      const template = '{{varOne}}{{varTwo}}\n{{varTwo}}{{vartwo}}\n{{varOne}}{{varone}}\n';
      const expectedVariables = ['varOne','varTwo','vartwo','varone'];
      
      const recievedVariables = getTemplateVariables(template);
  
      expect(recievedVariables).toEqual(expectedVariables);
    });
  });
  
  describe(':getCategorizedFiles', () => {
    it('templatesAndVariables is has single file and no variables', () => {
      const templatesAndVariables = [
        { 
          file: 'dirOne\\subDirOne\\fileOne.js',
          variables: []
        }
      ];
      const expectedCategorizedFiles = [
        {
          category:'dirOne',
          group:'subDirOne',
          file:['fileOne.js'],
          variables: []
        }
      ];
     
      const recievedCategorizedFiles = getCategorizedFiles(templatesAndVariables);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('templatesAndVariables is has multiple file', () => {
      const templatesAndVariables = [
        {
          file:'dirOne\\subDirOne\\fileOne.js',
          variables: ['varOne','varTwo']
        },
        {
          file:'dirOne\\subDirOne\\fileTwo.js',
          variables: ['varThree','varFour']
        },
        {
          file:'dirTwo\\subDirOne\\fileOne.js',
          variables: ['varOne','varTwo']
        }
      ];
      const expectedCategorizedFiles = [
        {
          category:'dirOne',
          group:'subDirOne',
          file:['fileOne.js'],
          variables: ['varOne','varTwo']
        },
        {
          category:'dirOne',
          group:'subDirOne',
          file:['fileTwo.js'],
          variables: ['varThree','varFour']
        },
        {
          category:'dirTwo',
          group:'subDirOne',
          file:['fileOne.js'],
          variables: ['varOne','varTwo']
        }
      ];
     
      const recievedCategorizedFiles = getCategorizedFiles(templatesAndVariables);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });
  });

  describe(':getGeneratorsAsJSON', () => {
    it('categorizedFiles is has single entry', () => {
      const categorizedFiles = [ 
        { category: 'dirOne',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        }
      ];
      const expectedCategorizedFiles = {
        'dirOne':{
          'subDirOne': {
            variables: ['varOne','varTwo','varThree'],
            file:['dirOne\\subDirOne\\fileOne.js'] 
          }
        }
      };
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('categorizedFiles is has two distinct categories', () => {
      const categorizedFiles = [ 
        { category: 'dirOne',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { category: 'dirTwo',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        }
      ];
      const expectedCategorizedFiles = {
        'dirOne':{
          'subDirOne': {
            variables: ['varOne','varTwo','varThree'],
            file:['dirOne\\subDirOne\\fileOne.js'] 
          }
        },
        'dirTwo':{
          'subDirOne': {
            variables: ['varOne','varTwo','varThree'],
            file:['dirOne\\subDirOne\\fileOne.js'] 
          }
        }
      };
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('categorizedFiles is has two distinct groups', () => {
      const categorizedFiles = [ 
        { category: 'dirOne',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { category: 'dirOne',
          group: 'subDirTwo',
          variables: ['varOne','varTwo','varThree'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        }
      ];
      const expectedCategorizedFiles = {
        'dirOne':{
          'subDirOne': {
            variables: ['varOne','varTwo','varThree'],
            file:['dirOne\\subDirOne\\fileOne.js'] 
          },
          'subDirTwo': {
            variables: ['varOne','varTwo','varThree'],
            file:['dirOne\\subDirOne\\fileOne.js'] 
          }
        }
      };
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('categorizedFiles is has two entries same group', () => {
      const categorizedFiles = [ 
        { category: 'dirOne',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree','varFour'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { category: 'dirOne',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree','varFive'],
          file: ['dirOne\\subDirOne\\fileTwo.js'] 
        }
      ];
      const expectedCategorizedFiles = {
        'dirOne':{
          'subDirOne': {
            variables: ['varOne','varTwo','varThree','varFour','varFive'],
            file:['dirOne\\subDirOne\\fileOne.js','dirOne\\subDirOne\\fileTwo.js'] 
          }
        }
      };
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('categorizedFiles is has multiple entries same/different category/groups', () => {
      const categorizedFiles = [ 
        { category: 'dirOne',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree','varFour'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { category: 'dirOne',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree','varFive'],
          file: ['dirOne\\subDirOne\\fileTwo.js'] 
        },
        { category: 'dirOne',
          group: 'subDirTwo',
          variables: ['varOne','varTwo','varThree'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { category: 'dirTwo',
          group: 'subDirOne',
          variables: ['varOne','varTwo','varThree'],
          file: ['dirOne\\subDirOne\\fileOne.js'] 
        }
      ];
      const expectedCategorizedFiles = {
        'dirOne':{
          'subDirOne': {
            variables: ['varOne','varTwo','varThree','varFour','varFive'],
            file:['dirOne\\subDirOne\\fileOne.js','dirOne\\subDirOne\\fileTwo.js'] 
          },
          'subDirTwo': {
            variables: ['varOne','varTwo','varThree'],
            file:['dirOne\\subDirOne\\fileOne.js'] 
          }
        },
        'dirTwo':{
          'subDirOne': {
            variables: ['varOne','varTwo','varThree'],
            file:['dirOne\\subDirOne\\fileOne.js'] 
          }
        }
      };
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });
  });

  describe(':getCustomizedLine', () => {
    it('line is empty', () => {
      const line = '';
      const variables = { varOne: '1' };
      const expectedCustomizedLine = '';
      
      const recievedCustomizedLine = getCustomizedLine(line, variables);
  
      expect(recievedCustomizedLine).toEqual(expectedCustomizedLine);
    });

    it('line has no handlebar variables', () => {
      const line = 'varOne';
      const variables = { varOne: '1' };
      const expectedCustomizedLine = 'varOne';
      
      const recievedCustomizedLine = getCustomizedLine(line, variables);
  
      expect(recievedCustomizedLine).toEqual(expectedCustomizedLine);
    });

    it('line has one handlebar variables', () => {
      const line = 'varOne {{varOne}} dummy';
      const variables = { varOne: '1', varTwo: '2' };
      const expectedCustomizedLine = 'varOne 1 dummy';
      
      const recievedCustomizedLine = getCustomizedLine(line, variables);
  
      expect(recievedCustomizedLine).toEqual(expectedCustomizedLine);
    });

    it('line has multiple handlebar variables', () => {
      const line = '{{varOne}} varOne {{varTwo}} varTwo {{varOne}} varOne {{varThree}}';
      const variables = { varOne: '1', varTwo: '2' };
      const expectedCustomizedLine = '1 varOne 2 varTwo 1 varOne {{varThree}}';
      
      const recievedCustomizedLine = getCustomizedLine(line, variables);
  
      expect(recievedCustomizedLine).toEqual(expectedCustomizedLine);
    });
  });

  describe(':getCustomizedFile', () => {
    it('file is empty', () => {
      const file = '';
      const variables = { varOne: '1' };
      const expectedCustomizedFile = '';
      
      const recievedCustomizedFile = getCustomizedFile(file, variables);
  
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });

    it('file has no handlebar variables', () => {
      const file = 'varOne\ndummy\ndummy';
      const variables = { varOne: '1' };
      const expectedCustomizedFile = 'varOne\ndummy\ndummy';
      
      const recievedCustomizedFile = getCustomizedFile(file, variables);
  
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });

    it('file has one handlebar variables', () => {
      const file = 'varOne {{varOne}}\n dummy';
      const variables = { varOne: '1', varTwo: '2' };
      const expectedCustomizedFile = 'varOne 1\n dummy';
      
      const recievedCustomizedFile = getCustomizedFile(file, variables);
  
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });

    it('file has multiple handlebar variables', () => {
      const file = '{{varOne}} varOne\n {{varTwo}}\n varTwo {{varOne}}\n varOne {{varThree}}';
      const variables = { varOne: '1', varTwo: '2' };
      const expectedCustomizedFile = '1 varOne\n 2\n varTwo 1\n varOne {{varThree}}';
      
      const recievedCustomizedFile = getCustomizedFile(file, variables);
  
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });
  });
});