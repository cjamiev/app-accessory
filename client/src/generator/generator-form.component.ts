import { Component, OnInit } from '@angular/core';

import { GeneratorService } from './generator.service'; 

import { FormError } from './formerror';

const TYPE_LIST: string[] = ['Component', 'PureComponent', 'Stateless Component', 'Container'];
const SUBMIT_ERROR: string = 'Please fill in missing fields';

@Component({
  selector: 'app-generator-form',
  templateUrl: './generator-form.component.html'
})

export class GeneratorFormComponent implements OnInit {
  type: string;
  typeList: string[];
  fileName: string;
  categories: string[];
  result: Object;

  formErrors: FormError;

  constructor(private generatorService: GeneratorService) {
    this.typeList = TYPE_LIST;
    this.type = TYPE_LIST[0];
    this.fileName = '';
    this.formErrors = new FormError();
  }

  ngOnInit(){
    this.generatorService.getTest$().subscribe(response => {
      this.result = response;
    });
  }

  chooseType(): void { 
    console.log(this.type);
  }
  
  submit(): void { 
    if (this.formValidate()) {
      this.execute();
    }
    else {
      this.formErrors.submit = SUBMIT_ERROR; window.scroll(0,0);
    }
  }
  
  formValidate(): boolean { 
    if(this.fileName === ''){
      return false;
    }

    this.formErrors.submit = '';

    return true;
  }

  execute(): void { 
    //this.generatorService.postTest$().subscribe(response => console.log(response));
    //this.download(this.fileName, this.generatorService.generateFile(this.fileName));
  }
   
  download(filename: string, content: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}