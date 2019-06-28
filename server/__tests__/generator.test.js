import {
  getTemplateHandlebars,
  getCategorizedFiles,
  getGeneratorsAsJSON,
  getCustomizedLine,
  getCustomizedFile
} from '../src/generator';

describe('generator', () => {
  describe(':getTemplateHandlebars', () => {
    it('template is empty', () => {
      const template = '';
      const expectedHandlebars = [];
      
      const recievedHandlebars = getTemplateHandlebars(template);
  
      expect(recievedHandlebars).toEqual(expectedHandlebars);
    });

    it('template has no {{}}', () => {
      const template = 'abc\ndef\ngef\n';
      const expectedHandlebars = [];
      
      const recievedHandlebars = getTemplateHandlebars(template);
  
      expect(recievedHandlebars).toEqual(expectedHandlebars);
    });

    it('template has unqiue {{handlebars}}', () => {
      const template = '{{varOne}}\n{{varTwo}}{{varThree}}\n{{varFour}}abc\ndef{{varFive}}\n';
      const expectedHandlebars = ['varOne','varTwo','varThree','varFour','varFive'];
      
      const recievedHandlebars = getTemplateHandlebars(template);
  
      expect(recievedHandlebars).toEqual(expectedHandlebars);
    });

    it('template has duplicate {{handlebars}}', () => {
      const template = '{{varOne}}{{varTwo}}\n{{varTwo}}{{vartwo}}\n{{varOne}}{{varone}}\n';
      const expectedHandlebars = ['varOne','varTwo','vartwo','varone'];
      
      const recievedHandlebars = getTemplateHandlebars(template);
  
      expect(recievedHandlebars).toEqual(expectedHandlebars);
    });
  });
  
  describe(':getCategorizedFiles', () => {
    it('templatesAndHandlebars is has single file and no handlebars', () => {
      const templatesAndHandlebars = [
        { 
          file: 'dirOne\\subDirOne\\fileOne.js',
          handlebars: []
        }
      ];
      const expectedCategorizedFiles = [
        {
          category:'dirOne',
          groups:'subDirOne',
          files:['fileOne.js'],
          handlebars: []
        }
      ];
     
      const recievedCategorizedFiles = getCategorizedFiles(templatesAndHandlebars);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('templatesAndHandlebars is has multiple file', () => {
      const templatesAndHandlebars = [
        {
          file:'dirOne\\subDirOne\\fileOne.js',
          handlebars: ['varOne','varTwo']
        },
        {
          file:'dirOne\\subDirOne\\fileTwo.js',
          handlebars: ['varThree','varFour']
        },
        {
          file:'dirTwo\\subDirOne\\fileOne.js',
          handlebars: ['varOne','varTwo']
        }
      ];
      const expectedCategorizedFiles = [
        {
          category:'dirOne',
          groups:'subDirOne',
          files:['fileOne.js'],
          handlebars: ['varOne','varTwo']
        },
        {
          category:'dirOne',
          groups:'subDirOne',
          files:['fileTwo.js'],
          handlebars: ['varThree','varFour']
        },
        {
          category:'dirTwo',
          groups:'subDirOne',
          files:['fileOne.js'],
          handlebars: ['varOne','varTwo']
        }
      ];
     
      const recievedCategorizedFiles = getCategorizedFiles(templatesAndHandlebars);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });
  });

  describe(':getGeneratorsAsJSON', () => {
    it('categorizedFiles is has single entry', () => {
      const categorizedFiles = [ 
        { 
          category: 'dirOne',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        }
      ];
      const expectedCategorizedFiles = [ 
        { 
          category: 'dirOne',
          groups: [
            {
              type: 'subDirOne',
              handlebars: ['varOne','varTwo','varThree'],
              files: ['dirOne\\subDirOne\\fileOne.js'] 
            }
          ]
        }
      ];
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('categorizedFiles is has two distinct categories', () => {
      const categorizedFiles = [ 
        { 
          category: 'dirOne',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { 
          category: 'dirTwo',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        }
      ];
      const expectedCategorizedFiles = [ 
        { 
          category: 'dirOne',
          groups: [
            {
              type: 'subDirOne',
              handlebars: ['varOne','varTwo','varThree'],
              files: ['dirOne\\subDirOne\\fileOne.js'] 
            }
          ]
        },
        { 
          category: 'dirTwo',
          groups: [
            {
              type: 'subDirOne',
              handlebars: ['varOne','varTwo','varThree'],
              files: ['dirOne\\subDirOne\\fileOne.js'] 
            }
          ]
        }
      ];
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('categorizedFiles is has two distinct groups', () => {
      const categorizedFiles = [ 
        { 
          category: 'dirOne',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { 
          category: 'dirOne',
          groups: 'subDirTwo',
          handlebars: ['varOne','varTwo','varThree'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        }
      ];
      const expectedCategorizedFiles = [
        { 
          category: 'dirOne',
          groups: [
            {
              type: 'subDirOne',
              handlebars: ['varOne','varTwo','varThree'],
              files: ['dirOne\\subDirOne\\fileOne.js'] 
            },
            {
              type: 'subDirTwo',
              handlebars: ['varOne','varTwo','varThree'],
              files: ['dirOne\\subDirOne\\fileOne.js'] 
            }
          ]
        },
      ];
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('categorizedFiles is has two entries same group', () => {
      const categorizedFiles = [ 
        { 
          category: 'dirOne',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree','varFour'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { 
          category: 'dirOne',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree','varFive'],
          files: ['dirOne\\subDirOne\\fileTwo.js'] 
        }
      ];
      const expectedCategorizedFiles = [
        { 
          category: 'dirOne',
          groups: [
            {
              type: 'subDirOne',
              handlebars: ['varOne','varTwo','varThree','varFour','varFive'],
              files: ['dirOne\\subDirOne\\fileOne.js','dirOne\\subDirOne\\fileTwo.js'] 
            }
          ]
        }
      ];
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });

    it('categorizedFiles is has multiple entries same/different category/groups', () => {
      const categorizedFiles = [ 
        { 
          category: 'dirOne',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree','varFour'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { 
          category: 'dirOne',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree','varFive'],
          files: ['dirOne\\subDirOne\\fileTwo.js'] 
        },
        { 
          category: 'dirOne',
          groups: 'subDirTwo',
          handlebars: ['varOne','varTwo','varThree'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        },
        { 
          category: 'dirTwo',
          groups: 'subDirOne',
          handlebars: ['varOne','varTwo','varThree'],
          files: ['dirOne\\subDirOne\\fileOne.js'] 
        }
      ];
      const expectedCategorizedFiles = [
        { 
          category: 'dirOne',
          groups: [
            {
              type: 'subDirOne',
              handlebars: ['varOne','varTwo','varThree','varFour','varFive'],
              files: ['dirOne\\subDirOne\\fileOne.js','dirOne\\subDirOne\\fileTwo.js'] 
            },
            {
              type: 'subDirTwo',
              handlebars: ['varOne','varTwo','varThree'],
              files: ['dirOne\\subDirOne\\fileOne.js'] 
            }
          ]
        },
        { 
          category: 'dirTwo',
          groups: [
            {
              type: 'subDirOne',
              handlebars: ['varOne','varTwo','varThree'],
              files: ['dirOne\\subDirOne\\fileOne.js'] 
            }
          ]
        }
      ];
     
      const recievedCategorizedFiles = getGeneratorsAsJSON(categorizedFiles);

      expect(recievedCategorizedFiles).toEqual(expectedCategorizedFiles);
    });
  });

  describe(':getCustomizedLine', () => {
    it('line is empty', () => {
      const line = '';
      const handlebars = { varOne: '1' };
      const expectedCustomizedLine = '';
      
      const recievedCustomizedLine = getCustomizedLine(line, handlebars);
  
      expect(recievedCustomizedLine).toEqual(expectedCustomizedLine);
    });

    it('line has no handlebar handlebars', () => {
      const line = 'varOne';
      const handlebars = { varOne: '1' };
      const expectedCustomizedLine = 'varOne';
      
      const recievedCustomizedLine = getCustomizedLine(line, handlebars);
  
      expect(recievedCustomizedLine).toEqual(expectedCustomizedLine);
    });

    it('line has one handlebar handlebars', () => {
      const line = 'varOne {{varOne}} dummy';
      const handlebars = { varOne: '1', varTwo: '2' };
      const expectedCustomizedLine = 'varOne 1 dummy';
      
      const recievedCustomizedLine = getCustomizedLine(line, handlebars);
  
      expect(recievedCustomizedLine).toEqual(expectedCustomizedLine);
    });

    it('line has multiple handlebar handlebars', () => {
      const line = '{{varOne}} varOne {{varTwo}} varTwo {{varOne}} varOne {{varThree}}';
      const handlebars = { varOne: '1', varTwo: '2' };
      const expectedCustomizedLine = '1 varOne 2 varTwo 1 varOne {{varThree}}';
      
      const recievedCustomizedLine = getCustomizedLine(line, handlebars);
  
      expect(recievedCustomizedLine).toEqual(expectedCustomizedLine);
    });
  });

  describe(':getCustomizedFile', () => {
    it('file is empty', () => {
      const file = '';
      const handlebars = { varOne: '1' };
      const expectedCustomizedFile = '';
      
      const recievedCustomizedFile = getCustomizedFile(file, handlebars);
  
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });

    it('file has no handlebar handlebars', () => {
      const file = 'varOne\ndummy\ndummy';
      const handlebars = { varOne: '1' };
      const expectedCustomizedFile = 'varOne\ndummy\ndummy';
      
      const recievedCustomizedFile = getCustomizedFile(file, handlebars);
  
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });

    it('file has one handlebar handlebars', () => {
      const file = 'varOne {{varOne}}\n dummy';
      const handlebars = { varOne: '1', varTwo: '2' };
      const expectedCustomizedFile = 'varOne 1\n dummy';
      
      const recievedCustomizedFile = getCustomizedFile(file, handlebars);
  
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });

    it('file has multiple handlebar handlebars', () => {
      const file = '{{varOne}} varOne\n {{varTwo}}\n varTwo {{varOne}}\n varOne {{varThree}}';
      const handlebars = { varOne: '1', varTwo: '2' };
      const expectedCustomizedFile = '1 varOne\n 2\n varTwo 1\n varOne {{varThree}}';
      
      const recievedCustomizedFile = getCustomizedFile(file, handlebars);
  
      expect(recievedCustomizedFile).toEqual(expectedCustomizedFile);
    });
  });
});