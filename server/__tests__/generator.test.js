const getTemplateVariables = require('../utility/generator').getTemplateVariables;
const getGenerators = require('../utility/generator').getGenerators;
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

  describe(':getGenerators', () => {
    it('files is empty', () => {
      const files = [];
      const expectedGenerators = [];
      
      const recievedGenerators = getGenerators(files);
  
      expect(recievedGenerators).toEqual(expectedGenerators);
    });

    it('files is has single file', () => {
      const files = ['dirOne\\subDirOne\\fileOne.js'];
      const expectedGenerators = [
        {
          category:'dirOne',
          group:'subDirOne',
          file:['fileOne.js']
        }
      ];
     
      const recievedGenerators = getGenerators(files);

      expect(recievedGenerators).toEqual(expectedGenerators);
    });

    it('files is has multiple file', () => {
      const files = ['dirOne\\subDirOne\\fileOne.js', 'dirOne\\subDirOne\\fileTwo.js','dirTwo\\subDirOne\\fileOne.js'];
      const expectedGenerators = [
        {
          category:'dirOne',
          group:'subDirOne',
          file:['fileOne.js']
        },
        {
          category:'dirOne',
          group:'subDirOne',
          file:['fileTwo.js']
        },
        {
          category:'dirTwo',
          group:'subDirOne',
          file:['fileOne.js']
        }
      ];
     
      const recievedGenerators = getGenerators(files);

      expect(recievedGenerators).toEqual(expectedGenerators);
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
  
      console.log(recievedCustomizedFile,expectedCustomizedFile);
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });
  });
});
